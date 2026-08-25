/**
 * JAYVEERMart Enterprise Email & Security Notification Service
 * Production-ready email dispatcher with responsive branded HTML templates.
 * 
 * Supports:
 * - Email Verification OTPs (Registration & Email Change)
 * - Welcome & Account Activation
 * - Customer & Admin Login Notifications
 * - New Unrecognized Device Sign-In Alerts
 * - Password Reset OTP & Password Changed Confirmations
 * - Two-Factor Authentication Status Notifications
 * - Resend API integration with safe fallback outbox store and deduplication.
 */

import { User } from '../types';
import { logSecurityEvent } from '../utils/securityLogger';
import { getClientDeviceMeta } from '../utils/security';

export type EmailNotificationType =
  | 'admin_login_alert'
  | 'customer_login_confirmation'
  | 'email_verification_otp'
  | 'welcome_account'
  | 'new_device_alert'
  | 'password_changed'
  | 'password_reset_otp'
  | 'two_factor_status_changed'
  | 'security_alert';

export interface DispatchedEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  type: EmailNotificationType;
  html: string;
  text: string;
  sentAt: string;
  status: 'DELIVERED' | 'SIMULATED' | 'FAILED';
  metadata?: Record<string, unknown>;
}

const OUTBOX_STORAGE_KEY = 'jayveermart_email_outbox';
const PROCESSED_EVENTS_KEY = 'jayveermart_processed_login_events';

// In-memory set to prevent duplicate triggers during single browser run/re-renders
const processedEventIds = new Set<string>();

const isEventAlreadyProcessed = (loginEventId: string): boolean => {
  if (processedEventIds.has(loginEventId)) return true;
  try {
    const raw = localStorage.getItem(PROCESSED_EVENTS_KEY);
    const set: string[] = raw ? JSON.parse(raw) : [];
    if (set.includes(loginEventId)) {
      processedEventIds.add(loginEventId);
      return true;
    }
  } catch {
    // Fail silently
  }
  return false;
};

const markEventProcessed = (loginEventId: string): void => {
  processedEventIds.add(loginEventId);
  try {
    const raw = localStorage.getItem(PROCESSED_EVENTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(loginEventId)) {
      list.push(loginEventId);
      if (list.length > 200) list.shift();
      localStorage.setItem(PROCESSED_EVENTS_KEY, JSON.stringify(list));
    }
  } catch {
    // Fail silently
  }
};

export const saveDispatchedEmail = (email: DispatchedEmail): void => {
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    const list: DispatchedEmail[] = raw ? JSON.parse(raw) : [];
    list.unshift(email);
    if (list.length > 100) list.pop();
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to record dispatched email in outbox:', err);
  }
};

