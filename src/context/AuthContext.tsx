import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  User,
  CustomerAddress,
  SavedPaymentMethod,
  AdminSession,
  CustomerSession,
} from '../types';
import { mockDb } from '../data/mockDb';
import { INITIAL_USER } from '../data/initialData';

export interface AuthContextType {
  user: User | null;
  currentSession: AdminSession | CustomerSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  is2faVerified: boolean;

  // Profile Management
  updateProfile: (updatedData: Partial<User>) => Promise<boolean>;
  updatePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;

  // Customer Addresses
  getCustomerAddresses: () => CustomerAddress[];
  addCustomerAddress: (address: Omit<CustomerAddress, 'id'>) => CustomerAddress;
  updateCustomerAddress: (address: CustomerAddress) => void;
  deleteCustomerAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Saved Payment Methods
  getSavedPaymentMethods: () => SavedPaymentMethod[];
  addSavedCard: (cardName: string, cardNumber: string, expDate: string, isDefault?: boolean) => SavedPaymentMethod;
  addSavedUpi: (upiId: string, isDefault?: boolean) => SavedPaymentMethod;
  deleteSavedPaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // Public Compatibility Stubs
  login: (emailOrMobile: string, password?: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; message: string }>;
  logout: () => void;
  logoutAllDevices: () => void;
  identifyAccount: (emailOrMobile: string) => { exists: boolean; emailOrMobile: string };
  requestRegistration: (data: any, pass?: string) => Promise<{ success: boolean; message: string }>;
  verifyRegistrationOtp: (token: string, otp: string) => Promise<{ success: boolean; user?: User; message: string }>;
  resendRegistrationOtp: (token: string) => { success: boolean; message: string };
  requestPasswordReset: (email: string) => { success: boolean; message: string };
  verifyPasswordReset: (email: string, otp: string, pass: string) => Promise<{ success: boolean; message: string }>;
  requestCustomerPasswordReset: (emailOrMobile: string) => { success: boolean; message: string };
  verifyCustomerPasswordReset: (token: string, otp: string, pass: string) => Promise<{ success: boolean; message: string }>;
  enable2FA: (secret: string, otp: string) => Promise<{ success: boolean; recoveryCodes?: string[]; message: string }>;
  disable2FA: (password: string) => Promise<{ success: boolean; message: string }>;
  regenerateRecoveryCodes: () => Promise<{ success: boolean; recoveryCodes?: string[]; message: string }>;
  verify2FALogin: (code: string, isRecovery?: boolean) => Promise<{ success: boolean; message: string }>;
  verifyCustomer2FALogin: (code: string, isRecovery?: boolean) => Promise<{ success: boolean; message: string }>;
  getActiveSessions: () => (AdminSession | CustomerSession)[];
  getAdminSessions: () => AdminSession[];
  terminateSession: (sessionId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public Access: Always initialized with an active default customer/admin user
  const [user, setUser] = useState<User>(() => {
    const current = mockDb.getCurrentUser();
    if (current) return current;
    mockDb.saveCurrentUser(INITIAL_USER);
    return INITIAL_USER;
  });

  const [addresses, setAddresses] = useState<CustomerAddress[]>(() => {
    const existing = mockDb.getCustomerAddresses();
    if (existing.length === 0) {
      const defaultAddr: CustomerAddress = {
        id: 'addr_default_1',
        userId: user.user_id,
        fullName: `${user.first_name} ${user.last_name}`.trim(),
        mobile: user.mobile,
        addressLine1: user.address1 || '402, Skyline Towers, MG Road',
        addressLine2: user.address2 || 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560001',
        country: 'India',
        addressType: 'Home',
        isDefault: true,
      };
      mockDb.addCustomerAddress(defaultAddr);
      return [defaultAddr];
    }
    return existing;
  });

  const [payments, setPayments] = useState<SavedPaymentMethod[]>(() => {
    const existing = mockDb.getSavedPaymentMethods();
    if (existing.length === 0) {
      const defaultUpi: SavedPaymentMethod = {
        id: 'pay_default_1',
        userId: user.user_id,
        type: 'UPI',
        upiId: 'rahul.sharma@okaxis',
        isDefault: true,
        token: 'tok_upi_default',
        createdAt: new Date().toISOString(),
      };
      mockDb.addSavedPaymentMethod(defaultUpi);
      return [defaultUpi];
    }
    return existing;
  });

  // Profile Updates
  const updateProfile = useCallback(async (updatedData: Partial<User>): Promise<boolean> => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      mockDb.saveCurrentUser(updated);
      const all = mockDb.getUsers().map((u) => (u.user_id === prev.user_id ? updated : u));
      mockDb.saveUsers(all);
      return updated;
    });
    return true;
  }, []);

  const updatePassword = useCallback(async (_oldPass: string, _newPass: string) => {
    return { success: true, message: 'Password updated successfully.' };
  }, []);

  // Customer Addresses
  const getCustomerAddresses = useCallback(() => {
    return mockDb.getCustomerAddresses(user.user_id);
  }, [user.user_id]);

  const addCustomerAddress = useCallback(
    (addressData: Omit<CustomerAddress, 'id'>): CustomerAddress => {
      const newAddress: CustomerAddress = {
        ...addressData,
        id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      };
      mockDb.addCustomerAddress(newAddress);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
      return newAddress;
    },
    [user.user_id]
  );

  const updateCustomerAddress = useCallback(
    (updated: CustomerAddress) => {
      mockDb.updateCustomerAddress(updated);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
    },
    [user.user_id]
  );

  const deleteCustomerAddress = useCallback(
    (id: string) => {
      mockDb.deleteCustomerAddress(id);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
    },
    [user.user_id]
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      const all = mockDb.getCustomerAddresses();
      all.forEach((a) => {
        if (a.userId === user.user_id) {
          a.isDefault = a.id === id;
        }
      });
      mockDb.saveCustomerAddresses(all);
      setAddresses(mockDb.getCustomerAddresses(user.user_id));
    },
    [user.user_id]
  );

  // Saved Payment Methods
  const getSavedPaymentMethods = useCallback(() => {
    return mockDb.getSavedPaymentMethods(user.user_id);
  }, [user.user_id]);

  const addSavedCard = useCallback(
    (cardName: string, cardNumber: string, expDate: string, isDefault: boolean = false): SavedPaymentMethod => {
      const cleanNum = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4);
      let cardBrand: SavedPaymentMethod['cardBrand'] = 'Visa';
      if (cleanNum.startsWith('5')) cardBrand = 'Mastercard';
      else if (cleanNum.startsWith('6') || cleanNum.startsWith('8')) cardBrand = 'RuPay';
      else if (cleanNum.startsWith('3')) cardBrand = 'Amex';

      const expParts = expDate.split('/');
      const expiryMonth = expParts[0] || '12';
      const expiryYear = expParts[1] ? `20${expParts[1]}` : '2028';

      const newMethod: SavedPaymentMethod = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: user.user_id,
        type: 'CARD',
        cardHolderName: cardName,
        cardBrand,
        last4,
        expiryMonth,
        expiryYear,
        isDefault,
        token: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      mockDb.addSavedPaymentMethod(newMethod);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
      return newMethod;
    },
    [user.user_id]
  );

  const addSavedUpi = useCallback(
    (upiId: string, isDefault: boolean = false): SavedPaymentMethod => {
      const newMethod: SavedPaymentMethod = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: user.user_id,
        type: 'UPI',
        upiId: upiId.trim(),
        isDefault,
        token: `tok_upi_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      mockDb.addSavedPaymentMethod(newMethod);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
      return newMethod;
    },
    [user.user_id]
  );

  const deleteSavedPaymentMethod = useCallback(
    (id: string) => {
      mockDb.deleteSavedPaymentMethod(id);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
    },
    [user.user_id]
  );

  const setDefaultPaymentMethod = useCallback(
    (id: string) => {
      const all = mockDb.getSavedPaymentMethods();
      all.forEach((p) => {
        if (p.userId === user.user_id) {
          p.isDefault = p.id === id;
        }
      });
      mockDb.saveSavedPaymentMethods(all);
      setPayments(mockDb.getSavedPaymentMethods(user.user_id));
    },
    [user.user_id]
  );

  // Legacy & Compatibility Stubs
  const login = useCallback(async () => ({ success: true, message: 'Access granted' }), []);
  const adminLogin = useCallback(async () => ({ success: true, message: 'Access granted' }), []);
  const logout = useCallback(() => {}, []);
  const logoutAllDevices = useCallback(() => {}, []);
  const identifyAccount = useCallback((emailOrMobile: string) => ({ exists: true, emailOrMobile }), []);
  const requestRegistration = useCallback(async () => ({ success: true, message: 'Registered' }), []);
  const verifyRegistrationOtp = useCallback(async () => ({ success: true, user, message: 'Verified' }), [user]);
  const resendRegistrationOtp = useCallback(() => ({ success: true, message: 'Resent' }), []);
  const requestPasswordReset = useCallback(() => ({ success: true, message: 'OTP sent' }), []);
  const verifyPasswordReset = useCallback(async () => ({ success: true, message: 'Password reset' }), []);
  const requestCustomerPasswordReset = useCallback(() => ({ success: true, message: 'OTP sent' }), []);
  const verifyCustomerPasswordReset = useCallback(async () => ({ success: true, message: 'Password reset' }), []);
  const enable2FA = useCallback(async () => ({ success: true, message: '2FA Enabled' }), []);
  const disable2FA = useCallback(async () => ({ success: true, message: '2FA Disabled' }), []);
  const regenerateRecoveryCodes = useCallback(async () => ({ success: true, message: 'Codes generated' }), []);
  const verify2FALogin = useCallback(async () => ({ success: true, message: 'Verified' }), []);
  const verifyCustomer2FALogin = useCallback(async () => ({ success: true, message: 'Verified' }), []);
  const getActiveSessions = useCallback(() => [], []);
  const getAdminSessions = useCallback(() => [], []);
  const terminateSession = useCallback(() => {}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentSession: null,
        isAuthenticated: true,
        isAdmin: true,
        is2faVerified: true,
        updateProfile,
        updatePassword,
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
        login,
        adminLogin,
        logout,
        logoutAllDevices,
        identifyAccount,
        requestRegistration,
        verifyRegistrationOtp,
        resendRegistrationOtp,
        requestPasswordReset,
        verifyPasswordReset,
        requestCustomerPasswordReset,
        verifyCustomerPasswordReset,
        enable2FA,
        disable2FA,
        regenerateRecoveryCodes,
        verify2FALogin,
        verifyCustomer2FALogin,
        getActiveSessions,
        getAdminSessions,
        terminateSession,
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

export default AuthContext;
