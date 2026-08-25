/**
 * JAYVEERMart Enterprise Security Audit Logger
 * Safely captures security and administrative audit trails without logging passwords, tokens, or raw payment details.
 */

import { SecurityAuditEvent, SecurityEventType } from '../types';
import { getClientDeviceMeta } from './security';

const STORAGE_KEY = 'jayveermart_security_audit_logs';

/**
 * Mask an email for safe audit logging (e.g. a***n@nexusmart.com)
 */
export const maskEmail = (email?: string): string => {
  if (!email || !email.includes('@')) return 'anonymous';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user[0]}${'*'.repeat(Math.max(1, user.length - 2))}${user[user.length - 1]}@${domain}`;
};

export const logSecurityEvent = (
  eventType: SecurityEventType,
  data: {
    userId?: number;
    email?: string;
    action?: string;
    resource?: string;
    resourceId?: string | number;
    status?: 'SUCCESS' | 'FAILURE' | 'WARNING';
    details?: Record<string, unknown>;
  }
): void => {
  try {
    const device = getClientDeviceMeta();
    const actionText = data.action || eventType.replace(/_/g, ' ').toLowerCase();

    const entry: SecurityAuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      eventType,
      userId: data.userId,
      email: data.email,
      action: actionText,
      resource: data.resource || 'SYSTEM',
      resourceId: data.resourceId,
      status: data.status || (eventType.includes('FAILURE') || eventType.includes('DENIED') ? 'FAILURE' : 'SUCCESS'),
      ip: device.ip,
      userAgent: `${device.browser} on ${device.os}`,
      details: data.details,
    };

    // Keep last 250 audit records in localStorage
    const existing = localStorage.getItem(STORAGE_KEY);
    const logs: SecurityAuditEvent[] = existing ? JSON.parse(existing) : [];
    logs.unshift(entry);
    if (logs.length > 250) logs.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

    console.info(`[SECURITY AUDIT] [${entry.eventType}] [${entry.status}]`, {
      timestamp: entry.timestamp,
      user: entry.email ? maskEmail(entry.email) : 'guest',
      action: entry.action,
      ip: entry.ip,
      details: entry.details,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
};

export const getSecurityLogs = (): SecurityAuditEvent[] => {
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

export const exportSecurityLogsAsJSON = (): void => {
  const logs = getSecurityLogs();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `jayveermart_security_audit_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
