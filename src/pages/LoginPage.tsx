import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, User, Phone, MapPin, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regAddress1, setRegAddress1] = useState('');
  const [regAddress2, setRegAddress2] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    const res = await login(loginEmail.trim(), loginPassword);
    if (res.success) {
      navigate('/store');
    } else {
      setMessage({ text: res.message, isError: true });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regEmail.trim()) return;

    const res = await register(
      {
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim(),
        address1: regAddress1.trim(),
        address2: regAddress2.trim(),
      },
      regPassword
    );

    if (res.success) {
      navigate('/store');
    } else {
      setMessage({ text: res.message, isError: true });
    }
  };

  const handleQuickDemo = (role: 'customer' | 'admin') => {
    demoLogin(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/store');
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '540px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
          }}
        >
          <ShoppingBag size={28} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Welcome to JAYVEERMart</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Access your personal orders, wishlist, and exclusive member discounts
        </p>
      </div>

      {/* Quick Demo Access Pills */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#eef2ff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #c7d2fe',
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={14} /> Quick Demo One-Click Login
        </div>
        <div style={{ display: 'flex' }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('customer')}
            className="btn btn-sm btn-primary"
            style={{ width: '100%' }}
          >
            ⚡ One-Click Demo Customer Login
          </button>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: message.isError ? 'var(--danger-light)' : 'var(--success-light)',
            color: message.isError ? 'var(--danger)' : 'var(--success)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Tab Switcher Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '1.75rem',
          }}
        >
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeTab === 'login' ? 'white' : 'transparent',
              color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'login' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeTab === 'register' ? 'white' : 'transparent',
              color: activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'register' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Tab */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@nexusmart.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
              Sign In to Account <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          /* Create Account Tab */
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Last Name</label>
                <input
                  type="text"
                  placeholder="Sharma"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Delivery Street Address</label>
              <input
                type="text"
                placeholder="Flat / House No., Landmark"
                value={regAddress1}
                onChange={(e) => setRegAddress1(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">City, State & PIN</label>
              <input
                type="text"
                placeholder="Bengaluru, Karnataka 560001"
                value={regAddress2}
                onChange={(e) => setRegAddress2(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
              Create Customer Account <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
