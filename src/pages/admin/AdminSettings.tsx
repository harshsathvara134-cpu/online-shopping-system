import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, RotateCcw, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../data/mockDb';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [adminName, setAdminName] = useState('Administrator');
  const [adminEmail, setAdminEmail] = useState('admin@nexusmart.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDatabase = () => {
    if (window.confirm('WARNING: This will reset all products, categories, brands, orders, and reviews back to default factory seed data. Proceed?')) {
      mockDb.resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Account & Store Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Configure administrative credentials, security parameters, and database state
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> Administrative settings updated successfully!
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            Administrator Credentials
          </h2>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Admin Name</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Admin Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">New Password</label>
                <input
                  type="password"
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
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Save Credentials
            </button>
          </form>
        </div>

        {/* Factory Reset Card */}
        <div className="card" style={{ padding: '2rem', borderColor: '#fecaca', backgroundColor: '#fff5f5' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={20} /> Reset Factory Seed Data
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Reset all product listings, stock levels, categories, brands, orders, and reviews to the pristine SQL seed state.
          </p>

          <button onClick={handleResetDatabase} className="btn btn-danger" style={{ fontWeight: 700 }}>
            Reset All Store Data to Initial Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
