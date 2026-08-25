import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  AdminSession,
  CustomerSession,
  CustomerAddress,
  SavedPaymentMethod,
  OtpVerificationToken,
  DeviceFingerprint,
} from '../types';
import { mockDb } from '../data/mockDb';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  validatePasswordPolicy,
  authRateLimiter,
  sanitizeInput,
  createAdminSession,
  createCustomerSession,
  isSessionInactive,
  isSessionExpired,
  verify2FAOTP,
  generateRecoveryCodes,
  generateSecureOTP,
  createOtpToken,
  verifyOtpToken,
  detectNewDevice,
  getClientDeviceMeta,
  createTokenizedCard,
  createTokenizedUpi,
} from '../utils/security';
import { logSecurityEvent } from '../utils/securityLogger';
import { INITIAL_ADMIN } from '../data/initialData';
import {
  sendCustomerLoginEmails,
  sendEmailVerificationOtp,
  sendWelcomeEmail,
  sendNewDeviceAlertEmail,
  sendPasswordChangedEmail,
  sendPasswordResetOtpEmail,
  sendTwoFactorStatusEmail,
} from '../services/emailService';

interface IdentifyResult {
  exists: boolean;
  emailOrMobile: string;
  user?: {
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
    role: 'customer' | 'admin';
    twoFactorEnabled: boolean;
  };
  message?: string;
}

interface AuthContextType {
  user: User | null;
  currentSession: AdminSession | CustomerSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  is2faVerified: boolean;

  // Step 1: Identification
  identifyAccount: (emailOrMobile: string) => IdentifyResult;

  // Step 2: Multi-step Customer Login
  login: (emailOrMobile: string, password?: string, rememberMe?: boolean) => Promise<{
    success: boolean;
    requires2FA?: boolean;
    message: string;
    user?: User;
  }>;
  verifyCustomer2FALogin: (code: string, isRecoveryCode?: boolean) => Promise<{ success: boolean; message: string }>;

  // New Customer Registration & OTP Verification
  requestRegistration: (
    userData: Omit<User, 'user_id' | 'role'>,
    password?: string
  ) => Promise<{ success: boolean; verificationToken?: string; debugOtp?: string; message: string }>;
  verifyRegistrationOtp: (
    verificationToken: string,
    enteredOtp: string
  ) => Promise<{ success: boolean; user?: User; message: string }>;
  resendRegistrationOtp: (
    verificationToken: string
  ) => { success: boolean; debugOtp?: string; message: string };

  // Password Recovery Compatibility
  requestPasswordReset: (email: string) => { success: boolean; message: string; debugOtp?: string };
  verifyPasswordReset: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  requestCustomerPasswordReset: (emailOrMobile: string) => {
    success: boolean;
    resetToken?: string;
    debugOtp?: string;
    message: string;
  };
  verifyCustomerPasswordReset: (
    resetToken: string,
    enteredOtp: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;

  // Admin Login suite
  adminLogin: (
    email: string,
    password?: string,
    rememberMe?: boolean,
    captchaAnswer?: number,
    expectedAnswer?: number
  ) => Promise<{
    success: boolean;
    requires2FA?: boolean;
    message: string;
    user?: User;
    session?: AdminSession;
  }>;
  verify2FALogin: (code: string, isRecoveryCode?: boolean) => Promise<{ success: boolean; message: string }>;

  // General Actions
  logout: () => void;
  logoutAllDevices: () => void;
  terminateSession: (sessionId: string) => void;
  getActiveSessions: () => (AdminSession | CustomerSession)[];
  getAdminSessions: () => AdminSession[];
  updateProfile: (updated: Partial<User>) => { success: boolean; message: string };
  updatePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;

  // 2FA Management
  enable2FA: (secret: string, otp: string) => { success: boolean; message: string; recoveryCodes?: string[] };
  disable2FA: (password: string) => Promise<{ success: boolean; message: string }>;
  regenerateRecoveryCodes: () => string[];

  // Customer Address Management
  getCustomerAddresses: () => CustomerAddress[];
  addCustomerAddress: (address: Omit<CustomerAddress, 'id' | 'userId'>) => { success: boolean; message: string };
  updateCustomerAddress: (address: CustomerAddress) => { success: boolean; message: string };
  deleteCustomerAddress: (id: string) => { success: boolean; message: string };
  setDefaultAddress: (id: string) => { success: boolean; message: string };

  // Customer Saved Payments (Tokenized)
  getSavedPaymentMethods: () => SavedPaymentMethod[];
  addSavedCard: (
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    cardHolderName: string,
    cardBrand?: 'Visa' | 'Mastercard' | 'RuPay' | 'Amex'
  ) => { success: boolean; message: string };
  addSavedUpi: (upiId: string) => { success: boolean; message: string };
  deleteSavedPaymentMethod: (id: string) => { success: boolean; message: string };
  setDefaultPaymentMethod: (id: string) => { success: boolean; message: string };

  refreshActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => mockDb.getCurrentUser());
  const [currentSession, setCurrentSession] = useState<AdminSession | CustomerSession | null>(() => {
    const adminSess = mockDb.getCurrentAdminSession();
    if (adminSess) return adminSess;
    return mockDb.getCurrentCustomerSession();
  });

