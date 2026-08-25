/**
 * NexusMart Application Security Utilities
 * - Cryptographic salted SHA-256 hashing via native Web Crypto API (crypto.subtle)
 * - XSS input sanitization
 * - Safe URL protocol verification
 * - Rate limiting and brute force protection
 */

// ─── 1. Cryptographic Password Hashing (Web Crypto API) ──────────────────────

/**
 * Generate a cryptographically secure random hexadecimal salt
 */
export const generateSalt = (length: number = 16): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash a password string with a salt using SHA-256
 */
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':' + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Verify a plaintext password against a stored hash and salt (constant-time comparison)
 */
export const verifyPassword = async (
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> => {
  if (!password || !storedHash || !salt) return false;
  const computedHash = await hashPassword(password, salt);
  
  // Constant time comparison to prevent timing attacks
  if (computedHash.length !== storedHash.length) return false;
  let result = 0;
  for (let i = 0; i < computedHash.length; i++) {
    result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
};

// ─── 2. Input Sanitization & XSS Defense ───────────────────────────────────

/**
 * Sanitize untrusted user text by escaping dangerous HTML characters
 */
export const sanitizeInput = (input: string | null | undefined): string => {
  if (!input) return '';
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Whitelist safe image and link URL protocols (prevents javascript:, data:text/html, etc.)
 */
export const sanitizeUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Whitelist relative paths (/product_images/...), absolute http/https URLs, or safe image data URIs
  const isSafeRelative = trimmed.startsWith('/') && !trimmed.startsWith('//');
  const isSafeHttp = /^https?:\/\//i.test(trimmed);
  const isSafeImageDataUri = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/i.test(trimmed);

  if (isSafeRelative || isSafeHttp || isSafeImageDataUri) {
    return trimmed;
  }

  // Fallback placeholder if malicious or unrecognized scheme detected
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
};

// ─── 3. Password Policy Validation ─────────────────────────────────────────

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePasswordPolicy = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ─── 4. Rate Limiter (Brute-Force Protection) ───────────────────────────────

interface RateLimitRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

class SecurityRateLimiter {
  private attempts: Map<string, RateLimitRecord> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly lockoutMs: number;

  constructor(maxAttempts = 5, windowMs = 60000, lockoutMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.lockoutMs = lockoutMs;
  }

  /**
   * Check if a key (e.g. email or action identifier) is currently locked out
   */
  public isLocked(key: string): { locked: boolean; remainingSeconds: number } {
    const record = this.attempts.get(key);
    if (!record || !record.lockedUntil) {
      return { locked: false, remainingSeconds: 0 };
    }

    const now = Date.now();
    if (now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { locked: true, remainingSeconds };
    }

    // Lock expired, clean up
    this.attempts.delete(key);
    return { locked: false, remainingSeconds: 0 };
  }

  /**
   * Record a failed attempt. If threshold exceeded, triggers lockout.
   */
  public recordFailure(key: string): { locked: boolean; remainingAttempts: number; lockoutSeconds: number } {
    const now = Date.now();
    let record = this.attempts.get(key);

    if (!record || now - record.firstAttempt > this.windowMs) {
      record = { count: 1, firstAttempt: now, lockedUntil: null };
    } else {
      record.count += 1;
    }

    if (record.count >= this.maxAttempts) {
      record.lockedUntil = now + this.lockoutMs;
      this.attempts.set(key, record);
      return { locked: true, remainingAttempts: 0, lockoutSeconds: Math.ceil(this.lockoutMs / 1000) };
    }

    this.attempts.set(key, record);
    return { locked: false, remainingAttempts: this.maxAttempts - record.count, lockoutSeconds: 0 };
  }

  /**
   * Reset attempts upon successful authentication
   */
  public reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const authRateLimiter = new SecurityRateLimiter(5, 60000, 60000); // 5 attempts per 60s -> 60s lockout
