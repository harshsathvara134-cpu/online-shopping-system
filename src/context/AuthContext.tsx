import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockDb } from '../data/mockDb';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (userData: Omit<User, 'user_id' | 'role'>) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  demoLogin: (role: 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => mockDb.getCurrentUser());

  useEffect(() => {
    mockDb.saveCurrentUser(user);
  }, [user]);

  const login = async (email: string, _password?: string) => {
    const users = mockDb.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check if email matches admin or user
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setUser(existing);
      return { success: true, message: `Welcome back, ${existing.first_name}!`, user: existing };
    }

    if (cleanEmail === 'admin@nexusmart.com') {
      const adminUser: User = {
        user_id: 999,
        first_name: 'Admin',
        last_name: 'Manager',
        email: 'admin@nexusmart.com',
        mobile: '+91 99999 00000',
        address1: 'NexusMart HQ',
        address2: 'Tech Park, Mumbai',
        role: 'admin',
      };
      setUser(adminUser);
      return { success: true, message: 'Welcome back, Admin!', user: adminUser };
    }

    // Auto-create customer if not existing for smooth demo experience
    const newUser: User = {
      user_id: Date.now(),
      first_name: email.split('@')[0] || 'User',
      last_name: '',
      email: cleanEmail,
      mobile: '+91 98765 00000',
      address1: 'Demo Address 1',
      address2: 'City, State',
      role: 'customer',
    };
    mockDb.saveUsers([...users, newUser]);
    setUser(newUser);
    return { success: true, message: 'Logged in successfully!', user: newUser };
  };

  const register = async (userData: Omit<User, 'user_id' | 'role'>) => {
    const users = mockDb.getUsers();
    const cleanEmail = userData.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      ...userData,
      user_id: Date.now(),
      role: 'customer',
    };

    const updated = [...users, newUser];
    mockDb.saveUsers(updated);
    setUser(newUser);
    return { success: true, message: 'Registration successful! Welcome to NexusMart.', user: newUser };
  };

  const logout = () => {
    setUser(null);
    mockDb.saveCurrentUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const newUserData = { ...user, ...updated };
    setUser(newUserData);

    const users = mockDb.getUsers();
    const updatedUsers = users.map(u => u.user_id === user.user_id ? newUserData : u);
    mockDb.saveUsers(updatedUsers);
  };

  const demoLogin = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      const adminUser: User = {
        user_id: 999,
        first_name: 'Administrator',
        last_name: 'NexusMart',
        email: 'admin@nexusmart.com',
        mobile: '+91 99999 00000',
        address1: 'NexusMart Headquarters',
        address2: 'Tech Park, Sector 5',
        role: 'admin',
      };
      setUser(adminUser);
    } else {
      const customerUser: User = {
        user_id: 1,
        first_name: 'Rahul',
        last_name: 'Sharma',
        email: 'customer@nexusmart.com',
        mobile: '+91 98765 43210',
        address1: '402, Skyline Towers, MG Road',
        address2: 'Bengaluru, Karnataka 560001',
        role: 'customer',
      };
      setUser(customerUser);
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
