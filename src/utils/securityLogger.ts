/**
 * NexusMart Centralized Security Audit Logger
 * Safely captures security events without logging passwords, tokens, or raw payment details.
 */

export type SecurityEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_RATE_LIMITED'
  | 'AUTH_REGISTER_SUCCESS'
  | 'AUTH_UNAUTHORIZED_ACCESS'
  | 'ORDER_PRICE_TAMPER_DETECTED'
  | 'ORDER_STOCK_DEFICIT'
  | 'ORDER_PLACED_SECURELY'
  | 'ADMIN_ACTION_EXECUTED'
  | 'ADMIN_ACCESS_DENIED'
  | 'PROFILE_UPDATE_SECURITY';

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  userId?: number | string;
  emailMasked?: string;
  details?: Record<string, any>;
  ipPlaceholder?: string;
}

const STORAGE_KEY = 'nexusmart_security_audit_logs';

/**
 * Mask an email for safe audit logging (e.g. j***e@example.com)
 */
export const maskEmail = (email?: string): string => {
  if (!email || !email.includes('@')) return 'anonymous';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
};

export const logSecurityEvent = (
  type: SecurityEventType,
  data: {
    userId?: number | string;
    email?: string;
    details?: Record<string, any>;
  }
): void => {
  try {
    const entry: SecurityLogEntry = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      userId: data.userId,
      emailMasked: data.email ? maskEmail(data.email) : undefined,
      details: data.details,
    };

    // Keep last 100 entries in localStorage for security auditing
    const existing = localStorage.getItem(STORAGE_KEY);
    const logs: SecurityLogEntry[] = existing ? JSON.parse(existing) : [];
    logs.unshift(entry);
    if (logs.length > 100) logs.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

    // Console notification in development with distinct security format
    console.info(`[SECURITY AUDIT] [${entry.type}]`, {
      timestamp: entry.timestamp,
      user: entry.userId || entry.emailMasked || 'guest',
      details: entry.details,
    });
  } catch (err) {
    // Fail silently so logging never breaks app execution
  }
};

export const getSecurityLogs = (): SecurityLogEntry[] => {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
};

export const clearSecurityLogs = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
};

