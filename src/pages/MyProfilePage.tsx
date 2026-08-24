import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Check, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MyProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name || 'Rahul');
  const [lastName, setLastName] = useState(user?.last_name || 'Sharma');
  const [email, setEmail] = useState(user?.email || 'customer@nexusmart.com');
  const [mobile, setMobile] = useState(user?.mobile || '+91 98765 43210');
  const [address1, setAddress1] = useState(user?.address1 || '402, Skyline Towers, MG Road');
  const [address2, setAddress2] = useState(user?.address2 || 'Bengaluru, Karnataka 560001');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      first_name: firstName,
      last_name: lastName,
      email,
      mobile,
      address1,
      address2,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPassSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(false), 3000);
    } else {
      alert('New passwords do not match.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '850px' }}>
      {/* Profile Header */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: 'white',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
          }}
        >
          {firstName.charAt(0)}{lastName.charAt(0)}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
              {firstName} {lastName}
            </h1>
            <span style={{ backgroundColor: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: 700 }}>
              Verified Customer
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', opacity: 0.85 }}>{email}</p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Profile details saved successfully!
        </div>
      )}

      {/* Main Settings Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Personal Details & Shipping Address */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Personal & Delivery Information
          </h2>

          <form onSubmit={handleProfileSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Primary Street Address</label>
                <input
                  type="text"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">City, State & Postal Code</label>
                <input
                  type="text"
                  required
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="var(--primary)" /> Security & Password
          </h2>

          {passSuccess && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} /> Password updated successfully!
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
