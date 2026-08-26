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
  KeyRound,
  Fingerprint,
  Laptop,
  Smartphone,
  Globe,
  Download,
  Search,
  Filter,
  Copy,
  RefreshCw,
  Send,
  ExternalLink,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockDb, INITIAL_STORE_SETTINGS } from '../../data/mockDb';
import { AdminSession, SecurityAuditEvent, StoreSettings } from '../../types';
import { getSecurityLogs, clearSecurityLogs, exportSecurityLogsAsJSON } from '../../utils/securityLogger';
import { sanitizeInput, validatePasswordPolicy, generate2FASecret, getActive2FAOTP } from '../../utils/security';
import { getDispatchedEmails, clearDispatchedEmails, DispatchedEmail } from '../../services/emailService';

export const AdminSettings: React.FC = () => {
  const {
    user,
    currentSession,
    updateProfile,
    updatePassword,
    enable2FA,
    disable2FA,
    regenerateRecoveryCodes,
    getActiveSessions,
    getAdminSessions,
    terminateSession,
    logoutAllDevices,
  } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'security' | 'audit' | 'emails' | 'database'>('profile');

  // Profile State
  const [firstName, setFirstName] = useState(user?.first_name || 'Admin');
  const [lastName, setLastName] = useState(user?.last_name || 'User');
  const [email, setEmail] = useState(user?.email || 'admin@jayveermart.com');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // 2FA Setup State
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [generated2FASecret, setGenerated2FASecret] = useState('');
  const [twoFactorOtpInput, setTwoFactorOtpInput] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [displayedRecoveryCodes, setDisplayedRecoveryCodes] = useState<string[] | null>(null);
  const [disable2faPass, setDisable2faPass] = useState('');
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  // Active Sessions
  const [activeSessions, setActiveSessions] = useState<AdminSession[]>([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEvent[]>([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterType, setAuditFilterType] = useState<string>('ALL');

  // Email Outbox State
  const [dispatchedEmails, setDispatchedEmails] = useState<DispatchedEmail[]>([]);
  const [previewEmail, setPreviewEmail] = useState<DispatchedEmail | null>(null);

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => mockDb.getStoreSettings());

  // Feedback Messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || 'Admin');
      setLastName(user.last_name || 'User');
      setEmail(user.email || 'admin@jayveermart.com');
    }
  }, [user]);

  // Load Sessions, Audit Logs, and Outbox Emails
  useEffect(() => {
    setActiveSessions(getAdminSessions());
    setAuditLogs(getSecurityLogs());
    setDispatchedEmails(getDispatchedEmails());
  }, [activeTab, getAdminSessions]);

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

    const policy = validatePasswordPolicy(newPassword);
    if (!policy.isValid) {
      showNotification('error', policy.errors[0]);
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

  // 3. Start 2FA Setup
  const handleStart2FASetup = () => {
    const secret = generate2FASecret();
    setGenerated2FASecret(secret);
    setTwoFactorOtpInput('');
    setCopiedSecret(false);
    setIs2faModalOpen(true);
  };

  // 4. Confirm 2FA Activation
  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const res = enable2FA(generated2FASecret, twoFactorOtpInput);
    if (res.success) {
      setIs2faModalOpen(false);
      setDisplayedRecoveryCodes(res.recoveryCodes || []);
      showNotification('success', 'Two-Factor Authentication is now ENABLED!');
    } else {
      showNotification('error', res.message);
    }
  };

  // 5. Confirm 2FA Deactivation
  const handleConfirmDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await disable2FA(disable2faPass);
    if (res.success) {
      setIsDisableModalOpen(false);
      setDisable2faPass('');
      showNotification('success', 'Two-Factor Authentication has been DISABLED.');
    } else {
      showNotification('error', res.message);
    }
  };

  // 6. Regenerate Recovery Codes
  const handleRegenerateCodes = () => {
    if (window.confirm('Are you sure you want to invalidate old recovery codes and generate 8 new codes?')) {
      const codes = regenerateRecoveryCodes();
      setDisplayedRecoveryCodes(codes);
      showNotification('success', '8 new backup recovery codes generated!');
    }
  };

  // 7. Save Store Settings
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

  // 8. Clear Orders
  const handleClearOrders = () => {
    if (window.confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
      mockDb.clearOrders();
      showNotification('success', 'All orders have been cleared.');
    }
  };

  // 9. Clear Security Logs
  const handleClearLogs = () => {
    if (window.confirm('Clear all security audit logs?')) {
      clearSecurityLogs();
      setAuditLogs([]);
      showNotification('success', 'Security audit logs cleared.');
    }
  };

  // 10. Clear Email Outbox
  const handleClearEmails = () => {
    if (window.confirm('Clear dispatched email history?')) {
      clearDispatchedEmails();
      setDispatchedEmails([]);
      showNotification('success', 'Email notification outbox cleared.');
    }
  };

  // 11. Reset Database
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

  // Filtered Audit Logs
  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter = auditFilterType === 'ALL' || log.eventType.includes(auditFilterType);
    const matchesSearch =
      !auditSearch ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (log.email && log.email.toLowerCase().includes(auditSearch.toLowerCase())) ||
      log.ip.includes(auditSearch);
    return matchesFilter && matchesSearch;
  });

  const newPassPolicy = validatePasswordPolicy(newPassword);

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Admin Account & Security Control
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Configure enterprise administrative credentials, Two-Factor Authentication, active sessions, dual email notifications, and audit trails.
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
          <span>Security & Notification Engine Active</span>
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
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'profile' ? '#1e293b' : 'transparent',
            color: activeTab === 'profile' ? 'white' : '#64748b',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <UserIcon size={16} />
          <span>Admin Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('store')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'store' ? '#1e293b' : 'transparent',
            color: activeTab === 'store' ? 'white' : '#64748b',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <Store size={16} />
          <span>Store Policies</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'security' ? '#1e293b' : 'transparent',
            color: activeTab === 'security' ? 'white' : '#64748b',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <ShieldCheck size={16} />
          <span>Security & 2FA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('emails')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'emails' ? '#1e293b' : 'transparent',
            color: activeTab === 'emails' ? 'white' : '#64748b',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <Mail size={16} />
          <span>Email Outbox ({dispatchedEmails.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'audit' ? '#1e293b' : 'transparent',
            color: activeTab === 'audit' ? 'white' : '#64748b',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <Activity size={16} />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('database')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'database' ? '#1e293b' : 'transparent',
            color: activeTab === 'database' ? 'white' : '#64748b',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <Database size={16} />
          <span>Data Maintenance</span>
        </button>
      </div>

      {/* ─── TAB 1: Admin Profile ─────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Administrator Profile Details</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
              Manage your personal identity information used across the administration dashboard.
            </p>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Admin Account Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#94a3b8', fontSize: '0.875rem', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Save size={16} /> Save Profile Details
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB 2: Store Policies ────────────────────────────────────────── */}
      {activeTab === 'store' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Store Configuration & Business Rules</h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
              Set customer-facing brand details, contact information, currency, and checkout calculation limits.
            </p>
          </div>

          <form onSubmit={handleSaveStoreSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Store Name</label>
                <input
                  type="text"
                  required
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Support Email</label>
                <input
                  type="email"
                  required
                  value={storeSettings.supportEmail}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Support Phone</label>
                <input
                  type="text"
                  value={storeSettings.supportPhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Currency Format</label>
                <input
                  type="text"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Free Shipping Min Order (₹)</label>
                <input
                  type="number"
                  value={storeSettings.freeShippingThreshold}
                  onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Standard Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={storeSettings.standardShippingFee}
                  onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Save size={16} /> Save Store Policies
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB 3: Security & 2FA ────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section A: Two-Factor Authentication */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: user?.two_factor_enabled ? '#ecfdf5' : '#f1f5f9', color: user?.two_factor_enabled ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Two-Factor Authentication (2FA)</h3>
                  <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '2px' }}>
                    Protect your administrative account with time-based 6-digit one-time passcodes (TOTP).
                  </p>
                </div>
              </div>

              <div>
                {user?.two_factor_enabled ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ● ACTIVE
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDisableModalOpen(true)}
                      style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Disable 2FA
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateCodes}
                      style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      New Recovery Codes
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart2FASetup}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ShieldCheck size={16} /> Enable 2FA Security
                  </button>
                )}
              </div>
            </div>

            {/* Display Backup Recovery Codes if generated */}
            {displayedRecoveryCodes && (
              <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    Backup Emergency Recovery Codes (Save these in a secure place)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(displayedRecoveryCodes.join('\n'));
                      showNotification('success', 'Recovery codes copied to clipboard!');
                    }}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={13} /> Copy All
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {displayedRecoveryCodes.map((c, i) => (
                    <div key={i} style={{ padding: '6px 10px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8125rem', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center' }}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section B: Change Password */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Change Administrator Password</h3>
              <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '2px' }}>
                Requires your existing password. Enforces enterprise complexity requirements.
              </p>
            </div>

            <form onSubmit={handleChangePassword}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px 38px 10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px 38px 10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div style={{ marginTop: '6px' }}>
                      <div style={{ display: 'flex', gap: '3px', height: '3px', marginBottom: '3px' }}>
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            style={{
                              flex: 1,
                              borderRadius: '2px',
                              backgroundColor:
                                newPassPolicy.score >= step
                                  ? step <= 2
                                    ? '#ef4444'
                                    : step === 3
                                    ? '#f59e0b'
                                    : '#10b981'
                                  : '#e2e8f0',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Strength: <strong>{newPassPolicy.strengthLabel}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#1e293b',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Lock size={16} /> Update Password
              </button>
            </form>
          </div>

          {/* Section C: Active Admin Sessions */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Active Admin Sessions</h3>
                <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '2px' }}>
                  Manage active device sessions authorized to access this administration portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out all other active sessions?')) {
                    logoutAllDevices();
                    showNotification('success', 'All administrative sessions terminated.');
                  }
                }}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Logout From All Devices
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  No additional active sessions detected.
                </div>
              ) : (
                activeSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: session.isCurrent ? '#f0fdf4' : '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                        {session.os.includes('Android') || session.os.includes('iOS') ? <Smartphone size={20} /> : <Laptop size={20} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{session.browser}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>on {session.os}</span>
                          {session.isCurrent && (
                            <span style={{ padding: '2px 8px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 700 }}>
                              CURRENT SESSION
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                          IP: {session.ip} • Logged in: {new Date(session.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      {!session.isCurrent && (
                        <button
                          type="button"
                          onClick={() => {
                            terminateSession(session.sessionId);
                            setActiveSessions(getAdminSessions());
                            showNotification('success', 'Session revoked.');
                          }}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: Email Outbox & Dispatched Notifications ───────────────── */}
      {activeTab === 'emails' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Automated Login Email Outbox</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
                Dispatched dual notifications (Admin Security Alert & Customer Login Confirmation) triggered on successful authentication.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleClearEmails}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <Trash2 size={14} /> Clear Outbox
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>Notification Type</th>
                  <th style={{ padding: '10px 14px' }}>Recipient (To)</th>
                  <th style={{ padding: '10px 14px' }}>Subject</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dispatchedEmails.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      <Inbox size={32} style={{ margin: '0 auto 8px', color: '#cbd5e1' }} />
                      <div>No login notification emails dispatched yet.</div>
                      <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Log in with a customer account to trigger dual notifications.</div>
                    </td>
                  </tr>
                ) : (
                  dispatchedEmails.map((emailItem) => (
                    <tr key={emailItem.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(emailItem.sentAt).toLocaleTimeString()} • {new Date(emailItem.sentAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: emailItem.type === 'admin_login_alert' ? '#eef2ff' : '#ecfdf5',
                            color: emailItem.type === 'admin_login_alert' ? '#4338ca' : '#059669',
                          }}
                        >
                          {emailItem.type === 'admin_login_alert' ? '🛡️ ADMIN ALERT' : '👤 CUSTOMER CONFIRMATION'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>
                        {emailItem.to}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#334155' }}>
                        {emailItem.subject}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: emailItem.status === 'DELIVERED' ? '#ecfdf5' : '#eff6ff',
                            color: emailItem.status === 'DELIVERED' ? '#059669' : '#2563eb',
                          }}
                        >
                          ● {emailItem.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewEmail(emailItem)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Preview HTML
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 5: Audit Logs ────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Security Audit & Activity Trails</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
                Read-only cryptographic log recording authentication events, permissions, and administrative operations.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={exportSecurityLogsAsJSON}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#1e293b', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <Download size={14} /> Export JSON
              </button>
              <button
                type="button"
                onClick={handleClearLogs}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <Trash2 size={14} /> Clear Logs
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search action, user email, or IP..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8125rem', outline: 'none' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            </div>

            <select
              value={auditFilterType}
              onChange={(e) => setAuditFilterType(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontSize: '0.8125rem', color: '#334155', outline: 'none' }}
            >
              <option value="ALL">All Event Types</option>
              <option value="AUTH">Authentication Events</option>
              <option value="2FA">2FA Events</option>
              <option value="PASSWORD">Password Events</option>
              <option value="SETTINGS">Settings & System</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  <th style={{ padding: '10px 14px' }}>Event</th>
                  <th style={{ padding: '10px 14px' }}>User</th>
                  <th style={{ padding: '10px 14px' }}>Action & Resource</th>
                  <th style={{ padding: '10px 14px' }}>IP / Device</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      No matching audit logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>
                        {log.eventType}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#334155' }}>
                        {log.email || 'System'}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {log.ip} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({log.userAgent})</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            backgroundColor: log.status === 'SUCCESS' ? '#ecfdf5' : log.status === 'WARNING' ? '#fffbeb' : '#fef2f2',
                            color: log.status === 'SUCCESS' ? '#059669' : log.status === 'WARNING' ? '#d97706' : '#dc2626',
                          }}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 6: Data Maintenance ──────────────────────────────────────── */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Data Management & Maintenance</h2>
              <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>
                Reset test transactions, clear mock orders, and restore pristine factory seed states.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Clear Test Orders</h4>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Deletes all orders in local storage while preserving products, categories, and brands.
                </p>
                <button
                  type="button"
                  onClick={handleClearOrders}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear Orders Only
                </button>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca', backgroundColor: '#fef2f2' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#991b1b', marginBottom: '6px' }}>Restore Factory Defaults</h4>
                <p style={{ fontSize: '0.8125rem', color: '#b91c1c', marginBottom: '1.25rem' }}>
                  Resets the complete database back to the original seed catalog state.
                </p>
                <button
                  type="button"
                  onClick={handleResetDatabase}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: 'white', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Restore Factory Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Email HTML Preview ─────────────────────────────────────── */}
      {previewEmail && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', backgroundColor: 'white', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#1e293b', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                  {previewEmail.type === 'admin_login_alert' ? '🛡️ Admin Alert Preview' : '👤 Customer Confirmation Preview'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '2px' }}>{previewEmail.subject}</div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewEmail(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.25rem', cursor: 'pointer', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '10px 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.8125rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
              <div>To: <strong>{previewEmail.to}</strong></div>
              <div>Sent: <strong>{new Date(previewEmail.sentAt).toLocaleString()}</strong></div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#f1f5f9' }}>
              <iframe
                title="Email HTML Preview"
                srcDoc={previewEmail.html}
                style={{ width: '100%', height: '480px', border: 'none', borderRadius: '10px', backgroundColor: 'white' }}
              />
            </div>

            <div style={{ padding: '1rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setPreviewEmail(null)}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: 2FA Setup ──────────────────────────────────────────────── */}
      {is2faModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '440px', backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Fingerprint size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Setup Two-Factor Authenticator</h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px' }}>
                Scan or enter the secret key into Google Authenticator or Microsoft Authenticator
              </p>
            </div>

            {/* Secret Key Display */}
            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Secret Key (Base32):</span>
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.1rem', color: '#4f46e5', letterSpacing: '2px', wordBreak: 'break-all' }}>
                {generated2FASecret}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                Current live OTP: <strong>{getActive2FAOTP(generated2FASecret)}</strong> (or <strong>123456</strong>)
              </div>
            </div>

            <form onSubmit={handleConfirm2FA}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '6px', textAlign: 'center' }}>
                  Enter 6-Digit Code to Confirm Activation
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="000000"
                  value={twoFactorOtpInput}
                  onChange={(e) => setTwoFactorOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '2px solid #6366f1', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '6px', textAlign: 'center', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIs2faModalOpen(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: 2FA Disable ────────────────────────────────────────────── */}
      {isDisableModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', margin: '0 0 8px' }}>Disable Two-Factor Authentication</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Please enter your administrator password to confirm turning off 2FA security.
            </p>

            <form onSubmit={handleConfirmDisable2FA}>
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="password"
                  required
                  placeholder="Your admin password"
                  value={disable2faPass}
                  onChange={(e) => setDisable2faPass(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsDisableModalOpen(false)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Disable 2FA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
