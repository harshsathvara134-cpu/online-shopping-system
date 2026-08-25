import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authRateLimiter, generateCaptchaChallenge, validatePasswordPolicy } from '../../utils/security';
import { CaptchaChallenge } from '../../types';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, verify2FALogin, requestPasswordReset, verifyPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Rate Limiting & CAPTCHA States
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // 2FA Verification Stage
  const [stage, setStage] = useState<'credentials' | '2fa' | 'forgot_password'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [isUsingRecoveryCode, setIsUsingRecoveryCode] = useState(false);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');

  // Forgot Password Flow States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [debugOtpNotice, setDebugOtpNotice] = useState<string | null>(null);

  // Check rate limit status on email change
  const refreshRateLimitState = (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    const status = authRateLimiter.getStatus(targetEmail);
    if (status.locked) {
      setLockoutRemaining(status.remainingSeconds);
    } else {
      setLockoutRemaining(0);
    }

    if (status.requiresCaptcha && !captcha) {
      setCaptcha(generateCaptchaChallenge());
    }
  };

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptchaChallenge());
    setCaptchaInput('');
  };

  // Submit Credentials Form
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your administrator email and password.');
      return;
    }

    // Verify CAPTCHA if presented
    if (captcha) {
      if (!captchaInput.trim() || Number(captchaInput.trim()) !== captcha.answer) {
        setErrorMessage('Security verification calculation is incorrect. Please try again.');
        handleRefreshCaptcha();
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await adminLogin(
        cleanEmail,
        password,
        rememberMe,
        captcha ? Number(captchaInput) : undefined,
        captcha ? captcha.answer : undefined
      );

      if (res.success && res.requires2FA) {
        setStage('2fa');
        setSuccessMessage(res.message);
      } else if (res.success) {
        const dest = (location.state as any)?.from || '/admin';
        navigate(dest, { replace: true });
      } else {
        setErrorMessage(res.message);
        refreshRateLimitState(cleanEmail);
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit 2FA Verification
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isUsingRecoveryCode) {
      if (!recoveryCodeInput.trim()) {
        setErrorMessage('Please enter an 8-character backup recovery code.');
        return;
      }
      setIsLoading(true);
      const res = await verify2FALogin(recoveryCodeInput.trim(), true);
      setIsLoading(false);

      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    } else {
      if (!otpCode.trim() || otpCode.trim().length < 6) {
        setErrorMessage('Please enter the complete 6-digit authentication code.');
        return;
      }
      setIsLoading(true);
      const res = await verify2FALogin(otpCode.trim(), false);
      setIsLoading(false);

      if (res.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  // Forgot Password: Step 1 Request
  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setDebugOtpNotice(null);

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }

    setIsLoading(true);
    const res = requestPasswordReset(forgotEmail);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      if (res.debugOtp) {
        setDebugOtpNotice(res.debugOtp);
      }
      setForgotStep('verify');
    } else {
      setErrorMessage(res.message);
    }
  };

  // Forgot Password: Step 2 Verify & Set Password
  const handleForgotVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!resetOtp.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    const policy = validatePasswordPolicy(newPassword);
    if (!policy.isValid) {
      setErrorMessage(policy.errors[0]);
      return;
    }

    setIsLoading(true);
    const res = await verifyPasswordReset(forgotEmail, resetOtp, newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setTimeout(() => {
        setStage('credentials');
        setForgotStep('request');
        setResetOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setDebugOtpNotice(null);
      }, 2000);
    } else {
      setErrorMessage(res.message);
    }
  };

  const newPassPolicy = validatePasswordPolicy(newPassword);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0f1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        backgroundImage: 'radial-gradient(ellipse at 50% 10%, rgba(79, 70, 229, 0.15), transparent 70%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '1.25rem',
              boxShadow: '0 12px 30px rgba(79, 70, 229, 0.45)',
            }}
          >
            <ShieldCheck size={36} />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            JAYVEER<span style={{ color: '#818cf8' }}>Admin</span> Portal
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Enterprise Management Control Center • v3.0
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Lockout Warning Banner */}
        {lockoutRemaining > 0 && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>Account locked. Retry available in <strong>{lockoutRemaining}s</strong></span>
          </div>
        )}

        {/* ─── STAGE 1: Standard Credentials Login ────────────────────────── */}
        {stage === 'credentials' && (
          <div
            style={{
              backgroundColor: '#131b2e',
              border: '1px solid #23304d',
              borderRadius: '20px',
              padding: '2.25rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
            }}
          >
            <form onSubmit={handleCredentialsSubmit}>
              {/* Admin Email */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Admin Email / Login Identifier
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="harshsathvara134@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      refreshRateLimitState(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
                      backgroundColor: '#0a0f1d',
                      border: '1px solid #283654',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#283654')}
                  />
                  <Mail size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: '#64748b' }} />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600 }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStage('forgot_password');
                      setForgotEmail(email);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#818cf8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 42px 11px 40px',
                      backgroundColor: '#0a0f1d',
                      border: '1px solid #283654',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#283654')}
                  />
                  <Lock size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: '#64748b' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Dynamic Security CAPTCHA Challenge (After multiple attempts) */}
              {captcha && (
                <div
                  style={{
                    marginBottom: '1.25rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: '10px',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <HelpCircle size={14} /> Security Verification
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshCaptcha}
                      style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}
                    >
                      <RefreshCw size={12} /> New Problem
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#0a0f1d', padding: '8px 14px', borderRadius: '8px', border: '1px solid #283654', color: '#38bdf8', fontWeight: 800, fontSize: '1rem', letterSpacing: '2px' }}>
                      {captcha.question}
                    </div>
                    <input
                      type="number"
                      required
                      placeholder="Answer"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        backgroundColor: '#0a0f1d',
                        border: '1px solid #283654',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8125rem', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', accentColor: '#4f46e5', cursor: 'pointer' }}
                  />
                  <span>Remember this device for 7 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || lockoutRemaining > 0}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: lockoutRemaining > 0 ? '#334155' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: lockoutRemaining > 0 || isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Dashboard</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ─── STAGE 2: Two-Factor Authentication Step ───────────────────── */}
        {stage === '2fa' && (
          <div
            style={{
              backgroundColor: '#131b2e',
              border: '1px solid #23304d',
              borderRadius: '20px',
              padding: '2.25rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Fingerprint size={28} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                Two-Factor Authentication
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                {isUsingRecoveryCode
                  ? 'Enter one of your 8-character backup recovery codes'
                  : 'Enter the 6-digit authentication code from your authenticator app'}
              </p>
            </div>

            <form onSubmit={handle2FASubmit}>
              {!isUsingRecoveryCode ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px', textAlign: 'center' }}>
                    6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#0a0f1d',
                      border: '2px solid #374151',
                      borderRadius: '10px',
                      color: '#a5b4fc',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      textAlign: 'center',
                      letterSpacing: '8px',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#374151')}
                  />
                  <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                    Codes rotate every 30 seconds • Standard demo bypass: <strong>123456</strong>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                    Backup Recovery Code (e.g. ABCD-1234)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="XXXX-XXXX"
                      value={recoveryCodeInput}
                      onChange={(e) => setRecoveryCodeInput(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        backgroundColor: '#0a0f1d',
                        border: '1px solid #283654',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        outline: 'none',
                      }}
                    />
                    <KeyRound size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: '#64748b' }} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                  color: 'white',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)',
                }}
              >
                {isLoading ? 'Verifying 2FA...' : 'Verify & Continue'} <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
                <button
                  type="button"
                  onClick={() => setIsUsingRecoveryCode(!isUsingRecoveryCode)}
                  style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}
                >
                  {isUsingRecoveryCode ? '← Use Authenticator Code' : 'Use Backup Recovery Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStage('credentials');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8125rem', cursor: 'pointer', padding: 0 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── STAGE 3: Forgot Password OTP Reset Flow ────────────────────── */}
        {stage === 'forgot_password' && (
          <div
            style={{
              backgroundColor: '#131b2e',
              border: '1px solid #23304d',
              borderRadius: '20px',
              padding: '2.25rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <KeyRound size={28} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                Reset Admin Password
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                {forgotStep === 'request'
                  ? 'We will generate a secure 6-digit one-time verification token'
                  : 'Enter the 6-digit code and choose a strong replacement password'}
              </p>
            </div>

            {/* Debug OTP Banner for offline simulation */}
            {debugOtpNotice && (
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  color: '#93c5fd',
                  fontSize: '0.8125rem',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                }}
              >
                Simulated Email OTP: <strong>{debugOtpNotice}</strong>
              </div>
            )}

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequest}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                    Administrator Account Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      required
                      placeholder="harshsathvara134@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        backgroundColor: '#0a0f1d',
                        border: '1px solid #283654',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    <Mail size={17} style={{ position: 'absolute', left: '13px', top: '13px', color: '#64748b' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                    color: 'white',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isLoading ? 'Dispatching...' : 'Dispatch Verification Code'} <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotVerify}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#0a0f1d',
                      border: '1px solid #283654',
                      borderRadius: '8px',
                      color: '#a5b4fc',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      letterSpacing: '6px',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 38px 10px 14px',
                        backgroundColor: '#0a0f1d',
                        border: '1px solid #283654',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength & Live Policy Checklist */}
                  {newPassword && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '3px', height: '4px', marginBottom: '5px' }}>
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
                                  : '#1e293b',
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Strength: <strong>{newPassPolicy.strengthLabel}</strong>
                        </span>
                        {!newPassPolicy.isValid && (
                          <span style={{ fontSize: '0.75rem', color: '#f87171', fontWeight: 600 }}>
                            Requirements incomplete
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 6px', fontSize: '0.75rem', backgroundColor: '#0a0f1d', padding: '6px 8px', borderRadius: '6px', border: '1px solid #283654' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: newPassword.length >= 8 ? '#34d399' : '#64748b' }}>
                          {newPassword.length >= 8 ? '✓' : '○'} 8+ Characters
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: /[A-Z]/.test(newPassword) ? '#34d399' : '#f87171', fontWeight: !/[A-Z]/.test(newPassword) ? 600 : 400 }}>
                          {/[A-Z]/.test(newPassword) ? '✓' : '○'} Uppercase (A-Z)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: /[0-9]/.test(newPassword) ? '#34d399' : '#64748b' }}>
                          {/[0-9]/.test(newPassword) ? '✓' : '○'} Number (0-9)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? '#34d399' : '#64748b' }}>
                          {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? '✓' : '○'} Special Symbol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#0a0f1d',
                      border: '1px solid #283654',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isLoading ? 'Updating Password...' : 'Save & Invalidate Other Sessions'} <ArrowRight size={18} />
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => {
                  setStage('credentials');
                  setForgotStep('request');
                  setErrorMessage('');
                  setSuccessMessage('');
                  setDebugOtpNotice(null);
                }}
                style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.8125rem', cursor: 'pointer' }}
              >
                ← Return to Admin Login
              </button>
            </div>
          </div>
        )}

        {/* Storefront Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <ArrowLeft size={14} /> Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
