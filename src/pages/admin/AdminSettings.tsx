import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Store,
  ShieldCheck,
  Database,
  Lock,
  Check,
  AlertTriangle,
  RotateCcw,
  Save,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Truck,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockDb, INITIAL_STORE_SETTINGS } from '../../data/mockDb';
import { StoreSettings } from '../../types';
import { getSecurityLogs, clearSecurityLogs } from '../../utils/securityLogger';
import { sanitizeInput } from '../../utils/security';

export const AdminSettings: React.FC = () => {
  const { user, updateProfile, updatePassword } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'security' | 'database'>('profile');

  // Profile State
  const [firstName, setFirstName] = useState(user?.first_name || 'Admin');
  const [lastName, setLastName] = useState(user?.last_name || 'Superuser');
  const [email, setEmail] = useState(user?.email || 'admin@jayveermart.com');
  const [mobile, setMobile] = useState(user?.mobile || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address1 || 'JAYVEER Tech Park, Sector 5, Bengaluru');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => mockDb.getStoreSettings());

  // Feedback Messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security Logs count
  const [logCount, setLogCount] = useState<number>(() => getSecurityLogs().length);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || 'Admin');
      setLastName(user.last_name || 'Superuser');
      setEmail(user.email || 'admin@jayveermart.com');
      setMobile(user.mobile || '+91 98765 43210');
      setAddress(user.address1 || 'JAYVEER Tech Park, Sector 5, Bengaluru');
    }
  }, [user]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // 1. Save Profile Details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showNotification('error', 'First name is required.');
      return;
    }

    const res = updateProfile({
      first_name: sanitizeInput(firstName.trim()),
      last_name: sanitizeInput(lastName.trim()),
      mobile: sanitizeInput(mobile.trim()),
      address1: sanitizeInput(address.trim()),
    });

    if (res.success) {
      showNotification('success', 'Admin profile updated and saved to secure storage!');
    } else {
      showNotification('error', res.message);
    }
  };

  // 2. Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showNotification('error', 'Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      showNotification('error', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('error', 'New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updatePassword(currentPassword, newPassword);
      if (res.success) {
        showNotification('success', 'Password updated successfully! Salted SHA-256 hash regenerated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showNotification('error', res.message);
      }
    } catch {
      showNotification('error', 'An error occurred while updating password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Save Store Settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSettings: StoreSettings = {
      ...storeSettings,
      storeName: sanitizeInput(storeSettings.storeName.trim()),
      supportEmail: sanitizeInput(storeSettings.supportEmail.trim()),
      supportPhone: sanitizeInput(storeSettings.supportPhone.trim()),
      storeAddress: sanitizeInput(storeSettings.storeAddress.trim()),
      currency: sanitizeInput(storeSettings.currency.trim()),
      freeShippingThreshold: Math.max(0, Number(storeSettings.freeShippingThreshold) || 0),
      standardShippingFee: Math.max(0, Number(storeSettings.standardShippingFee) || 0),
      taxRatePercent: Math.max(0, Math.min(100, Number(storeSettings.taxRatePercent) || 0)),
      orderPrefix: sanitizeInput(storeSettings.orderPrefix.trim().toUpperCase() || 'JVM'),
    };

    mockDb.saveStoreSettings(cleanSettings);
    setStoreSettings(cleanSettings);
    showNotification('success', 'Store configuration & business policies saved successfully!');
  };

  // 4. Clear Test Orders
  const handleClearOrders = () => {
    if (window.confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
      mockDb.clearOrders();
      showNotification('success', 'All orders have been cleared.');
    }
  };

  // 5. Clear Security Logs
  const handleClearLogs = () => {
    clearSecurityLogs();
    setLogCount(0);
    showNotification('success', 'Security audit logs cleared.');
  };

  // 6. Reset Entire Database
  const handleResetDatabase = () => {
    if (
      window.confirm(
        'WARNING: This will reset all products, categories, brands, orders, and reviews back to default factory seed data. Proceed?'
      )
    ) {
      mockDb.resetToDefault();
      setStoreSettings(INITIAL_STORE_SETTINGS);
      showNotification('success', 'Store restored to pristine factory seed defaults.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Admin Account & Store Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Configure administrative credentials, store policies, tax/shipping thresholds, and database management.
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            fontSize: '0.8125rem',
            color: '#065f46',
            fontWeight: 600,
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
          <span>Settings Active & Synced</span>
        </div>
      </div>

      {/* Alert Notification */}
      {statusMessage && (
        <div
          className="animate-fade-in"
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
            border: statusMessage.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '4px',
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'profile' ? 700 : 500,
            backgroundColor: activeTab === 'profile' ? '#1e293b' : 'transparent',
            color: activeTab === 'profile' ? 'white' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <UserIcon size={16} /> Admin Profile & Password
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'store' ? 700 : 500,
            backgroundColor: activeTab === 'store' ? '#1e293b' : 'transparent',
            color: activeTab === 'store' ? 'white' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Store size={16} /> Store Profile & Rates
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'security' ? 700 : 500,
            backgroundColor: activeTab === 'security' ? '#1e293b' : 'transparent',
            color: activeTab === 'security' ? 'white' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <ShieldCheck size={16} /> Security Policies
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: activeTab === 'database' ? 700 : 500,
            backgroundColor: activeTab === 'database' ? '#1e293b' : 'transparent',
            color: activeTab === 'database' ? 'white' : '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Database size={16} /> Data & Factory Reset
        </button>
      </div>

      {/* Tab 1: Admin Profile & Password */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Card */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Administrator Profile Details
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
                Update your administrative display name and account information.
              </p>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    Admin Account Email (Login Identifier)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.875rem',
                      cursor: 'not-allowed',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <Save size={15} /> Save Profile Details
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#4f46e5" /> Change Administrator Password
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
                Requires your existing password. Enforces SHA-256 cryptographic hashing with unique random salt.
              </p>
            </div>

            <form onSubmit={handleChangePassword}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {/* Current Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    Current Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 36px 8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '9px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: 0,
                      }}
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    New Password * (Min 8 chars, 1 Upper, 1 Number, 1 Symbol)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Enter strong new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 36px 8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '9px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: 0,
                      }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  <ShieldCheck size={16} /> {isSubmitting ? 'Updating...' : 'Update Password Securely'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Store Profile & Rates */}
      {activeTab === 'store' && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Store size={18} color="#4f46e5" /> Store Branding, Support & Logistics Rules
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
              Configure public storefront parameters, GST tax percentages, free shipping thresholds, and customer helpline contacts.
            </p>
          </div>

          <form onSubmit={handleSaveStoreSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Store Public Name *
                </label>
                <input
                  type="text"
                  required
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Support Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={storeSettings.supportEmail}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Support Phone / Toll-Free
                </label>
                <input
                  type="text"
                  value={storeSettings.supportPhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Order ID Prefix
                </label>
                <input
                  type="text"
                  value={storeSettings.orderPrefix}
                  onChange={(e) => setStoreSettings({ ...storeSettings, orderPrefix: e.target.value })}
                  placeholder="e.g. JVM"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Free Delivery Threshold (₹ INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Standard Shipping Fee (₹ INR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={storeSettings.standardShippingFee}
                  onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  GST / Sales Tax Percentage (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={storeSettings.taxRatePercent}
                  onChange={(e) => setStoreSettings({ ...storeSettings, taxRatePercent: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Headquarters Physical Address
                </label>
                <input
                  type="text"
                  value={storeSettings.storeAddress}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Toggles */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={storeSettings.autoConfirmOrders}
                    onChange={(e) => setStoreSettings({ ...storeSettings, autoConfirmOrders: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#1e293b' }}
                  />
                  Auto-Confirm Customer Orders on Checkout
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>
                  <input
                    type="checkbox"
                    checked={storeSettings.maintenanceMode}
                    onChange={(e) => setStoreSettings({ ...storeSettings, maintenanceMode: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#dc2626' }}
                  />
                  Enable Storefront Maintenance Mode
                </label>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <Save size={16} /> Save Store Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Security Policies & Audit Status */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" /> Active Security Controls
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
                Cryptographic authentication, brute-force rate limiters, IDOR protection, and logging.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Web Crypto SHA-256</strong>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Salted SHA-256 password hashing with constant-time verification.
                </p>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Brute-Force Rate Limiter</strong>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Restricts failed login attempts to 5 per 60-second window.
                </p>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>IDOR Customer Isolation</strong>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Scoped database access strictly prevents cross-account order queries.
                </p>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <strong style={{ fontSize: '0.875rem', color: '#0f172a' }}>Authoritative Price Engine</strong>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Client cart prices are recomputed and validated against stock in OrderContext.
                </p>
              </div>
            </div>

            {/* Audit Log Controls */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  Security Audit Events Logged: <span style={{ color: '#4f46e5' }}>{logCount} Events</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Captures authentication attempts, profile changes, and authorization violations.
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearLogs}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={14} /> Clear Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Data & Factory Reset */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Prune Orders */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
              Clear Order History
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1.25rem' }}>
              Remove all placed test orders from the database while keeping product listings, categories, and user accounts intact.
            </p>

            <button
              type="button"
              onClick={handleClearOrders}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                backgroundColor: '#fff5f5',
                color: '#dc2626',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={14} /> Clear Placed Orders
            </button>
          </div>

          {/* Full Factory Reset */}
          <div
            style={{
              backgroundColor: '#fff5f5',
              borderRadius: '16px',
              border: '1px solid #fecaca',
              padding: '1.75rem',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#dc2626', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={18} /> Restore Factory Pristine Database State
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#7f1d1d', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
              Reset all product catalog inventory, category links, brands, orders, customer accounts, and settings back to the initial SQL seed state.
            </p>

            <button
              type="button"
              onClick={handleResetDatabase}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
              }}
            >
              <RotateCcw size={15} /> Reset All Store Data to Initial Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