export const getDispatchedEmails = (): DispatchedEmail[] => {
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearDispatchedEmails = (): void => {
  try {
    localStorage.removeItem(OUTBOX_STORAGE_KEY);
  } catch {
    // Fail silently
  }
};

/**
 * Dispatch an email via Resend API or Local Simulated Deliverer
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text: string,
  type: EmailNotificationType,
  metadata?: Record<string, unknown>
): Promise<void> => {
  const fromEmail = (import.meta.env.VITE_FROM_EMAIL as string) || 'JAYVEERMart <noreply@jayveermart.com>';
  const resendApiKey = (import.meta.env.VITE_RESEND_API_KEY as string) || '';

  const emailRecord: DispatchedEmail = {
    id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    to,
    from: fromEmail,
    subject,
    type,
    html,
    text,
    sentAt: new Date().toISOString(),
    status: 'SIMULATED',
    metadata,
  };

  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (response.ok) {
        emailRecord.status = 'DELIVERED';
      } else {
        emailRecord.status = 'FAILED';
      }
    } catch (apiErr) {
      emailRecord.status = 'FAILED';
      console.warn('Resend API call error:', apiErr);
    }
  }

  saveDispatchedEmail(emailRecord);
  console.info(`[EMAIL DISPATCHED] [${type}] To: ${to} | Subject: "${subject}" | Status: ${emailRecord.status}`);
};

/**
 * Common HTML Email Layout Wrapper
 */
const wrapHtmlEmail = (title: string, content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04); }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 30px 24px; text-align: center; color: #ffffff; }
    .brand-title { font-size: 24px; font-weight: 900; letter-spacing: -0.03em; margin: 0; }
    .brand-sub { font-size: 12px; color: #c7d2fe; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
    .content { padding: 32px 28px; }
    .greeting { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
    .lead { font-size: 14.5px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #4338ca; font-family: monospace; }
    .otp-expiry { font-size: 12px; color: #64748b; margin-top: 6px; }
    .card-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; }
    .card-title { font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .warning-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
    .warning-title { font-size: 13px; font-weight: 700; color: #b45309; margin-bottom: 4px; }
    .warning-text { font-size: 13px; color: #78350f; line-height: 1.5; margin: 0; }
    .btn-container { text-align: center; margin: 28px 0 16px; }
    .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
    .footer { background: #f8fafc; padding: 20px 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-title">JAYVEERMart</div>
      <div class="brand-sub">Enterprise E-Commerce Platform</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      Need help? Contact our Support Desk at <a href="mailto:support@jayveermart.com" style="color: #4f46e5; text-decoration: none;">support@jayveermart.com</a>.<br>
      © 2026 JAYVEERMart Enterprise. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

// ─── 1. Email Verification OTP ──────────────────────────────────────────────

export const sendEmailVerificationOtp = async (
  email: string,
  otp: string,
  name: string = 'Valued Customer'
): Promise<void> => {
  const subject = `Verify your email address for JAYVEERMart`;
  const text = `Hi ${name},\n\nYour 6-digit verification code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this code, please ignore this email.\n\nBest regards,\nJAYVEERMart Team`;

  const content = `
    <div class="greeting">Verify Your Email Address</div>
    <p class="lead">
      Hi ${name}, thank you for registering with <strong>JAYVEERMart</strong>. Please use the 6-digit one-time verification code below to confirm your email address.
    </p>

    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">Valid for 10 minutes • Single-use verification code</div>
    </div>

    <div class="warning-box">
      <div class="warning-title">🔒 Security Notice</div>
      <p class="warning-text">
        Never share this verification code with anyone. JAYVEERMart staff will never ask for your code over phone, email, or chat.
      </p>
    </div>
  `;

  await sendEmail(email, subject, wrapHtmlEmail(subject, content), text, 'email_verification_otp', { email, otp });
};

// ─── 2. Welcome Email ───────────────────────────────────────────────────────

export const sendWelcomeEmail = async (user: User): Promise<void> => {
  const name = user.first_name || 'Customer';
  const subject = `Welcome to JAYVEERMart — Your Account is Ready!`;
  const text = `Hi ${name},\n\nWelcome to JAYVEERMart! Your customer account has been created and verified successfully.\n\nYou can now browse trending products, manage orders, and enjoy exclusive discounts.\n\nVisit: ${window.location.origin}\n\nBest regards,\nJAYVEERMart Team`;

  const content = `
    <div class="greeting">Welcome to JAYVEERMart, ${name}! 🎉</div>
    <p class="lead">
      Your customer account has been verified and is ready for use. You can now explore our curated catalog, save products to your wishlist, and enjoy express checkout.
    </p>

    <div class="card-box">
      <div class="card-title">Your Account Summary</div>
      <div style="font-size: 13.5px; color: #334155; line-height: 1.8;">
        • <strong>Email:</strong> ${user.email}<br>
        • <strong>Account Status:</strong> Verified & Active<br>
        • <strong>Member ID:</strong> #${user.user_id}
      </div>
    </div>

    <div class="btn-container">
      <a href="${window.location.origin}/store" class="btn">Start Shopping Now →</a>
    </div>
  `;

  await sendEmail(user.email, subject, wrapHtmlEmail(subject, content), text, 'welcome_account', { userId: user.user_id });
};

// ─── 3. Customer & Admin Login Notifications ────────────────────────────────

export const sendCustomerLoginEmails = async (params: {
  user: User;
  loginEventId: string;
}): Promise<void> => {
  const { user, loginEventId } = params;

  if (isEventAlreadyProcessed(loginEventId)) return;
  markEventProcessed(loginEventId);
  if (user.role !== 'customer') return;

  const deviceMeta = getClientDeviceMeta();
  const loginTime = new Date();
  const adminRecipient = (import.meta.env.VITE_ADMIN_NOTIFICATION_EMAIL as string) || 'harshsathvara134@gmail.com';

  const formattedDate = loginTime.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = loginTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const customerName = `${user.first_name || 'Customer'} ${user.last_name || ''}`.trim();

  // A. Admin Security Alert
  const adminSubject = `New Customer Login — ${customerName}`;
  const adminText = `Security Alert: New Customer Login\nCustomer: ${customerName} (${user.email})\nUser ID: #${user.user_id}\nTime: ${formattedDate} at ${formattedTime}\nIP: ${deviceMeta.ip}\nDevice: ${deviceMeta.os} / ${deviceMeta.browser}`;
  const adminContent = `
    <div class="greeting" style="color: #0f172a;">Customer Authentication Event</div>
    <p class="lead">A verified customer has signed in to the platform.</p>
    <div class="card-box">
      <div class="card-title">Event Metadata</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
        <tr><td style="padding: 5px 0; color: #64748b;">Customer</td><td style="font-weight: 700; text-align: right;">${customerName}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">Email</td><td style="text-align: right;">${user.email}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">User ID</td><td style="text-align: right;">#${user.user_id}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">Time</td><td style="text-align: right;">${formattedDate} at ${formattedTime}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">IP Address</td><td style="text-align: right;">${deviceMeta.ip}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">Device / Browser</td><td style="text-align: right;">${deviceMeta.os} • ${deviceMeta.browser}</td></tr>
      </table>
    </div>
    <div class="btn-container">
      <a href="${window.location.origin}/admin" class="btn">View in Admin Panel →</a>
    </div>
  `;
  sendEmail(adminRecipient, adminSubject, wrapHtmlEmail(adminSubject, adminContent), adminText, 'admin_login_alert', { customerId: user.user_id, loginEventId }).catch(() => {});

  // B. Customer Login Confirmation
  const custSubject = `Successful Login to JAYVEERMart`;
  const custText = `Hi ${user.first_name || 'Customer'},\n\nYour JAYVEERMart account was successfully logged in on ${formattedDate} at ${formattedTime} from ${deviceMeta.browser} on ${deviceMeta.os}.\n\nIf this was not you, please secure your account immediately.\n\nBest regards,\nJAYVEERMart Team`;
  const custContent = `
    <div class="greeting">Welcome Back, ${user.first_name || 'Customer'}! 👋</div>
    <p class="lead">We're confirming that your <strong>JAYVEERMart</strong> account was successfully accessed.</p>
    <div class="card-box">
      <div class="card-title">Login Details</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
        <tr><td style="padding: 5px 0; color: #64748b;">Date & Time</td><td style="font-weight: 700; text-align: right;">${formattedDate}, ${formattedTime}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">Device / OS</td><td style="text-align: right;">${deviceMeta.os}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">Browser</td><td style="text-align: right;">${deviceMeta.browser}</td></tr>
        <tr><td style="padding: 5px 0; color: #64748b;">IP Address</td><td style="text-align: right;">${deviceMeta.ip}</td></tr>
      </table>
    </div>
    <div class="warning-box">
      <div class="warning-title">⚠️ Didn't recognize this sign-in?</div>
      <p class="warning-text">If you did not perform this login, please secure your account immediately by changing your password.</p>
    </div>
    <div class="btn-container">
      <a href="${window.location.origin}/account/security" class="btn">Manage Security Settings →</a>
    </div>
  `;
  sendEmail(user.email, custSubject, wrapHtmlEmail(custSubject, custContent), custText, 'customer_login_confirmation', { userId: user.user_id, loginEventId }).catch(() => {});

  logSecurityEvent('AUTH_LOGIN_SUCCESS', { userId: user.user_id, email: user.email, action: 'Customer dual login emails dispatched' });
};

// ─── 4. New Unrecognized Device Detected Alert ──────────────────────────────

export const sendNewDeviceAlertEmail = async (
  user: User,
  deviceMeta: { browser: string; os: string; ip: string }
): Promise<void> => {
  const name = user.first_name || 'Customer';
  const subject = `Security Alert: New Sign-In Detected on your JAYVEERMart Account`;
  const text = `Hi ${name},\n\nWe detected a sign-in to your account from a new or unrecognized device:\n\nDevice: ${deviceMeta.os}\nBrowser: ${deviceMeta.browser}\nIP: ${deviceMeta.ip}\n\nIf this was you, no action is needed. If you did not sign in from this device, please reset your password immediately.\n\nJAYVEERMart Security Team`;

  const content = `
    <div class="greeting" style="color: #991b1b;">⚠️ New Sign-In Detected</div>
    <p class="lead">
      Hi ${name}, we noticed a sign-in to your <strong>JAYVEERMart</strong> account from a browser or device that we haven't seen before.
    </p>

    <div class="card-box" style="border-left: 4px solid #ef4444;">
      <div class="card-title">New Device Information</div>
      <div style="font-size: 13.5px; color: #334155; line-height: 1.8;">
        • <strong>Device & OS:</strong> ${deviceMeta.os}<br>
        • <strong>Browser:</strong> ${deviceMeta.browser}<br>
        • <strong>IP Address:</strong> ${deviceMeta.ip}<br>
        • <strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN')}
      </div>
    </div>

    <div class="warning-box">
      <div class="warning-title">Was this you?</div>
      <p class="warning-text">
        If you recently signed in from a new browser or private window, you can safely disregard this alert. If you do not recognize this activity, please terminate all sessions and change your password immediately.
      </p>
    </div>

    <div class="btn-container">
      <a href="${window.location.origin}/account/security" class="btn" style="background: #dc2626;">Secure My Account Now →</a>
    </div>
  `;

  await sendEmail(user.email, subject, wrapHtmlEmail(subject, content), text, 'new_device_alert', { userId: user.user_id, deviceMeta });
  logSecurityEvent('NEW_DEVICE_DETECTED', { userId: user.user_id, email: user.email, action: 'New device alert dispatched to customer' });
};

// ─── 5. Password Changed Notification ───────────────────────────────────────

export const sendPasswordChangedEmail = async (user: User): Promise<void> => {
  const name = user.first_name || 'Customer';
  const subject = `Your JAYVEERMart Password Was Changed`;
  const text = `Hi ${name},\n\nThe password for your JAYVEERMart account (${user.email}) was successfully changed on ${new Date().toLocaleString()}.\n\nIf you did not make this change, please contact our support team immediately.\n\nJAYVEERMart Security Team`;

  const content = `
    <div class="greeting">Password Update Confirmation 🔒</div>
    <p class="lead">
      Hi ${name}, this email confirms that the password for your <strong>JAYVEERMart</strong> account (<strong>${user.email}</strong>) was successfully updated.
    </p>

    <div class="card-box">
      <div class="card-title">Change Details</div>
      <div style="font-size: 13.5px; color: #334155; line-height: 1.8;">
        • <strong>Status:</strong> Salted SHA-256 Hash Regenerated<br>
        • <strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN')}<br>
        • <strong>Action:</strong> Password Updated Successfully
      </div>
    </div>

    <div class="warning-box">
      <div class="warning-title">Didn't request this change?</div>
      <p class="warning-text">
        If you did not change your password, your account may be compromised. Please contact support immediately at <a href="mailto:support@jayveermart.com" style="color: #b45309; font-weight: 700;">support@jayveermart.com</a>.
      </p>
    </div>
  `;

  await sendEmail(user.email, subject, wrapHtmlEmail(subject, content), text, 'password_changed', { userId: user.user_id });
};

// ─── 6. Password Reset OTP Email ────────────────────────────────────────────

export const sendPasswordResetOtpEmail = async (
  email: string,
  otp: string,
  name: string = 'Valued Customer'
): Promise<void> => {
  const subject = `Reset your JAYVEERMart password`;
  const text = `Hi ${name},\n\nWe received a request to reset the password for your JAYVEERMart account.\n\nYour 6-digit password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request a password reset, please ignore this email.`;

  const content = `
    <div class="greeting">Reset Your Password 🔑</div>
    <p class="lead">
      Hi ${name}, we received a request to reset the password for your <strong>JAYVEERMart</strong> account. Enter the 6-digit code below to set a new password.
    </p>

    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-expiry">Valid for 10 minutes • Single-use verification code</div>
    </div>

    <div class="warning-box">
      <div class="warning-title">Didn't request a reset?</div>
      <p class="warning-text">
        If you did not request this password reset, no action is required. Your existing password remains secure.
      </p>
    </div>
  `;

  await sendEmail(email, subject, wrapHtmlEmail(subject, content), text, 'password_reset_otp', { email, otp });
};

// ─── 7. Two-Factor Authentication Status Changed ────────────────────────────

export const sendTwoFactorStatusEmail = async (user: User, enabled: boolean): Promise<void> => {
  const name = user.first_name || 'Customer';
  const subject = `Two-Factor Authentication ${enabled ? 'ENABLED' : 'DISABLED'} on JAYVEERMart`;
  const text = `Hi ${name},\n\nTwo-Factor Authentication has been ${enabled ? 'ENABLED' : 'DISABLED'} on your JAYVEERMart account.\n\nTime: ${new Date().toLocaleString()}\n\nJAYVEERMart Team`;

  const content = `
    <div class="greeting">2FA Security Status Changed</div>
    <p class="lead">
      Hi ${name}, Two-Factor Authentication (2FA) protection for your account has been <strong>${enabled ? 'ENABLED' : 'DISABLED'}</strong>.
    </p>

    <div class="card-box">
      <div class="card-title">Security State</div>
      <div style="font-size: 13.5px; color: #334155;">
        • <strong>Status:</strong> ${enabled ? '🛡️ 2FA TOTP Protection Active' : '⚠️ 2FA Disabled'}<br>
        • <strong>Updated At:</strong> ${new Date().toLocaleString('en-IN')}
      </div>
    </div>
  `;

  await sendEmail(user.email, subject, wrapHtmlEmail(subject, content), text, 'two_factor_status_changed', { userId: user.user_id, enabled });
};
