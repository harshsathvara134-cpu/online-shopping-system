import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Truck,
  ArrowRight,
  ExternalLink,
  Save,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { CustomerAddress, SavedPaymentMethod } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const MyProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'hub';

  const {
    user,
    updateProfile,
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
  } = useAuth();

  const { orders } = useOrders();
  const { wishlistItems } = useWishlist();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'hub' | 'orders' | 'profile' | 'addresses' | 'payments'>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as any;
    if (tabFromUrl && ['hub', 'orders', 'profile', 'addresses', 'payments'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const setTab = (tab: 'hub' | 'orders' | 'profile' | 'addresses' | 'payments') => {
    setActiveTab(tab);
    setSearchParams(tab === 'hub' ? {} : { tab });
  };

  // Profile Edit State
  const [firstName, setFirstName] = useState(user?.first_name || 'Rahul');
  const [lastName, setLastName] = useState(user?.last_name || 'Sharma');
  const [mobile, setMobile] = useState(user?.mobile || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'customer@jayveermart.com');

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
  const [upiIdInput, setUpiIdInput] = useState('');

  // Feedback Notifications
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Sync state on mount
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setMobile(user.mobile || '');
      setEmail(user.email || '');
    }
    setAddresses(getCustomerAddresses());
    setPayments(getSavedPaymentMethods());
  }, [user, getCustomerAddresses, getSavedPaymentMethods]);

  // Profile Update Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
      });
      showStatus('success', 'Profile details updated successfully.');
    } catch {
      showStatus('error', 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrName(`${user?.first_name || ''} ${user?.last_name || ''}`.trim());
    setAddrMobile(user?.mobile || '');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('Bengaluru');
    setAddrState('Karnataka');
    setAddrZip('560001');
    setAddrType('Home');
    setAddrIsDefault(addresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.fullName);
    setAddrMobile(addr.mobile);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrZip(addr.zip);
    setAddrType(addr.addressType || 'Home');
    setAddrIsDefault(!!addr.isDefault);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName.trim() || !addrLine1.trim() || !addrCity.trim() || !addrZip.trim()) {
      showStatus('error', 'Please fill in all required address fields.');
      return;
    }

    if (editingAddressId) {
      updateCustomerAddress({
        id: editingAddressId,
        userId: user?.user_id || 1,
        fullName: addrName.trim(),
        mobile: addrMobile.trim(),
        addressLine1: addrLine1.trim(),
        addressLine2: addrLine2.trim(),
        city: addrCity.trim(),
        state: addrState.trim(),
        zip: addrZip.trim(),
        country: 'India',
        addressType: addrType,
        isDefault: addrIsDefault,
      });
      showStatus('success', 'Address updated successfully.');
    } else {
      addCustomerAddress({
        userId: user?.user_id || 1,
        fullName: addrName.trim(),
        mobile: addrMobile.trim(),
        addressLine1: addrLine1.trim(),
        addressLine2: addrLine2.trim(),
        city: addrCity.trim(),
        state: addrState.trim(),
        zip: addrZip.trim(),
        country: 'India',
        addressType: addrType,
        isDefault: addrIsDefault,
      });
      showStatus('success', 'New delivery address added.');
    }

    setAddresses(getCustomerAddresses());
    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    deleteCustomerAddress(id);
    setAddresses(getCustomerAddresses());
    showStatus('success', 'Address removed.');
  };

  // Payment Handlers
  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s+/g, '').length < 15 || !cardHolder.trim()) {
      showStatus('error', 'Please enter a valid card number and holder name.');
      return;
    }
    const exp = `${expiryMonth}/${expiryYear.slice(-2)}`;
    addSavedCard(cardHolder.trim(), cardNumber.trim(), exp, payments.length === 0);
    setPayments(getSavedPaymentMethods());
    setIsCardModalOpen(false);
    setCardNumber('');
    setCardHolder('');
    showStatus('success', 'Card saved successfully.');
  };

  const handleSaveUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiIdInput.includes('@')) {
      showStatus('error', 'Please enter a valid UPI ID (e.g. name@bank).');
      return;
    }
    addSavedUpi(upiIdInput.trim(), payments.length === 0);
    setPayments(getSavedPaymentMethods());
    setIsUpiModalOpen(false);
    setUpiIdInput('');
    showStatus('success', 'UPI ID linked successfully.');
  };

  const handleDeletePayment = (id: string) => {
    deleteSavedPaymentMethod(id);
    setPayments(getSavedPaymentMethods());
    showStatus('success', 'Payment method removed.');
  };

  const myOrders = orders;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 6rem', maxWidth: '1100px' }}>
      {/* Profile Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          color: 'white',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'white',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-heading)' }}>
                {user?.first_name} {user?.last_name}
              </h1>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{user?.email}</span>
              <span>•</span>
              <span>{user?.mobile}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {activeTab !== 'hub' && (
            <button
              type="button"
              onClick={() => setTab('hub')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Account Center
            </button>
          )}
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

      {/* ─── 1. HUB OVERVIEW ──────────────────────────────────────────────── */}
      {activeTab === 'hub' && (
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            Your Account Hub
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

            {/* Tile 2: Profile Details */}
            <div
              onClick={() => setTab('profile')}
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
                <UserIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Profile & Details</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Update your display name, contact phone, and email preferences.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: '8px', display: 'inline-block' }}>
                  Edit details →
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
                  Manage saved tokenized cards & UPI IDs for 1-click checkout.
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
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Saved Wishlist</h3>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  View and manage your favorite items and deals saved for later.
                </p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48', marginTop: '8px', display: 'inline-block' }}>
                  {wishlistItems.length} items saved →
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ─── 2. PROFILE EDIT TAB ────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', maxWidth: '650px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
            Customer Profile Details
          </h2>
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Mobile Phone</label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ gap: '8px' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* ─── 3. ORDERS TAB ──────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Order History ({myOrders.length})
            </h2>
            <Link to="/store" className="btn btn-secondary btn-sm">
              Continue Shopping
            </Link>
          </div>

          {myOrders.length === 0 ? (
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center' }}>
              <Package size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No orders placed yet</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your past purchases and invoice receipts will appear here.</p>
              <Link to="/store" className="btn btn-primary">Browse Catalog</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {myOrders.map((order) => (
                <div
                  key={order.order_id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ORDER #{order.order_id}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Placed on {formatDate(order.created_at)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                        {order.status}
                      </span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                        {formatCurrency(order.total_amt)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.product_image}
                          alt={item.product_title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                          }}
                          style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.product_title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Qty: {item.qty} × {formatCurrency(item.amt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Link to={`/order-success/${order.order_id}`} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                      <ExternalLink size={14} /> View Invoice & Receipt
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 4. ADDRESSES TAB ───────────────────────────────────────────── */}
      {activeTab === 'addresses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Saved Delivery Addresses ({addresses.length})
            </h2>
            <button type="button" onClick={handleOpenAddAddress} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
              <Plus size={16} /> Add New Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center' }}>
              <MapPin size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No addresses saved</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Add a delivery address to speed up your checkout process.</p>
              <button type="button" onClick={handleOpenAddAddress} className="btn btn-primary">Add Address</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    backgroundColor: 'white',
                    border: addr.isDefault ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{addr.fullName}</div>
                    {addr.isDefault && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                    <div>{addr.addressLine1}</div>
                    {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                    <div>{addr.city}, {addr.state} - {addr.zip}</div>
                    <div style={{ marginTop: '4px', fontWeight: 600, color: '#0f172a' }}>Phone: {addr.mobile}</div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditAddress(addr)}
                        style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultAddress(addr.id);
                          setAddresses(getCustomerAddresses());
                        }}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. PAYMENTS TAB ────────────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Saved Payment Methods ({payments.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setIsCardModalOpen(true)} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                <CreditCard size={16} /> Save Card
              </button>
              <button type="button" onClick={() => setIsUpiModalOpen(true)} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                <QrCode size={16} /> Link UPI ID
              </button>
            </div>
          </div>

          {payments.length === 0 ? (
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center' }}>
              <CreditCard size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>No payment methods saved</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Save a card or UPI ID for instant 1-click checkout.</p>
              <button type="button" onClick={() => setIsUpiModalOpen(true)} className="btn btn-primary">Link UPI ID</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {payments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: 'white',
                    border: p.isDefault ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {p.type === 'UPI' ? <QrCode size={22} color="#4f46e5" /> : <CreditCard size={22} color="#059669" />}
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                        {p.type === 'UPI' ? 'UPI Virtual Address' : `${p.cardBrand || 'Card'} •••• ${p.last4 || '••••'}`}
                      </span>
                    </div>
                    {p.isDefault && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
                    {p.type === 'UPI' ? (
                      <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>{p.upiId}</div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 600 }}>{p.cardHolderName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Expires: {p.expiryMonth}/{p.expiryYear}</div>
                      </>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDeletePayment(p.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                    {!p.isDefault && (
                      <button
                        type="button"
                        onClick={() => {
                          setDefaultPaymentMethod(p.id);
                          setPayments(getSavedPaymentMethods());
                        }}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
              {editingAddressId ? 'Edit Address' : 'Add Delivery Address'}
            </h3>
            <form onSubmit={handleSaveAddress}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Name *</label>
                  <input type="text" required value={addrName} onChange={(e) => setAddrName(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Mobile Phone *</label>
                  <input type="tel" required value={addrMobile} onChange={(e) => setAddrMobile(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Street Address / Flat No *</label>
                <input type="text" required value={addrLine1} onChange={(e) => setAddrLine1(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Area / Landmark</label>
                <input type="text" value={addrLine2} onChange={(e) => setAddrLine2(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>City *</label>
                  <input type="text" required value={addrCity} onChange={(e) => setAddrCity(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>State *</label>
                  <input type="text" required value={addrState} onChange={(e) => setAddrState(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>PIN Code *</label>
                  <input type="text" required value={addrZip} onChange={(e) => setAddrZip(e.target.value)} style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card Modal */}
      {isCardModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Save Credit / Debit Card</h3>
            <form onSubmit={handleSaveCard}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Cardholder Name</label>
                <input type="text" required value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Rahul Sharma" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Card Number</label>
                <input type="text" required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Expiry Month</label>
                  <input type="text" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} placeholder="12" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Expiry Year</label>
                  <input type="text" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} placeholder="2028" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsCardModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPI Modal */}
      {isUpiModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>Link UPI ID (VPA)</h3>
            <form onSubmit={handleSaveUpi}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Virtual Payment Address (UPI ID)</label>
                <input type="text" required value={upiIdInput} onChange={(e) => setUpiIdInput(e.target.value)} placeholder="username@okaxis" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsUpiModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Link UPI ID</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfilePage;