  const [pending2faAdmin, setPending2faAdmin] = useState<{ user: User; session: AdminSession } | null>(null);
  const [pending2faCustomer, setPending2faCustomer] = useState<{ user: User; session: CustomerSession } | null>(null);

  const lastActivityRef = useRef<number>(Date.now());

  // Sync state to storage
  useEffect(() => {
    mockDb.saveCurrentUser(user);
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      mockDb.saveCurrentAdminSession(currentSession as AdminSession);
    } else if (user?.role === 'customer') {
      mockDb.saveCurrentCustomerSession(currentSession as CustomerSession);
    }
  }, [currentSession, user]);

  /**
   * Refresh activity timestamp
   */
  const refreshActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    if (currentSession) {
      const nowIso = new Date().toISOString();
      const updated = {
        ...currentSession,
        lastActiveAt: nowIso,
      };
      setCurrentSession(updated);
    }
  }, [currentSession]);

  /**
   * Inactivity and expiration checker
   */
  useEffect(() => {
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    let throttleTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleUserActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          refreshActivity();
          throttleTimeout = null;
        }, 10000);
      }
    };

    activityEvents.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    const interval = setInterval(() => {
      if (currentSession && user?.role === 'admin') {
        if (isSessionExpired(currentSession as AdminSession)) {
          logSecurityEvent('AUTH_LOGOUT', {
            userId: user.user_id,
            email: user.email,
            action: 'Admin session terminated due to inactivity timeout (15m)',
            status: 'WARNING',
          });
          setUser(null);
          setCurrentSession(null);
          mockDb.saveCurrentAdminSession(null);
          mockDb.saveCurrentUser(null);
        }
      }
    }, 30000);

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearInterval(interval);
    };
  }, [currentSession, refreshActivity, user]);

  // ─── 1. Identify Account (Step 1 of Login) ──────────────────────────────────

  const identifyAccount = (emailOrMobile: string): IdentifyResult => {
    const clean = emailOrMobile.trim().toLowerCase();
    const cleanDigits = emailOrMobile.replace(/\D/g, '');

    const users = mockDb.getUsers();
    const found = users.find((u) => {
      const uEmail = u.email.toLowerCase();
      const uMobile = u.mobile.replace(/\D/g, '');
      return uEmail === clean || (cleanDigits.length >= 10 && uMobile.endsWith(cleanDigits.slice(-10)));
    });

    if (found) {
      return {
        exists: true,
        emailOrMobile: clean,
        user: {
          email: found.email,
          mobile: found.mobile,
          firstName: found.first_name,
          lastName: found.last_name,
          role: found.role,
          twoFactorEnabled: !!found.two_factor_enabled,
        },
      };
    }

    return {
      exists: false,
      emailOrMobile: clean,
      message: 'We cannot find an account with that email address or mobile number.',
    };
  };

  // ─── 2. Customer Login (Step 2 of Login) ────────────────────────────────────

  const login = async (
    emailOrMobile: string,
    password = '',
    rememberMe = false
  ): Promise<{ success: boolean; requires2FA?: boolean; message: string; user?: User }> => {
    const clean = emailOrMobile.trim().toLowerCase();
    const cleanDigits = emailOrMobile.replace(/\D/g, '');

    // Rate Limiting Check
    const rateCheck = authRateLimiter.check(clean);
    if (rateCheck.locked) {
      logSecurityEvent('AUTH_RATE_LIMITED', {
        email: clean,
        action: `Customer login temporarily locked out for ${rateCheck.lockoutSeconds}s`,
        status: 'WARNING',
      });
      return {
        success: false,
        message: `Too many failed attempts. Please retry in ${rateCheck.lockoutSeconds} seconds.`,
      };
    }

    const users = mockDb.getUsers();
    const existing = users.find((u) => {
      const uEmail = u.email.toLowerCase();
      const uMobile = u.mobile.replace(/\D/g, '');
      return uEmail === clean || (cleanDigits.length >= 10 && uMobile.endsWith(cleanDigits.slice(-10)));
    });

    if (!existing) {
      authRateLimiter.recordFailure(clean);
      return { success: false, message: 'Invalid credentials. Please check your password and try again.' };
    }

    let isPasswordValid = false;
    if (existing.password_hash && existing.password_salt) {
      isPasswordValid = await verifyPassword(password, existing.password_hash, existing.password_salt);
    }

    if (!isPasswordValid) {
      authRateLimiter.recordFailure(clean);
      logSecurityEvent('AUTH_LOGIN_FAILURE', {
        userId: existing.user_id,
        email: existing.email,
        action: 'Customer entered incorrect password',
        status: 'FAILURE',
      });
      return { success: false, message: 'Invalid credentials. Please check your password and try again.' };
    }

    authRateLimiter.reset(clean);

    // Two-Factor Authentication Check
    if (existing.two_factor_enabled) {
      const session = createCustomerSession(existing, rememberMe);
      setPending2faCustomer({ user: existing, session });
      return {
        success: false,
        requires2FA: true,
        message: 'Two-Factor Authentication is active. Please enter your 6-digit verification code.',
      };
    }

    // Normal Authentication Success
    const session = createCustomerSession(existing, rememberMe);
    setUser(existing);
    setCurrentSession(session);

    // Save session
    const existingSessions = mockDb.getCustomerSessions();
    mockDb.saveCustomerSessions([session, ...existingSessions.filter((s) => s.userId !== existing.user_id).slice(0, 9)]);

    // New Device Detection Check
    const deviceMeta = getClientDeviceMeta();
    const knownDevices = mockDb.getKnownDevices();
    const devCheck = detectNewDevice(existing.user_id, deviceMeta, knownDevices);

    if (devCheck.isNew) {
      sendNewDeviceAlertEmail(existing, deviceMeta).catch(() => {});
    }

    // Record this device as known
    mockDb.addKnownDevice({
      id: `dev_${Date.now()}`,
      userId: existing.user_id,
      fingerprint: devCheck.fingerprint,
      browser: deviceMeta.browser,
      os: deviceMeta.os,
      ip: deviceMeta.ip,
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    });

    // Asynchronously trigger dual email notifications (Admin Alert + Customer Confirmation)
    if (existing.role === 'customer') {
      const loginEventId = `login_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sendCustomerLoginEmails({ user: existing, loginEventId }).catch(() => {});
    }

    logSecurityEvent('AUTH_LOGIN_SUCCESS', {
      userId: existing.user_id,
      email: existing.email,
      action: 'Customer logged in successfully',
      details: { isNewDevice: devCheck.isNew, device: deviceMeta },
    });

    return { success: true, message: `Welcome back, ${existing.first_name}!`, user: existing };
  };

  // ─── 3. Verify Customer 2FA Login ──────────────────────────────────────────

  const verifyCustomer2FALogin = async (
    code: string,
    isRecoveryCode = false
  ): Promise<{ success: boolean; message: string }> => {
    if (!pending2faCustomer) {
      return { success: false, message: 'No pending authentication session found.' };
    }

    const { user: targetUser, session: targetSession } = pending2faCustomer;
    let isValid = false;

    if (isRecoveryCode && targetUser.recovery_codes) {
      const cleanCode = code.trim().toUpperCase();
      const codeIndex = targetUser.recovery_codes.findIndex((c) => c === cleanCode);
      if (codeIndex !== -1) {
        isValid = true;
        const updatedCodes = [...targetUser.recovery_codes];
        updatedCodes.splice(codeIndex, 1);
        const users = mockDb.getUsers();
        mockDb.saveUsers(users.map((u) => (u.user_id === targetUser.user_id ? { ...u, recovery_codes: updatedCodes } : u)));
      }
    } else if (targetUser.two_factor_secret) {
      isValid = verify2FAOTP(targetUser.two_factor_secret, code.trim());
    }

    if (!isValid) {
      logSecurityEvent('AUTH_2FA_FAILURE', {
        userId: targetUser.user_id,
        email: targetUser.email,
        action: 'Incorrect 2FA code entered by customer',
        status: 'FAILURE',
      });
      return { success: false, message: 'Invalid verification code. Please try again.' };
    }

    setUser(targetUser);
    setCurrentSession(targetSession);
    setPending2faCustomer(null);

    const existingSessions = mockDb.getCustomerSessions();
    mockDb.saveCustomerSessions([targetSession, ...existingSessions.slice(0, 9)]);

    logSecurityEvent('AUTH_2FA_VERIFIED', {
      userId: targetUser.user_id,
      email: targetUser.email,
      action: 'Customer 2FA verified successfully',
    });

    return { success: true, message: 'Verification successful! Welcome back.' };
  };

  // ─── 4. Customer Registration & Verification ───────────────────────────────

  const requestRegistration = async (
    userData: Omit<User, 'user_id' | 'role'>,
    password = ''
  ): Promise<{ success: boolean; verificationToken?: string; debugOtp?: string; message: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanMobile = userData.mobile.replace(/\D/g, '');

    const users = mockDb.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }
    if (cleanMobile.length >= 10 && users.some((u) => u.mobile.replace(/\D/g, '').endsWith(cleanMobile.slice(-10)))) {
      return { success: false, message: 'An account with this mobile number already exists.' };
    }

    const passPolicy = validatePasswordPolicy(password);
    if (!passPolicy.isValid) {
      return { success: false, message: passPolicy.errors[0] };
    }

    const salt = generateSalt();
    const hash = await hashPassword(password, salt);

    const tokenObj = createOtpToken(cleanEmail, 'REGISTER', {
      first_name: sanitizeInput(userData.first_name.trim()),
      last_name: sanitizeInput(userData.last_name.trim()),
      email: cleanEmail,
      mobile: sanitizeInput(userData.mobile.trim()),
      address1: sanitizeInput(userData.address1?.trim() || ''),
      address2: sanitizeInput(userData.address2?.trim() || ''),
      password_hash: hash,
      password_salt: salt,
    });

    const tokens = mockDb.getOtpTokens();
    mockDb.saveOtpTokens([tokenObj, ...tokens.slice(0, 19)]);

    // Send verification email
    sendEmailVerificationOtp(cleanEmail, tokenObj.otp, userData.first_name).catch(() => {});

    logSecurityEvent('EMAIL_VERIFICATION_SENT', {
      email: cleanEmail,
      action: 'Registration email verification OTP dispatched',
    });

    return {
      success: true,
      verificationToken: tokenObj.token,
      debugOtp: tokenObj.otp,
      message: `A 6-digit verification code was sent to ${cleanEmail}.`,
    };
  };

  const verifyRegistrationOtp = async (
    verificationToken: string,
    enteredOtp: string
  ): Promise<{ success: boolean; user?: User; message: string }> => {
    const tokens = mockDb.getOtpTokens();
    const tokenObj = tokens.find((t) => t.token === verificationToken);

    if (!tokenObj) {
      return { success: false, message: 'Invalid or expired verification session.' };
    }

    const verifyResult = verifyOtpToken(tokenObj, enteredOtp);
    mockDb.saveOtpTokens(tokens);

    if (!verifyResult.isValid) {
      return { success: false, message: verifyResult.message || 'Incorrect verification code.' };
    }

    const payload = tokenObj.payload as Record<string, unknown>;
    const users = mockDb.getUsers();
    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.user_id)) + 1 : 101;

    const newUser: User = {
      user_id: newUserId,
      first_name: (payload.first_name as string) || 'Customer',
      last_name: (payload.last_name as string) || '',
      email: tokenObj.emailOrMobile,
      mobile: (payload.mobile as string) || '',
      address1: (payload.address1 as string) || '',
      address2: (payload.address2 as string) || '',
      role: 'customer',
      password_hash: payload.password_hash as string,
      password_salt: payload.password_salt as string,
      email_verified: true,
      mobile_verified: true,
      created_at: new Date().toISOString(),
    };

    mockDb.saveUsers([newUser, ...users]);

    // Create session and auto-login
    const session = createCustomerSession(newUser);
    setUser(newUser);
    setCurrentSession(session);
    mockDb.saveCustomerSessions([session, ...mockDb.getCustomerSessions().slice(0, 9)]);

    // Send Welcome Email
    sendWelcomeEmail(newUser).catch(() => {});

    logSecurityEvent('AUTH_REGISTER_SUCCESS', {
      userId: newUserId,
      email: newUser.email,
      action: 'New customer account created and verified successfully',
    });

    return { success: true, user: newUser, message: 'Account verified successfully! Welcome to JAYVEERMart.' };
  };

  const resendRegistrationOtp = (
    verificationToken: string
  ): { success: boolean; debugOtp?: string; message: string } => {
    const tokens = mockDb.getOtpTokens();
    const tokenObj = tokens.find((t) => t.token === verificationToken);

    if (!tokenObj) {
      return { success: false, message: 'Verification session expired. Please register again.' };
    }

    const newOtp = generateSecureOTP(6);
    tokenObj.otp = newOtp;
    tokenObj.expiresAt = Date.now() + 10 * 60 * 1000;
    tokenObj.attempts = 0;
    mockDb.saveOtpTokens(tokens);

    sendEmailVerificationOtp(tokenObj.emailOrMobile, newOtp).catch(() => {});

    return {
      success: true,
      debugOtp: newOtp,
      message: `A fresh 6-digit verification code has been dispatched to ${tokenObj.emailOrMobile}.`,
    };
  };

  // ─── 5. Customer Password Recovery (OTP) ───────────────────────────────────

  const requestCustomerPasswordReset = (
    emailOrMobile: string
  ): { success: boolean; resetToken?: string; debugOtp?: string; message: string } => {
    const clean = emailOrMobile.trim().toLowerCase();
    const users = mockDb.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === clean || u.mobile.replace(/\D/g, '').endsWith(clean.slice(-10)));

    if (!found) {
      return {
        success: true,
        message: 'If an account exists with those details, a 6-digit verification code has been dispatched.',
      };
    }

    const tokenObj = createOtpToken(found.email, 'PASSWORD_RESET', { userId: found.user_id });
    const tokens = mockDb.getOtpTokens();
    mockDb.saveOtpTokens([tokenObj, ...tokens.slice(0, 19)]);

    sendPasswordResetOtpEmail(found.email, tokenObj.otp, found.first_name).catch(() => {});

    logSecurityEvent('PASSWORD_RESET_REQUESTED', {
      userId: found.user_id,
      email: found.email,
      action: 'Password reset OTP requested by customer',
    });

    return {
      success: true,
      resetToken: tokenObj.token,
      debugOtp: tokenObj.otp,
      message: `Password reset verification code dispatched to ${found.email}.`,
    };
  };

  const verifyCustomerPasswordReset = async (
    resetToken: string,
    enteredOtp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const tokens = mockDb.getOtpTokens();
    const tokenObj = tokens.find((t) => t.token === resetToken && t.purpose === 'PASSWORD_RESET');

    if (!tokenObj) {
      return { success: false, message: 'Invalid or expired password reset session.' };
    }

    const verifyResult = verifyOtpToken(tokenObj, enteredOtp);
    mockDb.saveOtpTokens(tokens);

    if (!verifyResult.isValid) {
      return { success: false, message: verifyResult.message || 'Incorrect reset code.' };
    }

    const passPolicy = validatePasswordPolicy(newPassword);
    if (!passPolicy.isValid) {
      return { success: false, message: passPolicy.errors[0] };
    }

    const users = mockDb.getUsers();
    const targetUser = users.find((u) => u.email.toLowerCase() === tokenObj.emailOrMobile.toLowerCase());

    if (!targetUser) {
      return { success: false, message: 'User account not found.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPassword, newSalt);

    const updatedUser: User = {
      ...targetUser,
      password_hash: newHash,
      password_salt: newSalt,
    };

    mockDb.saveUsers(users.map((u) => (u.user_id === targetUser.user_id ? updatedUser : u)));
    mockDb.terminateAllCustomerSessions(targetUser.user_id);

    sendPasswordChangedEmail(updatedUser).catch(() => {});

    logSecurityEvent('PASSWORD_RESET_COMPLETED', {
      userId: targetUser.user_id,
      email: targetUser.email,
      action: 'Password reset completed via OTP verification',
    });

    return { success: true, message: 'Password updated successfully! You can now log in.' };
  };

  const requestPasswordReset = (email: string): { success: boolean; message: string; debugOtp?: string } => {
    const res = requestCustomerPasswordReset(email);
    return { success: res.success, message: res.message, debugOtp: res.debugOtp };
  };

  const verifyPasswordReset = async (email: string, otp: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    const tokens = mockDb.getOtpTokens();
    const tokenObj = tokens.find((t) => t.emailOrMobile.toLowerCase() === email.toLowerCase() && t.purpose === 'PASSWORD_RESET' && !t.consumed);
    if (!tokenObj) {
      return { success: false, message: 'No active password reset request found for this email.' };
    }
    return verifyCustomerPasswordReset(tokenObj.token, otp, newPass);
  };

  const getAdminSessions = (): AdminSession[] => {
    if (!user || user.role !== 'admin') return [];
    const all = mockDb.getAdminSessions().filter((s) => s.userId === user.user_id);
    return all.map((s) => ({ ...s, isCurrent: s.sessionId === (currentSession as AdminSession)?.sessionId }));
  };

  // ─── 6. Admin Login Suite ──────────────────────────────────────────────────

  const adminLogin = async (
    email: string,
    password = '',
    rememberMe = false,
    captchaAnswer?: number,
    expectedAnswer?: number
  ): Promise<{
    success: boolean;
    requires2FA?: boolean;
    message: string;
    user?: User;
    session?: AdminSession;
  }> => {
    const cleanEmail = email.trim().toLowerCase();

    const rateCheck = authRateLimiter.check(cleanEmail);
    if (rateCheck.locked) {
      return {
        success: false,
        message: `Account locked due to excessive failed attempts. Try again in ${rateCheck.lockoutSeconds}s.`,
      };
    }

    if (rateCheck.requiresCaptcha) {
      if (captchaAnswer === undefined || expectedAnswer === undefined || captchaAnswer !== expectedAnswer) {
        return {
          success: false,
          message: 'Security challenge failed. Please solve the math verification.',
        };
      }
    }

    const users = mockDb.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'admin');

    if (!existing) {
      authRateLimiter.recordFailure(cleanEmail);
      return { success: false, message: 'Invalid administrator credentials.' };
    }

    let isPasswordValid = false;
    if (existing.password_hash && existing.password_salt) {
      isPasswordValid = await verifyPassword(password, existing.password_hash, existing.password_salt);
    }

    if (!isPasswordValid) {
      authRateLimiter.recordFailure(cleanEmail);
      return { success: false, message: 'Invalid administrator credentials.' };
    }

    authRateLimiter.reset(cleanEmail);
    const session = createAdminSession(existing, rememberMe);

    if (existing.two_factor_enabled) {
      setPending2faAdmin({ user: existing, session });
      return {
        success: false,
        requires2FA: true,
        message: 'Two-Factor Authentication is enabled. Please enter your 6-digit TOTP code.',
      };
    }

    setUser(existing);
    setCurrentSession(session);
    const existingSessions = mockDb.getAdminSessions();
    mockDb.saveAdminSessions([session, ...existingSessions.filter((s) => s.sessionId !== session.sessionId).slice(0, 9)]);

    logSecurityEvent('AUTH_LOGIN_SUCCESS', {
      userId: existing.user_id,
      email: existing.email,
      action: 'Admin signed in successfully',
    });

    return {
      success: true,
      message: `Welcome back, Administrator ${existing.first_name}!`,
      user: existing,
      session,
    };
  };

  const verify2FALogin = async (code: string, isRecoveryCode = false): Promise<{ success: boolean; message: string }> => {
    if (!pending2faAdmin) {
      return { success: false, message: 'No pending 2FA login session found.' };
    }

    const { user: targetUser, session: targetSession } = pending2faAdmin;
    let isValid = false;

    if (isRecoveryCode && targetUser.recovery_codes) {
      const cleanCode = code.trim().toUpperCase();
      const codeIndex = targetUser.recovery_codes.findIndex((c) => c === cleanCode);
      if (codeIndex !== -1) {
        isValid = true;
        const updatedCodes = [...targetUser.recovery_codes];
        updatedCodes.splice(codeIndex, 1);
        const users = mockDb.getUsers();
        mockDb.saveUsers(users.map((u) => (u.user_id === targetUser.user_id ? { ...u, recovery_codes: updatedCodes } : u)));
      }
    } else if (targetUser.two_factor_secret) {
      isValid = verify2FAOTP(targetUser.two_factor_secret, code.trim());
    }

    if (!isValid) {
      return { success: false, message: 'Invalid 6-digit authentication code.' };
    }

    const verifiedSession: AdminSession = { ...targetSession, is2faVerified: true };
    setUser(targetUser);
    setCurrentSession(verifiedSession);
    setPending2faAdmin(null);

    const existingSessions = mockDb.getAdminSessions();
    mockDb.saveAdminSessions([verifiedSession, ...existingSessions.slice(0, 9)]);

    return { success: true, message: '2FA Verified! Welcome to Admin Dashboard.' };
  };

  // ─── 7. General Profile & Password Actions ───────────────────────────────────

  const updateProfile = (updated: Partial<User>): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'User not authenticated.' };

    const users = mockDb.getUsers();
    const updatedUser: User = { ...user, ...updated };
    const newUsers = users.map((u) => (u.user_id === user.user_id ? updatedUser : u));

    mockDb.saveUsers(newUsers);
    setUser(updatedUser);

    logSecurityEvent('PROFILE_UPDATED', {
      userId: user.user_id,
      email: user.email,
      action: 'User profile details updated',
    });

    return { success: true, message: 'Profile updated successfully!' };
  };

  const updatePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'User not authenticated.' };

    let isCurrentValid = false;
    if (user.password_hash && user.password_salt) {
      isCurrentValid = await verifyPassword(currentPass, user.password_hash, user.password_salt);
    }

    if (!isCurrentValid) {
      return { success: false, message: 'Current password does not match.' };
    }

    const passPolicy = validatePasswordPolicy(newPass);
    if (!passPolicy.isValid) {
      return { success: false, message: passPolicy.errors[0] };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPass, newSalt);

    const updatedUser: User = {
      ...user,
      password_hash: newHash,
      password_salt: newSalt,
    };

    const users = mockDb.getUsers();
    mockDb.saveUsers(users.map((u) => (u.user_id === user.user_id ? updatedUser : u)));
    setUser(updatedUser);

    sendPasswordChangedEmail(updatedUser).catch(() => {});

    logSecurityEvent('PASSWORD_CHANGE', {
      userId: user.user_id,
      email: user.email,
      action: 'Password updated and salted KDF hash regenerated',
    });

    return { success: true, message: 'Password updated successfully!' };
  };

  // ─── 8. Two-Factor Authentication Management ───────────────────────────────

  const enable2FA = (secret: string, otp: string): { success: boolean; message: string; recoveryCodes?: string[] } => {
    if (!user) return { success: false, message: 'User not authenticated.' };

    const isValid = verify2FAOTP(secret, otp);
    if (!isValid) {
      return { success: false, message: 'Invalid 6-digit confirmation code.' };
    }

    const recoveryCodes = generateRecoveryCodes(8);
    const updatedUser: User = {
      ...user,
      two_factor_enabled: true,
      two_factor_secret: secret,
      recovery_codes: recoveryCodes,
    };

    const users = mockDb.getUsers();
    mockDb.saveUsers(users.map((u) => (u.user_id === user.user_id ? updatedUser : u)));
    setUser(updatedUser);

    sendTwoFactorStatusEmail(updatedUser, true).catch(() => {});

    logSecurityEvent('AUTH_2FA_ENABLED', {
      userId: user.user_id,
      email: user.email,
      action: 'Two-Factor Authentication enabled',
    });

    return { success: true, message: 'Two-Factor Authentication is now active!', recoveryCodes };
  };

  const disable2FA = async (password: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'User not authenticated.' };

    let isPasswordValid = false;
    if (user.password_hash && user.password_salt) {
      isPasswordValid = await verifyPassword(password, user.password_hash, user.password_salt);
    }

    if (!isPasswordValid) {
      return { success: false, message: 'Incorrect password. Cannot disable 2FA.' };
    }

    const updatedUser: User = {
      ...user,
      two_factor_enabled: false,
      two_factor_secret: undefined,
      recovery_codes: undefined,
    };

    const users = mockDb.getUsers();
    mockDb.saveUsers(users.map((u) => (u.user_id === user.user_id ? updatedUser : u)));
    setUser(updatedUser);

    sendTwoFactorStatusEmail(updatedUser, false).catch(() => {});

    logSecurityEvent('AUTH_2FA_DISABLED', {
      userId: user.user_id,
      email: user.email,
      action: 'Two-Factor Authentication disabled',
      status: 'WARNING',
    });

    return { success: true, message: 'Two-Factor Authentication has been disabled.' };
  };

  const regenerateRecoveryCodes = (): string[] => {
    if (!user) return [];
    const newCodes = generateRecoveryCodes(8);
    const updatedUser: User = { ...user, recovery_codes: newCodes };
    const users = mockDb.getUsers();
    mockDb.saveUsers(users.map((u) => (u.user_id === user.user_id ? updatedUser : u)));
    setUser(updatedUser);
    return newCodes;
  };

  // ─── 9. Session Management & Logout ────────────────────────────────────────

  const logout = (): void => {
    if (user) {
      logSecurityEvent('AUTH_LOGOUT', {
        userId: user.user_id,
        email: user.email,
        action: 'User signed out securely',
      });
    }
    setUser(null);
    setCurrentSession(null);
    mockDb.saveCurrentUser(null);
    mockDb.saveCurrentAdminSession(null);
    mockDb.saveCurrentCustomerSession(null);
  };

  const logoutAllDevices = (): void => {
    if (user) {
      if (user.role === 'admin') {
        mockDb.terminateAllAdminSessions(user.user_id);
      } else {
        mockDb.terminateAllCustomerSessions(user.user_id);
      }
      logSecurityEvent('AUTH_LOGOUT_ALL', {
        userId: user.user_id,
        email: user.email,
        action: 'Terminated sessions across all authorized devices',
      });
    }
    setUser(null);
    setCurrentSession(null);
  };

  const terminateSession = (sessionId: string): void => {
    if (user?.role === 'admin') {
      mockDb.terminateAdminSession(sessionId);
    } else {
      mockDb.terminateCustomerSession(sessionId);
    }
  };

  const getActiveSessions = (): (AdminSession | CustomerSession)[] => {
    if (!user) return [];
    if (user.role === 'admin') {
      const all = mockDb.getAdminSessions().filter((s) => s.userId === user.user_id);
      return all.map((s) => ({ ...s, isCurrent: s.sessionId === currentSession?.sessionId }));
    }
    const all = mockDb.getCustomerSessions().filter((s) => s.userId === user.user_id);
    return all.map((s) => ({ ...s, isCurrent: s.sessionId === currentSession?.sessionId }));
  };

  // ─── 10. Customer Addresses ────────────────────────────────────────────────

  const getCustomerAddresses = (): CustomerAddress[] => {
    return user ? mockDb.getCustomerAddresses(user.user_id) : [];
  };

  const addCustomerAddress = (addressData: Omit<CustomerAddress, 'id' | 'userId'>): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Sign in required.' };
    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr_${Date.now()}_${generateSalt(4)}`,
      userId: user.user_id,
    };
    mockDb.addCustomerAddress(newAddress);
    return { success: true, message: 'Delivery address added successfully.' };
  };

  const updateCustomerAddress = (updated: CustomerAddress): { success: boolean; message: string } => {
    mockDb.updateCustomerAddress(updated);
    return { success: true, message: 'Delivery address updated.' };
  };

  const deleteCustomerAddress = (id: string): { success: boolean; message: string } => {
    mockDb.deleteCustomerAddress(id);
    return { success: true, message: 'Address removed.' };
  };

  const setDefaultAddress = (id: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Sign in required.' };
    const addresses = mockDb.getCustomerAddresses(user.user_id);
    addresses.forEach((a) => {
      a.isDefault = a.id === id;
      mockDb.updateCustomerAddress(a);
    });
    return { success: true, message: 'Default shipping address updated.' };
  };

  // ─── 11. Saved Payment Methods (Tokenized, No CVV) ──────────────────────────

  const getSavedPaymentMethods = (): SavedPaymentMethod[] => {
    return user ? mockDb.getSavedPaymentMethods(user.user_id) : [];
  };

  const addSavedCard = (
    cardNumber: string,
    expiryMonth: string,
    expiryYear: string,
    cardHolderName: string,
    cardBrand: 'Visa' | 'Mastercard' | 'RuPay' | 'Amex' = 'Visa'
  ): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Sign in required.' };
    const tokenized = createTokenizedCard(user.user_id, cardNumber, expiryMonth, expiryYear, cardHolderName, cardBrand);
    mockDb.addSavedPaymentMethod(tokenized);
    return { success: true, message: 'Payment card saved securely (Tokenized).' };
  };

  const addSavedUpi = (upiId: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Sign in required.' };
    const tokenized = createTokenizedUpi(user.user_id, upiId);
    mockDb.addSavedPaymentMethod(tokenized);
    return { success: true, message: 'UPI ID linked securely.' };
  };

  const deleteSavedPaymentMethod = (id: string): { success: boolean; message: string } => {
    mockDb.deleteSavedPaymentMethod(id);
    return { success: true, message: 'Payment method removed.' };
  };

  const setDefaultPaymentMethod = (id: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Sign in required.' };
    const methods = mockDb.getSavedPaymentMethods(user.user_id);
    methods.forEach((m) => {
      m.isDefault = m.id === id;
      mockDb.addSavedPaymentMethod(m);
    });
    return { success: true, message: 'Default payment method set.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentSession,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        is2faVerified: user?.role === 'admin' ? (currentSession as AdminSession)?.is2faVerified ?? true : true,
        identifyAccount,
        login,
        verifyCustomer2FALogin,
        requestRegistration,
        verifyRegistrationOtp,
        resendRegistrationOtp,
        requestPasswordReset,
        verifyPasswordReset,
        requestCustomerPasswordReset,
        verifyCustomerPasswordReset,
        adminLogin,
        verify2FALogin,
        logout,
        logoutAllDevices,
        terminateSession,
        getActiveSessions,
        getAdminSessions,
        updateProfile,
        updatePassword,
        enable2FA,
        disable2FA,
        regenerateRecoveryCodes,
        getCustomerAddresses,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        setDefaultAddress,
        getSavedPaymentMethods,
        addSavedCard,
        addSavedUpi,
        deleteSavedPaymentMethod,
        setDefaultPaymentMethod,
        refreshActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
