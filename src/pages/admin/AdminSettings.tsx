import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Store,
  Database,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Truck,
  Inbox,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockDb, INITIAL_STORE_SETTINGS } from '../../data/mockDb';
import { StoreSettings } from '../../types';
import { sanitizeInput } from '../../utils/security';
import { getDispatchedEmails, clearDispatchedEmails, DispatchedEmail } from '../../services/emailService';

export const AdminSettings: React.FC = () => {
  const { user, updateProfile } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'store' | 'profile' | 'emails' | 'database'>('store');

  // Profile State
  const [firstName, setFirstName] = useState(user?.first_name || 'Administrator');
  const [lastName, setLastName] = useState(user?.last_name || 'JAYVEERMart');
  const [email, setEmail] = useState(user?.email || 'admin@jayveermart.com');

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => mockDb.getStoreSettings());

  // Email Outbox State
  const [dispatchedEmails, setDispatchedEmails] = useState<DispatchedEmail[]>([]);
  const [previewEmail, setPreviewEmail] = useState<DispatchedEmail | null>(null);

  // Feedback Messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || 'Administrator');
      setLastName(user.last_name || 'JAYVEERMart');
      setEmail(user.email || 'admin@jayveermart.com');
    }
  }, [user]);

  useEffect(() => {
    setDispatchedEmails(getDispatchedEmails());
  }, [activeTab]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // 1. Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      showNotification('error', 'Administrator name and email cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        first_name: sanitizeInput(firstName.trim()),
        last_name: sanitizeInput(lastName.trim()),
        email: sanitizeInput(email.trim().toLowerCase()),
      });
      showNotification('success', 'Administrator profile updated successfully.');
    } catch {
      showNotification('error', 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Save Store Settings
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

  // 3. Clear Orders
  const handleClearOrders = () => {
    if (window.confirm('Are you sure you want to clear all order history? This action cannot be undone.')) {
      mockDb.clearOrders();
      showNotification('success', 'All orders have been cleared.');
    }
  };

  // 4. Clear Email Outbox
  const handleClearEmails = () => {
    if (window.confirm('Clear dispatched email history?')) {
      clearDispatchedEmails();
      setDispatchedEmails([]);
      showNotification('success', 'Email notification outbox cleared.');
    }
  };

  // 5. Reset Database
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

  const navTabs = [
    { id: 'store', label: 'Store & Policies', icon: <Store size={18} /> },
    { id: 'profile', label: 'Admin Identity', icon: <UserIcon size={18} /> },
    { id: 'emails', label: `Outbox Emails (${dispatchedEmails.length})`, icon: <Inbox size={18} /> },
    { id: 'database', label: 'Database Reset', icon: <Database size={18} /> },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Admin Settings & Configuration
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '4px' }}>
          Configure enterprise store parameters, customer policies, and catalog database settings.
        </p>
      </div>

      {/* Alert Banner */}
      {statusMessage && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
            border: statusMessage.type === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Navigation Sidebar */}
        <aside
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '0.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? '#e0e7ff' : 'transparent',
                    color: isActive ? '#4338ca' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ color: isActive ? '#4f46e5' : '#94a3b8' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <main
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* ─── TAB 1: STORE & POLICIES ────────────────────────────────────── */}
          {activeTab === 'store' && (
            <div>
              <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Store Profile & Commerce Policies
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '4px' }}>
                  Manage public business details, checkout thresholds, tax calculations, and fulfillment terms.
                </p>
              </div>

              <form onSubmit={handleSaveStoreSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      Store Public Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      Currency Display
                    </label>
                    <input
                      type="text"
                      required
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Support Email
                    </label>
                    <input
                      type="email"
                      required
                      value={storeSettings.supportEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, supportEmail: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Support Helpline
                    </label>
                    <input
                      type="tel"
                      required
                      value={storeSettings.supportPhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, supportPhone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Physical Headquarters Address
                  </label>
                  <input
                    type="text"
                    required
                    value={storeSettings.storeAddress}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <Truck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Free Shipping Min (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} /> Standard Shipping (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={storeSettings.standardShippingFee}
                      onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      Tax / GST Rate (%)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={storeSettings.taxRatePercent}
                      onChange={(e) => setStoreSettings({ ...storeSettings, taxRatePercent: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                {/* Maintenance Mode Toggle */}
                <div
                  style={{
                    backgroundColor: storeSettings.maintenanceMode ? '#fef2f2' : '#f8fafc',
                    border: storeSettings.maintenanceMode ? '1px solid #fecaca' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: storeSettings.maintenanceMode ? '#b91c1c' : '#0f172a' }}>
                      Storefront Maintenance Mode
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Temporarily displays a scheduled maintenance banner to incoming public storefront visitors.
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px' }}>
                    <input
                      type="checkbox"
                      checked={storeSettings.maintenanceMode}
                      onChange={(e) => setStoreSettings({ ...storeSettings, maintenanceMode: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: storeSettings.maintenanceMode ? '#ef4444' : '#cbd5e1',
                        borderRadius: '26px',
                        transition: '0.3s',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: "''",
                          height: '20px',
                          width: '20px',
                          left: storeSettings.maintenanceMode ? '25px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s',
                        }}
                      />
                    </span>
                  </label>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
                    <Save size={16} /> Save Store Policies
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─── TAB 2: ADMIN IDENTITY ──────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Administrator Profile Details
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '4px' }}>
                  Update your administrative display name and notification email.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} style={{ maxWidth: '560px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ gap: '8px' }}>
                  <Save size={16} /> Save Admin Identity
                </button>
              </form>
            </div>
          )}

          {/* ─── TAB 3: OUTBOX EMAILS ───────────────────────────────────────── */}
          {activeTab === 'emails' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Dispatched Email Outbox ({dispatchedEmails.length})
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '4px' }}>
                    View transactional order invoices, welcome dispatches, and notifications.
                  </p>
                </div>
                {dispatchedEmails.length > 0 && (
                  <button type="button" onClick={handleClearEmails} className="btn btn-secondary btn-sm" style={{ gap: '6px', color: '#ef4444' }}>
                    <Trash2 size={14} /> Clear Outbox
                  </button>
                )}
              </div>

              {dispatchedEmails.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94a3b8' }}>
                  <Inbox size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#475569' }}>No dispatched emails</div>
                  <div style={{ fontSize: '0.8125rem', marginTop: '4px' }}>New customer orders or system notifications will appear here.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dispatchedEmails.map((emailItem) => (
                    <div
                      key={emailItem.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {emailItem.subject}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'flex', gap: '12px' }}>
                          <span>To: <strong>{emailItem.to}</strong></span>
                          <span>•</span>
                          <span>{new Date(emailItem.sentAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: emailItem.status === 'DELIVERED' ? '#dcfce7' : '#fef9c3',
                            color: emailItem.status === 'DELIVERED' ? '#15803d' : '#854d0e',
                          }}
                        >
                          {emailItem.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewEmail(emailItem)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '4px' }}
                        >
                          <Eye size={14} /> Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB 4: DATABASE MANAGEMENT ─────────────────────────────────── */}
          {activeTab === 'database' && (
            <div>
              <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Catalog Database & Storage Management
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8125rem', marginTop: '4px' }}>
                  Perform database resets, flush demo orders, or restore default categories and products.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Flush Order Records
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
                      Clear all current customer purchase records and reset test orders back to 0.
                    </p>
                  </div>
                  <button type="button" onClick={handleClearOrders} className="btn btn-secondary" style={{ color: '#ef4444', gap: '6px' }}>
                    <Trash2 size={16} /> Flush Orders
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#9f1239', margin: 0 }}>
                      Restore Factory Seed Catalog
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: '#e11d48', margin: '4px 0 0' }}>
                      Resets all products, categories, brands, orders, and reviews to pristine factory state.
                    </p>
                  </div>
                  <button type="button" onClick={handleResetDatabase} className="btn btn-primary" style={{ backgroundColor: '#e11d48', borderColor: '#e11d48', gap: '6px' }}>
                    <RotateCcw size={16} /> Reset Everything
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Email HTML Preview Modal */}
      {previewEmail && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{previewEmail.subject}</h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Recipient: {previewEmail.to}</div>
              </div>
              <button type="button" onClick={() => setPreviewEmail(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc' }} dangerouslySetInnerHTML={{ __html: previewEmail.html }} />
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setPreviewEmail(null)} className="btn btn-secondary">Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
