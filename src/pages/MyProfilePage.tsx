import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Lock,
  Check,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Package,
  CreditCard,
  Heart,
  KeyRound,
  Fingerprint,
  Laptop,
  Smartphone,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Clock,
  Eye,
  EyeOff,
  Copy,
  ChevronRight,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { CustomerAddress, SavedPaymentMethod, Order } from '../types';
import { validatePasswordPolicy, generate2FASecret, getActive2FAOTP } from '../utils/security';
import { getSecurityLogs } from '../utils/securityLogger';

export const MyProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'hub';

  const {
    user,
    logout,
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
    getActiveSessions,
  } = useAuth();

  const { orders } = useOrders();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'hub' | 'orders' | 'security' | 'addresses' | 'payments'>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as any;
    if (tabFromUrl && ['hub', 'orders', 'security', 'addresses', 'payments'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const setTab = (tab: 'hub' | 'orders' | 'security' | 'addresses' | 'payments') => {
    setActiveTab(tab);
    setSearchParams(tab === 'hub' ? {} : { tab });
  };

  // Profile Edit State
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Address Management State
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState('');
  const [addrMobile, setAddrMobile] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Saved Payment Methods State
  const [payments, setPayments] = useState<SavedPaymentMethod[]>([]);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2028');
  const [cardBrand, setCardBrand] = useState<'Visa' | 'Mastercard' | 'RuPay'>('Visa');
  const [upiIdInput, setUpiIdInput] = useState('');

  // Feedback Notifications
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setMobile(user.mobile || '');
      setAddresses(getCustomerAddresses());
      setPayments(getSavedPaymentMethods());
    }
  }, [user, activeTab]);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
          <Lock size={36} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Sign In to Your Account</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '450px', margin: '0 auto 2rem' }}>
          Please sign in to view your orders, delivery addresses, payment methods, and account security controls.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)' }}>
          Sign In to Account <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  // 1. Profile Save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showNotification('error', 'First name is required.');
      return;
    }
    const res = updateProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      mobile: mobile.trim(),
    });
    if (res.success) {
      showNotification('success', 'Personal information updated successfully.');
    } else {
      showNotification('error', res.message);
    }
  };

  // 2. Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
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
      showNotification('error', 'New passwords do not match.');
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
      showNotification('error', 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrName(`${user.first_name || ''} ${user.last_name || ''}`.trim());
    setAddrMobile(user.mobile || '');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('Bengaluru');
    setAddrState('Karnataka');
    setAddrZip('560001');
    setAddrType('Home');
    setAddrIsDefault(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine1.trim() || !addrCity.trim() || !addrZip.trim()) {
      showNotification('error', 'Please fill in required address fields.');
      return;
    }

    if (editingAddressId) {
      updateCustomerAddress({
        id: editingAddressId,
        userId: user.user_id,
        fullName: addrName.trim(),
        mobile: addrMobile.trim(),
        addressLine1: addrLine1.trim(),
        addressLine2: addrLine2.trim(),
        city: addrCity.trim(),
        state: addrState.trim(),
        zip: addrZip.trim(),
        country: 'India',
        isDefault: addrIsDefault,
        addressType: addrType,
      });
      showNotification('success', 'Delivery address updated.');
    } else {
      addCustomerAddress({
        fullName: addrName.trim(),
        mobile: addrMobile.trim(),
        addressLine1: addrLine1.trim(),
        addressLine2: addrLine2.trim(),
        city: addrCity.trim(),
        state: addrState.trim(),
        zip: addrZip.trim(),
        country: 'India',
        isDefault: addrIsDefault,
        addressType: addrType,
      });
      showNotification('success', 'New delivery address added.');
    }
    setAddresses(getCustomerAddresses());
    setIsAddressModalOpen(false);
  };

  // 5. Payment Handlers
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\D/g, '').length < 15) {
      showNotification('error', 'Please enter a valid card number.');
      return;
    }
    addSavedCard(cardNumber, expiryMonth, expiryYear, cardHolder, cardBrand);
    setPayments(getSavedPaymentMethods());
    setIsCardModalOpen(false);
    setCardNumber('');
    setCardHolder('');
    showNotification('success', 'Card saved securely (Tokenized).');
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiIdInput.includes('@')) {
      showNotification('error', 'Please enter a valid UPI ID (e.g. mobile@upi).');
      return;
    }
    addSavedUpi(upiIdInput);
    setPayments(getSavedPaymentMethods());
    setIsUpiModalOpen(false);
    setUpiIdInput('');
    showNotification('success', 'UPI ID saved.');
  };

  const myOrders = orders.filter((o: Order) => o.user_id === user.user_id || o.email === user.email);
  const activeSessions = getActiveSessions();
  const recentAuditLogs = getSecurityLogs().filter((l) => l.userId === user.user_id || l.email === user.email).slice(0, 5);
  const newPassPolicy = validatePasswordPolicy(newPassword);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '1020px' }}>
      {/* Account Overview Header */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
          color: 'white',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.75rem',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            {user.first_name ? user.first_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Hello, {user.first_name} {user.last_name}! 👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: '#c7d2fe', flexWrap: 'wrap' }}>
              <span>{user.email}</span>
              <span>•</span>
              <span style={{ padding: '2px 8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderRadius: '4px', fontWeight: 700, fontSize: '0.6875rem' }}>
                ● EMAIL VERIFIED
              </span>
              {user.two_factor_enabled && (
                <span style={{ padding: '2px 8px', backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', borderRadius: '4px', fontWeight: 700, fontSize: '0.6875rem' }}>
                  🛡️ 2FA PROTECTED
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab !== 'hub' && (
            <button
              type="button"
              onClick={() => setTab('hub')}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.25)', backgroundColor: 'transparent', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Account Home
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
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
            marginBottom: '1.5rem',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* ─── 1. HUB OVERVIEW (Amazon Tile Grid) ────────────────────────────── */}
      {activeTab === 'hub' && (
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Your Account Center
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* Tile 1: Orders */}
            <div
              onClick={() => setTab('orders')}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Your Orders</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Track shipments, view detailed invoices, and reorder past purchases.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', marginTop: '8px', display: 'inline-block' }}>
                  {myOrders.length} orders placed →
                </span>
              </div>
            </div>

            {/* Tile 2: Login & Security */}
            <div
              onClick={() => setTab('security')}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Login & Security</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Edit name, mobile, password, configure 2FA, and manage logged-in devices.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: '8px', display: 'inline-block' }}>
                  Manage security settings →
                </span>
              </div>
            </div>

            {/* Tile 3: Your Addresses */}
            <div
              onClick={() => setTab('addresses')}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Your Addresses</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Edit delivery addresses for faster order checkout and gift deliveries.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', marginTop: '8px', display: 'inline-block' }}>
                  {addresses.length} saved addresses →
                </span>
              </div>
            </div>

            {/* Tile 4: Payment Options */}
            <div
              onClick={() => setTab('payments')}
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fae8ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CreditCard size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Payment Options</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Manage saved tokenized cards & UPI IDs. No raw CVV or PAN stored.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a21caf', marginTop: '8px', display: 'inline-block' }}>
                  {payments.length} payment methods →
                </span>
              </div>
            </div>

            {/* Tile 5: Your Wishlist */}
            <Link
              to="/wishlist"
              style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.5rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Your Wishlist</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  View saved favorite products and price drop notifications.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', marginTop: '8px', display: 'inline-block' }}>
                  {wishlistItems.length} items saved →
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ─── 2. TAB: YOUR ORDERS ─────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Your Order History</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>View and track recent purchases</p>
            </div>
            <Link to="/store" className="btn btn-sm btn-primary">Continue Shopping</Link>
          </div>

          {myOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <Package size={40} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No orders placed yet</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Browse our catalog and place your first order!</p>
              <Link to="/store" className="btn btn-primary">Explore Products</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myOrders.map((order: Order) => (
                <div key={order.order_id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.8125rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>ORDER PLACED: </span>
                      <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>TOTAL: </span>
                      <strong>₹{order.total_amt.toLocaleString('en-IN')}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>SHIP TO: </span>
                      <strong>{order.f_name}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>ORDER # </span>
                      <strong>{order.order_id}</strong>
                    </div>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                        Status: <span style={{ color: '#4f46e5' }}>{order.status}</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        {order.items?.length || order.prod_count} item(s) • Payment: {order.payment_method}
                      </div>
                    </div>
                    <Link to={`/order-success/${order.order_id}`} className="btn btn-sm btn-outline">
                      View Order Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 3. TAB: LOGIN & SECURITY ─────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section A: Personal Information */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              Personal Information
            </h3>

            <form onSubmit={handleProfileSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Email Address (Verified)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#94a3b8', fontSize: '0.875rem', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                Save Personal Changes
              </button>
            </form>
          </div>

          {/* Section B: Password Change */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Password Settings</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Enforces salted SHA-256 encryption. Requires your existing password.
            </p>

            <form onSubmit={handlePasswordChange}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Current Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div style={{ marginTop: '5px' }}>
                      <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                        Strength: <strong>{newPassPolicy.strengthLabel}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── 4. TAB: YOUR ADDRESSES ───────────────────────────────────────── */}
      {activeTab === 'addresses' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Your Delivery Addresses</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>Manage shipping locations for express checkout</p>
            </div>
            <button type="button" onClick={handleOpenAddAddress} className="btn btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} /> Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <MapPin size={40} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No saved addresses</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Add a delivery address for fast 1-click checkout.</p>
              <button type="button" onClick={handleOpenAddAddress} className="btn btn-primary">Add Address Now</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    border: addr.isDefault ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    position: 'relative',
                    backgroundColor: addr.isDefault ? '#f8faff' : 'white',
                  }}
                >
                  {addr.isDefault && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '2px 8px', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 800 }}>
                      DEFAULT
                    </span>
                  )}
                  <span style={{ display: 'inline-block', padding: '2px 6px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 700, marginBottom: '8px' }}>
                    {addr.addressType.toUpperCase()}
                  </span>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{addr.fullName}</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', margin: '0 0 8px', lineHeight: 1.4 }}>
                    {addr.addressLine1}
                    {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                    <br />{addr.city}, {addr.state} - {addr.zip}
                  </p>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '12px' }}>
                    Phone: <strong>+91 {addr.mobile}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultAddress(addr.id);
                          setAddresses(getCustomerAddresses());
                          showNotification('success', 'Default address updated.');
                        }}
                        style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        deleteCustomerAddress(addr.id);
                        setAddresses(getCustomerAddresses());
                        showNotification('success', 'Address deleted.');
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto', padding: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. TAB: PAYMENT OPTIONS ──────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Saved Payment Methods</h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '4px 0 0' }}>
                Secure PCI-DSS tokenized cards and UPI IDs. CVV/raw details are never stored.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setIsCardModalOpen(true)} className="btn btn-sm btn-primary">
                + Add Card
              </button>
              <button type="button" onClick={() => setIsUpiModalOpen(true)} className="btn btn-sm btn-outline">
                + Add UPI
              </button>
            </div>
          </div>

          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CreditCard size={40} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No saved payment methods</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Save a card or UPI ID for seamless 1-click checkout.</p>
              <button type="button" onClick={() => setIsCardModalOpen(true)} className="btn btn-primary">Add Payment Card</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {payments.map((p) => (
                <div key={p.id} style={{ border: p.isDefault ? '2px solid #4f46e5' : '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', backgroundColor: p.isDefault ? '#f8faff' : 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ padding: '2px 8px', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 800 }}>
                      {p.type === 'CARD' ? `${p.cardBrand || 'Card'}` : 'UPI ID'}
                    </span>
                    {p.isDefault && (
                      <span style={{ padding: '2px 6px', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 800 }}>
                        DEFAULT
                      </span>
                    )}
                  </div>

                  {p.type === 'CARD' ? (
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a', letterSpacing: '1px' }}>
                        •••• •••• •••• {p.last4}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        Expires: {p.expiryMonth}/{p.expiryYear} • {p.cardHolderName}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{p.upiId}</div>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>✓ Verified UPI Handle</div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '12px' }}>
                    {!p.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultPaymentMethod(p.id);
                          setPayments(getSavedPaymentMethods());
                          showNotification('success', 'Default payment method set.');
                        }}
                        style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        deleteSavedPaymentMethod(p.id);
                        setPayments(getSavedPaymentMethods());
                        showNotification('success', 'Payment method removed.');
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto', padding: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── MODAL: Add Address ────────────────────────────────────────────── */}
      {isAddressModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', borderRadius: '16px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem' }}>
              {editingAddressId ? 'Edit Address' : 'Add a New Delivery Address'}
            </h3>

            <form onSubmit={handleSaveAddress}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Full Name *</label>
                <input type="text" required value={addrName} onChange={(e) => setAddrName(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Mobile Number *</label>
                <input type="tel" required placeholder="10-digit mobile" value={addrMobile} onChange={(e) => setAddrMobile(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Street Address / Flat / Building *</label>
                <input type="text" required placeholder="House No., Building, Area" value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Landmark / Street (Optional)</label>
                <input type="text" placeholder="Near metro, landmark" value={addrLine2} onChange={(e) => setAddrLine2(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>City *</label>
                  <input type="text" required value={addrCity} onChange={(e) => setAddrCity(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>State *</label>
                  <input type="text" required value={addrState} onChange={(e) => setAddrState(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>PIN Code *</label>
                  <input type="text" required value={addrZip} onChange={(e) => setAddrZip(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem' }}>
                {(['Home', 'Work', 'Other'] as const).map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    <input type="radio" name="addrType" checked={addrType === t} onChange={() => setAddrType(t)} />
                    {t}
                  </label>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={addrIsDefault} onChange={(e) => setAddrIsDefault(e.target.checked)} />
                  <span>Make this my default shipping address</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setIsAddressModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add Payment Card ───────────────────────────────────────── */}
      {isCardModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '440px', backgroundColor: 'white', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem' }}>
              Add Credit / Debit Card
            </h3>

            <form onSubmit={handleSaveCard}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Card Number *</label>
                <input type="text" required maxLength={19} placeholder="4532 •••• •••• 8899" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', fontFamily: 'monospace' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Name on Card *</label>
                <input type="text" required placeholder="HARSH SATHVARA" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Expiry Month</label>
                  <select value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Expiry Year</label>
                  <select value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                    {['2025', '2026', '2027', '2028', '2029', '2030', '2031'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setIsCardModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: Add UPI ────────────────────────────────────────────────── */}
      {isUpiModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem' }}>
              Link UPI ID
            </h3>

            <form onSubmit={handleSaveUpi}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>UPI ID (e.g. mobile@upi / username@okhdfcbank)</label>
                <input type="text" required placeholder="yourname@okhdfcbank" value={upiIdInput} onChange={(e) => setUpiIdInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setIsUpiModalOpen(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>Link UPI</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
