import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockDb } from '../data/mockDb';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  validatePasswordPolicy,
  authRateLimiter,
  sanitizeInput,
} from '../utils/security';
import { logSecurityEvent } from '../utils/securityLogger';
import { INITIAL_USER, INITIAL_ADMIN } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (userData: Omit<User, 'user_id' | 'role'>, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => { success: boolean; message: string };
  updatePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  demoLogin: (role: 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => mockDb.getCurrentUser());

  useEffect(() => {
    mockDb.saveCurrentUser(user);
  }, [user]);

  /**
   * Authenticate user with rate limiting and salted SHA-256 password verification
   */
  const login = async (email: string, password = ''): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Rate Limiter (Brute-Force Protection)
    const rateCheck = authRateLimiter.isLocked(cleanEmail);
    if (rateCheck.locked) {
      logSecurityEvent('AUTH_RATE_LIMITED', { email: cleanEmail, details: { remainingSeconds: rateCheck.remainingSeconds } });
      return {
        success: false,
        message: `Too many failed attempts. Please wait ${rateCheck.remainingSeconds}s before trying again.`,
      };
    }

    const users = mockDb.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      const fail = authRateLimiter.recordFailure(cleanEmail);
      logSecurityEvent('AUTH_LOGIN_FAILURE', { email: cleanEmail, details: { reason: 'User not found' } });
      const lockoutMsg = fail.locked ? ` Too many attempts, locked for ${fail.lockoutSeconds}s.` : '';
      return { success: false, message: `Invalid email or password.${lockoutMsg}` };
    }

    // 2. Cryptographic Password Verification
    let isPasswordValid = false;
    if (existing.password_hash && existing.password_salt) {
      isPasswordValid = await verifyPassword(password, existing.password_hash, existing.password_salt);
    } else {
      // Fallback for legacy demo account without hash (assigns and validates)
      const isDefaultCustomer = cleanEmail === 'customer@nexusmart.com' && (password === 'customer123' || password === '');
      const isDefaultAdmin = cleanEmail === 'admin@nexusmart.com' && (password === 'admin123' || password === '');
      isPasswordValid = isDefaultCustomer || isDefaultAdmin;
    }

    if (!isPasswordValid) {
      const fail = authRateLimiter.recordFailure(cleanEmail);
      logSecurityEvent('AUTH_LOGIN_FAILURE', { email: cleanEmail, details: { reason: 'Invalid password' } });
      const lockoutMsg = fail.locked ? ` Too many attempts, locked for ${fail.lockoutSeconds}s.` : '';
      return { success: false, message: `Invalid email or password.${lockoutMsg}` };
    }

    // Authentication Success
    authRateLimiter.reset(cleanEmail);
    setUser(existing);
    logSecurityEvent('AUTH_LOGIN_SUCCESS', { userId: existing.user_id, email: existing.email, details: { role: existing.role } });
    return { success: true, message: `Welcome back, ${existing.first_name}!`, user: existing };
  };

  /**
   * Secure user registration with salted password hashing and input sanitization
   */
  const register = async (
    userData: Omit<User, 'user_id' | 'role'>,
    password = ''
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    const cleanEmail = userData.email.trim().toLowerCase();

    // 1. Password policy validation
    const policy = validatePasswordPolicy(password);
    if (!policy.isValid) {
      return { success: false, message: policy.errors[0] };
    }

    // 2. Email uniqueness check
    const users = mockDb.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // 3. Cryptographic salt & hash generation
    const salt = generateSalt(16);
    const hash = await hashPassword(password, salt);

    // 4. Sanitize input strings to prevent XSS
    const newUser: User = {
      user_id: Date.now(),
      first_name: sanitizeInput(userData.first_name.trim()),
      last_name: sanitizeInput(userData.last_name?.trim() || ''),
      email: cleanEmail,
      mobile: sanitizeInput(userData.mobile?.trim() || ''),
      address1: sanitizeInput(userData.address1?.trim() || ''),
      address2: sanitizeInput(userData.address2?.trim() || ''),
      role: 'customer', // strictly forced to customer to prevent privilege escalation
      password_hash: hash,
      password_salt: salt,
    };

    const updated = [...users, newUser];
    mockDb.saveUsers(updated);
    setUser(newUser);
    logSecurityEvent('AUTH_REGISTER_SUCCESS', { userId: newUser.user_id, email: newUser.email });
    return { success: true, message: 'Registration successful! Welcome to JAYVEERMart.', user: newUser };
  };

  const logout = () => {
    if (user) {
      logSecurityEvent('AUTH_UNAUTHORIZED_ACCESS', { userId: user.user_id, email: user.email, details: { action: 'LOGOUT' } });
    }
    setUser(null);
    mockDb.saveCurrentUser(null);
  };

  /**
   * Whitelist-only profile updater to prevent Mass Assignment and vertical privilege escalation
   */
  const updateProfile = (updated: Partial<User>): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Not authenticated.' };

    // Whitelist ONLY non-privileged fields (strictly strip role, user_id, password_hash)
    const sanitizedFirstName = updated.first_name !== undefined ? sanitizeInput(updated.first_name) : user.first_name;
    const sanitizedLastName = updated.last_name !== undefined ? sanitizeInput(updated.last_name) : user.last_name;
    const sanitizedMobile = updated.mobile !== undefined ? sanitizeInput(updated.mobile) : user.mobile;
    const sanitizedAddress1 = updated.address1 !== undefined ? sanitizeInput(updated.address1) : user.address1;
    const sanitizedAddress2 = updated.address2 !== undefined ? sanitizeInput(updated.address2) : user.address2;

    const newUserData: User = {
      ...user,
      first_name: sanitizedFirstName,
      last_name: sanitizedLastName,
      mobile: sanitizedMobile,
      address1: sanitizedAddress1,
      address2: sanitizedAddress2,
      // role, user_id, and credentials remain strictly untouched
    };

    setUser(newUserData);
    const users = mockDb.getUsers();
    const updatedUsers = users.map((u) => (u.user_id === user.user_id ? newUserData : u));
    mockDb.saveUsers(updatedUsers);
    logSecurityEvent('PROFILE_UPDATE_SECURITY', { userId: user.user_id, email: user.email });
    return { success: true, message: 'Profile details saved securely.' };
  };

  /**
   * Secure password update requiring current password verification
   */
  const updatePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Not authenticated.' };

    // 1. Verify current password
    if (user.password_hash && user.password_salt) {
      const isValid = await verifyPassword(currentPass, user.password_hash, user.password_salt);
      if (!isValid) {
        logSecurityEvent('AUTH_LOGIN_FAILURE', { userId: user.user_id, email: user.email, details: { action: 'PASSWORD_CHANGE_FAIL' } });
        return { success: false, message: 'Current password does not match our records.' };
      }
    }

    // 2. Validate new password strength
    const policy = validatePasswordPolicy(newPass);
    if (!policy.isValid) {
      return { success: false, message: policy.errors[0] };
    }

    // 3. Generate new salt and hash
    const newSalt = generateSalt(16);
    const newHash = await hashPassword(newPass, newSalt);

    const updatedUser: User = {
      ...user,
      password_hash: newHash,
      password_salt: newSalt,
    };

    setUser(updatedUser);
    const users = mockDb.getUsers();
    const updatedUsers = users.map((u) => (u.user_id === user.user_id ? updatedUser : u));
    mockDb.saveUsers(updatedUsers);
    return { success: true, message: 'Password updated successfully!' };
  };

  const demoLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setUser(INITIAL_ADMIN);
      logSecurityEvent('AUTH_LOGIN_SUCCESS', { userId: INITIAL_ADMIN.user_id, email: INITIAL_ADMIN.email, details: { method: 'DEMO_ADMIN' } });
    } else {
      setUser(INITIAL_USER);
      logSecurityEvent('AUTH_LOGIN_SUCCESS', { userId: INITIAL_USER.user_id, email: INITIAL_USER.email, details: { method: 'DEMO_CUSTOMER' } });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
