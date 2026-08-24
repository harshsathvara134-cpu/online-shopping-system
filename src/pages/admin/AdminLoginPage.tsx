import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@nexusmart.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { demoLogin, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (email.trim().toLowerCase() === 'admin@nexusmart.com') {
      demoLogin('admin');
      navigate('/admin');
    } else {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError('Invalid administrative credentials.');
      }
    }
  };

  const handleOneClick = () => {
    demoLogin('admin');
    navigate('/admin');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '1.25rem',
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>
            NexusMart Admin Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Enter your credentials to access the administrative control center
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Form Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#1e293b',
            borderColor: '#334155',
            padding: '2rem',
            color: 'white',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" style={{ color: '#e2e8f0' }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: 'white',
                    paddingLeft: '2.5rem',
                  }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748b' }} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ color: '#e2e8f0' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: 'white',
                    paddingLeft: '2.5rem',
                  }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#64748b' }} />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem', fontWeight: 700 }}
            >
              Sign In to Dashboard <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={handleOneClick}
              className="btn btn-secondary"
              style={{
                width: '100%',
                marginTop: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: '#334155',
                color: '#a5b4fc',
              }}
            >
              ⚡ 1-Click Quick Admin Access
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#94a3b8' }}
          >
            <ArrowLeft size={14} /> Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
