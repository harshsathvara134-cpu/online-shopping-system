import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  HelpCircle,
  Smartphone,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePasswordPolicy } from '../utils/security';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'identify';
  const returnUrl = searchParams.get('returnUrl') || '/store';

  const {
    login,
    identifyAccount,
    verifyCustomer2FALogin,
    requestRegistration,
    verifyRegistrationOtp,
    resendRegistrationOtp,
    requestCustomerPasswordReset,
    verifyCustomerPasswordReset,
    user,
  } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to store or requested page
  useEffect(() => {
    if (user) {
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);

  // Main UI Mode
  const [mode, setMode] = useState<'identify' | 'password' | '2fa' | 'register' | 'verify_register' | 'forgot_password'>('identify');

  // Identification State (Step 1)
  const [identifier, setIdentifier] = useState('');
  const [identifiedUser, setIdentifiedUser] = useState<{ email: string; mobile: string; firstName: string; twoFactorEnabled: boolean } | null>(null);

  // Authentication State (Step 2)
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 2FA Challenge State (Step 3)
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isUsingRecoveryCode, setIsUsingRecoveryCode] = useState(false);

  // Registration State
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Verification State (Registration & Password Reset)
  const [verificationToken, setVerificationToken] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [debugOtpNotice, setDebugOtpNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify_reset'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Feedback Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Resend Timer Countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  // ─── 1. Step 1: Identify Account ──────────────────────────────────────────
  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address or mobile number to continue.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = identifyAccount(identifier.trim());
      setIsLoading(false);

      if (res.exists && res.user) {
        setIdentifiedUser(res.user);
        setMode('password');
      } else {
        // Amazon-style: If account does not exist, guide user to registration with prefilled identifier
        if (identifier.includes('@')) {
          setRegEmail(identifier.trim());
        } else {
          setRegMobile(identifier.trim());
        }
        setErrorMessage('We cannot find an account with that identifier. Please create a new account.');
        setMode('register');
      }
    }, 300);
  };

  // ─── 2. Step 2: Password Sign In ──────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(identifiedUser?.email || identifier, password, rememberMe);
      if (res.success) {
        navigate(returnUrl);
      } else if (res.requires2FA) {
        setMode('2fa');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 3. Step 3: 2FA Verification ──────────────────────────────────────────
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!twoFactorCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyCustomer2FALogin(twoFactorCode, isUsingRecoveryCode);
      if (res.success) {
        navigate(returnUrl);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to verify two-factor code.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 4. Registration Submit ───────────────────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!regFirstName.trim()) {
      setErrorMessage('First name is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regMobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const policy = validatePasswordPolicy(regPassword);
    if (!policy.isValid) {
      setErrorMessage(policy.errors[0]);
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Conditions of Use & Privacy Notice.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestRegistration(
        {
          first_name: regFirstName.trim(),
          last_name: regLastName.trim(),
          email: regEmail.trim(),
          mobile: regMobile.trim(),
          address1: '',
          address2: '',
        },
        regPassword
      );

      if (res.success && res.verificationToken) {
        setVerificationToken(res.verificationToken);
        setDebugOtpNotice(res.debugOtp || null);
        setResendCooldown(60);
        setSuccessMessage(res.message);
        setMode('verify_register');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to initiate account registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 5. Verify Registration OTP ───────────────────────────────────────────
  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!enteredOtp.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyRegistrationOtp(verificationToken, enteredOtp.trim());
      if (res.success) {
        navigate(returnUrl);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to verify OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendRegisterOtp = () => {
    if (resendCooldown > 0) return;
    const res = resendRegistrationOtp(verificationToken);
    if (res.success) {
      setDebugOtpNotice(res.debugOtp || null);
      setResendCooldown(60);
      setSuccessMessage(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  // ─── 6. Forgot Password Handlers ──────────────────────────────────────────
  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = requestCustomerPasswordReset(forgotIdentifier.trim());
      setIsLoading(false);
      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setDebugOtpNotice(res.debugOtp || null);
        setForgotStep('verify_reset');
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleForgotVerifyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!enteredOtp.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    const policy = validatePasswordPolicy(newResetPassword);
    if (!policy.isValid) {
      setErrorMessage(policy.errors[0]);
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyCustomerPasswordReset(resetToken, enteredOtp.trim(), newResetPassword);
      if (res.success) {
        setSuccessMessage('Password reset successfully! Please sign in with your new password.');
        setMode('identify');
        setPassword('');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const regPassPolicy = validatePasswordPolicy(regPassword);

  return (
    <div style={{ minHeight: '82vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem', backgroundColor: '#f8fafc' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 20px rgba(67, 56, 202, 0.25)',
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
            JAYVEER<span style={{ color: '#4f46e5' }}>Mart</span>
          </span>
        </Link>
      </div>

      {/* Main Container Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Error / Success Notifications */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#b91c1c',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              color: '#15803d',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Debug OTP Banner (offline development) */}
        {debugOtpNotice && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              color: '#1d4ed8',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            Simulated OTP Code: <strong>{debugOtpNotice}</strong>
          </div>
        )}

        {/* ─── STAGE 1: IDENTIFY USER (Amazon-Style Step 1) ───────────────── */}
        {mode === 'identify' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem' }}>
              Sign In
            </h2>

            <form onSubmit={handleIdentifySubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Email or mobile phone number
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. rahul@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#4f46e5')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                }}
              >
                {isLoading ? 'Checking Account...' : 'Continue'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
              By continuing, you agree to JAYVEERMart's{' '}
              <a href="#" style={{ color: '#4f46e5', textDecoration: 'none' }}>Conditions of Use</a> and{' '}
              <a href="#" style={{ color: '#4f46e5', textDecoration: 'none' }}>Privacy Notice</a>.
            </div>

            <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
                New to JAYVEERMart?
              </span>
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('register');
                }}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Create your JAYVEERMart account
              </button>
            </div>
          </div>
        )}

        {/* ─── STAGE 2: PASSWORD AUTHENTICATION (Step 2) ──────────────────── */}
        {mode === 'password' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Sign In
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#334155' }}>
              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                {identifiedUser?.email || identifier}
              </span>
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('identify');
                  setPassword('');
                }}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Change
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages();
                      setForgotIdentifier(identifiedUser?.email || identifier);
                      setForgotStep('request');
                      setMode('forgot_password');
                    }}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', borderRadius: '4px', accentColor: '#4f46e5' }}
                  />
                  <span>Keep me signed in</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* ─── STAGE 3: 2FA CHALLENGE STEP ────────────────────────────────── */}
        {mode === '2fa' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <ShieldCheck size={26} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                Two-Step Verification
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                {isUsingRecoveryCode ? 'Enter one of your 8-character backup recovery codes' : 'Enter the 6-digit code from your authenticator app'}
              </p>
            </div>

            <form onSubmit={handle2FASubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={isUsingRecoveryCode ? 'XXXX-XXXX' : '000000'}
                  maxLength={isUsingRecoveryCode ? 12 : 6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: '2px solid #4f46e5',
                    fontSize: isUsingRecoveryCode ? '1.1rem' : '1.35rem',
                    fontWeight: 800,
                    letterSpacing: isUsingRecoveryCode ? '3px' : '6px',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {isLoading ? 'Verifying Code...' : 'Verify & Continue'} <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setIsUsingRecoveryCode(!isUsingRecoveryCode)}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {isUsingRecoveryCode ? '← Use Authenticator Code' : 'Use Recovery Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('identify');
                  }}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── STAGE 4: REGISTRATION FLOW ─────────────────────────────────── */}
        {mode === 'register' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.25rem' }}>
              Create Account
            </h2>

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Mobile Number *</label>
                <div style={{ display: 'flex' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '0 8px 8px 0', border: '1px solid #cbd5e1', fontSize: '0.8125rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 36px 9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {regPassword && (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '3px', height: '4px', marginBottom: '5px' }}>
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          style={{
                            flex: 1,
                            borderRadius: '2px',
                            backgroundColor:
                              regPassPolicy.score >= step
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                        Strength: <strong>{regPassPolicy.strengthLabel}</strong>
                      </span>
                      {!regPassPolicy.isValid && (
                        <span style={{ fontSize: '0.6875rem', color: '#e11d48', fontWeight: 600 }}>
                          Requirements incomplete
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 6px', fontSize: '0.6875rem', backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: regPassword.length >= 8 ? '#16a34a' : '#94a3b8' }}>
                        {regPassword.length >= 8 ? '✓' : '○'} 8+ Characters
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: /[A-Z]/.test(regPassword) ? '#16a34a' : '#e11d48', fontWeight: !/[A-Z]/.test(regPassword) ? 600 : 400 }}>
                        {/[A-Z]/.test(regPassword) ? '✓' : '○'} Uppercase (A-Z)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: /[0-9]/.test(regPassword) ? '#16a34a' : '#94a3b8' }}>
                        {/[0-9]/.test(regPassword) ? '✓' : '○'} Number (0-9)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(regPassword) ? '#16a34a' : '#94a3b8' }}>
                        {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(regPassword) ? '✓' : '○'} Special Symbol
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: '#4f46e5' }}
                  />
                  <span>I agree to JAYVEERMart's Conditions of Use and Privacy Notice.</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {isLoading ? 'Sending Verification Code...' : 'Verify Email & Create Account'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.8125rem' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('identify');
                }}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign in →
              </button>
            </div>
          </div>
        )}

        {/* ─── STAGE 5: VERIFY REGISTRATION OTP ───────────────────────────── */}
        {mode === 'verify_register' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <Mail size={24} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                Verify Email Address
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                To verify your email, we've sent a 6-digit code to <strong>{regEmail}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyRegisterOtp}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px', textAlign: 'center' }}>
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  placeholder="000000"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #4f46e5',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    letterSpacing: '6px',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {isLoading ? 'Verifying Account...' : 'Confirm & Activate Account'} <ArrowRight size={16} />
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', fontSize: '0.8125rem' }}>
                <button
                  type="button"
                  onClick={handleResendRegisterOtp}
                  disabled={resendCooldown > 0}
                  style={{ background: 'none', border: 'none', color: resendCooldown > 0 ? '#94a3b8' : '#4f46e5', fontWeight: 600, cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', padding: 0 }}
                >
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend OTP Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('register');
                  }}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                >
                  Change Email
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── STAGE 6: FORGOT PASSWORD FLOW ──────────────────────────────── */}
        {mode === 'forgot_password' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <KeyRound size={24} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                Password Assistance
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                {forgotStep === 'request'
                  ? 'Enter the email or mobile phone number associated with your account'
                  : 'Enter the 6-digit code and choose a new password'}
              </p>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotRequest}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Email or mobile number
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. rahul@example.com"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isLoading ? 'Dispatching OTP...' : 'Send Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotVerifyReset}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    placeholder="000000"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '4px', textAlign: 'center', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 8 chars, 1 uppercase, 1 symbol"
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      style={{ width: '100%', padding: '10px 38px 10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showResetPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isLoading ? 'Resetting Password...' : 'Save Changes & Sign In'}
                </button>
              </form>
            )}

            <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('identify');
                }}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                ← Return to Sign In
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Link to Storefront */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
        <Link to="/store" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
          ← Return to Storefront Catalog
        </Link>
      </div>
    </div>
  );
};
