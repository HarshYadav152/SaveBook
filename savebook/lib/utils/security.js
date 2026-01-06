/**
 * Advanced Security Utilities for SaveBook
 * Comprehensive security features including encryption, hashing,
 * rate limiting, CSRF protection, and security headers.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

import crypto from 'crypto';

// ============================================================
// ENCRYPTION UTILITIES
// ============================================================

/**
 * Encryption configuration
 */
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  authTagLength: 16,
  saltLength: 32,
  pbkdf2Iterations: 100000,
  encoding: 'base64'
};

/**
 * Encrypts data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {string} key - Encryption key (or will derive from password)
 * @returns {Object} Encrypted data with IV and auth tag
 */
export const encrypt = (plaintext, key) => {
  try {
    // Derive key if it's not 32 bytes
    const derivedKey = deriveKey(key);
    
    // Generate random IV
    const iv = crypto.randomBytes(ENCRYPTION_CONFIG.ivLength);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      ENCRYPTION_CONFIG.algorithm,
      derivedKey,
      iv,
      { authTagLength: ENCRYPTION_CONFIG.authTagLength }
    );
    
    // Encrypt
    let encrypted = cipher.update(plaintext, 'utf8', ENCRYPTION_CONFIG.encoding);
    encrypted += cipher.final(ENCRYPTION_CONFIG.encoding);
    
    // Get auth tag
    const authTag = cipher.getAuthTag();
    
    // Combine IV + authTag + encrypted data
    const combined = Buffer.concat([
      iv,
      authTag,
      Buffer.from(encrypted, ENCRYPTION_CONFIG.encoding)
    ]);
    
    return {
      success: true,
      data: combined.toString(ENCRYPTION_CONFIG.encoding),
      iv: iv.toString(ENCRYPTION_CONFIG.encoding),
      authTag: authTag.toString(ENCRYPTION_CONFIG.encoding)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Decrypts data encrypted with AES-256-GCM
 * @param {string} encryptedData - Combined encrypted data
 * @param {string} key - Encryption key
 * @returns {Object} Decrypted data or error
 */
export const decrypt = (encryptedData, key) => {
  try {
    // Derive key
    const derivedKey = deriveKey(key);
    
    // Decode combined data
    const combined = Buffer.from(encryptedData, ENCRYPTION_CONFIG.encoding);
    
    // Extract components
    const iv = combined.subarray(0, ENCRYPTION_CONFIG.ivLength);
    const authTag = combined.subarray(
      ENCRYPTION_CONFIG.ivLength,
      ENCRYPTION_CONFIG.ivLength + ENCRYPTION_CONFIG.authTagLength
    );
    const encrypted = combined.subarray(
      ENCRYPTION_CONFIG.ivLength + ENCRYPTION_CONFIG.authTagLength
    );
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_CONFIG.algorithm,
      derivedKey,
      iv,
      { authTagLength: ENCRYPTION_CONFIG.authTagLength }
    );
    
    decipher.setAuthTag(authTag);
    
    // Decrypt
    let decrypted = decipher.update(encrypted.toString(ENCRYPTION_CONFIG.encoding), ENCRYPTION_CONFIG.encoding, 'utf8');
    decrypted += decipher.final('utf8');
    
    return {
      success: true,
      data: decrypted
    };
  } catch (error) {
    return {
      success: false,
      error: 'Decryption failed. Invalid key or corrupted data.'
    };
  }
};

/**
 * Derives a 32-byte key from password using PBKDF2
 * @param {string} password - Password to derive key from
 * @param {Buffer} salt - Optional salt (generates if not provided)
 * @returns {Buffer} Derived key
 */
export const deriveKey = (password, salt = null) => {
  // If password is already 32 bytes (hex), use it directly
  if (typeof password === 'string' && password.length === 64 && /^[0-9a-f]+$/i.test(password)) {
    return Buffer.from(password, 'hex');
  }
  
  // Use fixed salt for deterministic key derivation
  // In production, you'd want to store and use unique salts
  const useSalt = salt || Buffer.from('savebook-encryption-salt-2026', 'utf8').subarray(0, 32);
  
  return crypto.pbkdf2Sync(
    password,
    useSalt,
    ENCRYPTION_CONFIG.pbkdf2Iterations,
    ENCRYPTION_CONFIG.keyLength,
    'sha256'
  );
};

/**
 * Generates a secure random encryption key
 * @returns {string} Hex-encoded key
 */
export const generateEncryptionKey = () => {
  return crypto.randomBytes(ENCRYPTION_CONFIG.keyLength).toString('hex');
};

// ============================================================
// HASHING UTILITIES
// ============================================================

/**
 * Creates SHA-256 hash of data
 * @param {string} data - Data to hash
 * @returns {string} Hex-encoded hash
 */
export const sha256Hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Creates SHA-512 hash of data
 * @param {string} data - Data to hash
 * @returns {string} Hex-encoded hash
 */
export const sha512Hash = (data) => {
  return crypto.createHash('sha512').update(data).digest('hex');
};

/**
 * Creates HMAC hash
 * @param {string} data - Data to hash
 * @param {string} secret - Secret key
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {string} Hex-encoded HMAC
 */
export const hmacHash = (data, secret, algorithm = 'sha256') => {
  return crypto.createHmac(algorithm, secret).update(data).digest('hex');
};

/**
 * Compares two hashes in constant time to prevent timing attacks
 * @param {string} hash1 - First hash
 * @param {string} hash2 - Second hash
 * @returns {boolean} Whether hashes match
 */
export const secureCompare = (hash1, hash2) => {
  if (typeof hash1 !== 'string' || typeof hash2 !== 'string') {
    return false;
  }
  
  const buf1 = Buffer.from(hash1, 'hex');
  const buf2 = Buffer.from(hash2, 'hex');
  
  if (buf1.length !== buf2.length) {
    return false;
  }
  
  return crypto.timingSafeEqual(buf1, buf2);
};

// ============================================================
// TOKEN GENERATION
// ============================================================

/**
 * Generates a secure random token
 * @param {number} length - Token length in bytes (default: 32)
 * @returns {string} Hex-encoded token
 */
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generates URL-safe base64 token
 * @param {number} length - Token length in bytes
 * @returns {string} URL-safe base64 token
 */
export const generateURLSafeToken = (length = 32) => {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Generates a verification code (numeric)
 * @param {number} digits - Number of digits
 * @returns {string} Numeric code
 */
export const generateVerificationCode = (digits = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  const range = max - min;
  
  // Generate cryptographically secure random number
  const randomBytes = crypto.randomBytes(4);
  const randomValue = randomBytes.readUInt32BE(0);
  const code = min + (randomValue % (range + 1));
  
  return code.toString().padStart(digits, '0');
};

/**
 * Generates a session ID
 * @returns {string} Session ID
 */
export const generateSessionId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(16).toString('hex');
  return `sess_${timestamp}_${randomPart}`;
};

// ============================================================
// CSRF PROTECTION
// ============================================================

/**
 * CSRF Token manager
 */
export class CSRFProtection {
  constructor(secret = null) {
    this.secret = secret || generateToken(32);
    this.tokenExpiry = 3600000; // 1 hour
  }
  
  /**
   * Generates a CSRF token
   * @param {string} sessionId - Session identifier
   * @returns {Object} Token and expiry
   */
  generateToken(sessionId) {
    const timestamp = Date.now();
    const tokenData = `${sessionId}:${timestamp}`;
    const signature = hmacHash(tokenData, this.secret);
    
    const token = Buffer.from(JSON.stringify({
      sessionId,
      timestamp,
      signature: signature.substring(0, 32)
    })).toString('base64');
    
    return {
      token,
      expiresAt: timestamp + this.tokenExpiry
    };
  }
  
  /**
   * Validates a CSRF token
   * @param {string} token - Token to validate
   * @param {string} sessionId - Expected session ID
   * @returns {Object} Validation result
   */
  validateToken(token, sessionId) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check session match
      if (decoded.sessionId !== sessionId) {
        return { valid: false, error: 'Session mismatch' };
      }
      
      // Check expiry
      if (Date.now() > decoded.timestamp + this.tokenExpiry) {
        return { valid: false, error: 'Token expired' };
      }
      
      // Verify signature
      const tokenData = `${decoded.sessionId}:${decoded.timestamp}`;
      const expectedSignature = hmacHash(tokenData, this.secret).substring(0, 32);
      
      if (!secureCompare(
        Buffer.from(decoded.signature, 'hex').toString('hex'),
        Buffer.from(expectedSignature, 'hex').toString('hex')
      )) {
        return { valid: false, error: 'Invalid signature' };
      }
      
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid token format' };
    }
  }
}

// ============================================================
// RATE LIMITING
// ============================================================

/**
 * In-memory rate limiter
 * For production, use Redis-based implementation
 */
export class RateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000; // 1 minute
    this.maxRequests = options.maxRequests || 100;
    this.keyPrefix = options.keyPrefix || 'rl:';
    this.store = new Map();
    
    // Clean up expired entries periodically
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.windowMs);
  }
  
  /**
   * Checks if request should be rate limited
   * @param {string} key - Rate limit key (e.g., IP address)
   * @returns {Object} Rate limit result
   */
  check(key) {
    const now = Date.now();
    const fullKey = `${this.keyPrefix}${key}`;
    
    let record = this.store.get(fullKey);
    
    if (!record || now > record.resetAt) {
      // Create new window
      record = {
        count: 1,
        resetAt: now + this.windowMs
      };
      this.store.set(fullKey, record);
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetAt: record.resetAt,
        retryAfter: 0
      };
    }
    
    if (record.count >= this.maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetAt: record.resetAt,
        retryAfter
      };
    }
    
    record.count++;
    
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetAt: record.resetAt,
      retryAfter: 0
    };
  }
  
  /**
   * Resets rate limit for a key
   * @param {string} key - Key to reset
   */
  reset(key) {
    const fullKey = `${this.keyPrefix}${key}`;
    this.store.delete(fullKey);
  }
  
  /**
   * Cleans up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetAt) {
        this.store.delete(key);
      }
    }
  }
  
  /**
   * Destroys the rate limiter
   */
  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

/**
 * Creates rate limiter presets
 */
export const rateLimiterPresets = {
  // Standard API rate limit
  api: () => new RateLimiter({
    windowMs: 60000,
    maxRequests: 100
  }),
  
  // Strict limit for auth endpoints
  auth: () => new RateLimiter({
    windowMs: 900000, // 15 minutes
    maxRequests: 5
  }),
  
  // Very strict for password reset
  passwordReset: () => new RateLimiter({
    windowMs: 3600000, // 1 hour
    maxRequests: 3
  }),
  
  // Relaxed for reads
  read: () => new RateLimiter({
    windowMs: 60000,
    maxRequests: 300
  }),
  
  // Strict for writes
  write: () => new RateLimiter({
    windowMs: 60000,
    maxRequests: 30
  })
};

// ============================================================
// SECURITY HEADERS
// ============================================================

/**
 * Security headers configuration
 */
export const securityHeaders = {
  /**
   * Content Security Policy
   */
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
    'font-src': ["'self'", 'fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'connect-src': ["'self'", 'https://api.savebook.app'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },
  
  /**
   * Other security headers
   */
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
};

/**
 * Builds CSP header string
 * @param {Object} policy - CSP policy object
 * @returns {string} CSP header value
 */
export const buildCSPHeader = (policy = securityHeaders.csp) => {
  return Object.entries(policy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

/**
 * Gets all security headers
 * @returns {Object} Headers object
 */
export const getSecurityHeaders = () => {
  return {
    ...securityHeaders.headers,
    'Content-Security-Policy': buildCSPHeader()
  };
};

// ============================================================
// INPUT SANITIZATION FOR SECURITY
// ============================================================

/**
 * Prevents SQL injection by escaping special characters
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const preventSQLInjection = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/xp_/gi, '')
    .replace(/UNION/gi, '')
    .replace(/SELECT/gi, '')
    .replace(/INSERT/gi, '')
    .replace(/UPDATE/gi, '')
    .replace(/DELETE/gi, '')
    .replace(/DROP/gi, '')
    .replace(/TRUNCATE/gi, '');
};

/**
 * Prevents NoSQL injection
 * @param {any} input - Input to sanitize
 * @returns {any} Sanitized input
 */
export const preventNoSQLInjection = (input) => {
  if (typeof input === 'string') {
    // Remove MongoDB operators
    return input.replace(/\$[a-zA-Z]+/g, '');
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      // Skip keys starting with $
      if (key.startsWith('$')) continue;
      sanitized[key] = preventNoSQLInjection(value);
    }
    return sanitized;
  }
  
  return input;
};

/**
 * Prevents path traversal attacks
 * @param {string} path - Path to sanitize
 * @returns {string} Sanitized path
 */
export const preventPathTraversal = (path) => {
  if (typeof path !== 'string') return '';
  
  return path
    .replace(/\.\./g, '')
    .replace(/\/\//g, '/')
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .split('/')
    .filter(part => part && part !== '.' && part !== '..')
    .join('/');
};

// ============================================================
// PASSWORD UTILITIES
// ============================================================

/**
 * Generates a secure random password
 * @param {number} length - Password length
 * @param {Object} options - Generation options
 * @returns {string} Generated password
 */
export const generatePassword = (length = 16, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeAmbiguous = true
  } = options;
  
  let chars = '';
  
  if (includeLowercase) {
    chars += excludeAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  }
  if (includeUppercase) {
    chars += excludeAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (includeNumbers) {
    chars += excludeAmbiguous ? '23456789' : '0123456789';
  }
  if (includeSymbols) {
    chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  
  if (!chars) {
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  }
  
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  
  return password;
};

/**
 * Checks if password has been breached using k-anonymity
 * This is a placeholder - actual implementation would check against HIBP API
 * @param {string} password - Password to check
 * @returns {Promise<Object>} Check result
 */
export const checkPasswordBreach = async (password) => {
  // Hash the password with SHA-1 (required by HIBP API)
  const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1Hash.substring(0, 5);
  const suffix = sha1Hash.substring(5);
  
  // In production, you would:
  // 1. Call HIBP API with prefix: https://api.pwnedpasswords.com/range/{prefix}
  // 2. Check if suffix exists in response
  // 3. Return breach count if found
  
  return {
    checked: true,
    breached: false,
    count: 0,
    message: 'Password breach check placeholder - implement HIBP API call'
  };
};

// ============================================================
// API KEY MANAGEMENT
// ============================================================

/**
 * API Key manager
 */
export class APIKeyManager {
  constructor() {
    this.prefix = 'sb_';
  }
  
  /**
   * Generates a new API key
   * @param {string} type - Key type (live/test)
   * @returns {Object} Generated key info
   */
  generate(type = 'live') {
    const typePrefix = type === 'test' ? 'test_' : 'live_';
    const key = `${this.prefix}${typePrefix}${generateToken(24)}`;
    const hash = sha256Hash(key);
    
    return {
      key, // Only show once, then store hash
      hash,
      prefix: key.substring(0, 12) + '...',
      type,
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Validates an API key
   * @param {string} key - Key to validate
   * @param {string} storedHash - Stored hash to compare
   * @returns {boolean} Whether key is valid
   */
  validate(key, storedHash) {
    if (!key || !storedHash) return false;
    
    const keyHash = sha256Hash(key);
    return secureCompare(
      Buffer.from(keyHash, 'hex').toString('hex'),
      Buffer.from(storedHash, 'hex').toString('hex')
    );
  }
  
  /**
   * Parses API key to extract type
   * @param {string} key - API key
   * @returns {Object} Key info
   */
  parse(key) {
    if (!key || !key.startsWith(this.prefix)) {
      return { valid: false, error: 'Invalid key format' };
    }
    
    const withoutPrefix = key.substring(this.prefix.length);
    const isTest = withoutPrefix.startsWith('test_');
    const isLive = withoutPrefix.startsWith('live_');
    
    if (!isTest && !isLive) {
      return { valid: false, error: 'Invalid key type' };
    }
    
    return {
      valid: true,
      type: isTest ? 'test' : 'live',
      prefix: key.substring(0, 12) + '...'
    };
  }
}

// ============================================================
// AUDIT LOGGING
// ============================================================

/**
 * Security audit logger
 */
export class SecurityAuditLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 10000;
  }
  
  /**
   * Logs a security event
   * @param {Object} event - Event details
   */
  log(event) {
    const entry = {
      id: generateToken(8),
      timestamp: new Date().toISOString(),
      ...event
    };
    
    this.logs.push(entry);
    
    // Trim old logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // In production, also send to logging service
    console.log('[SECURITY AUDIT]', JSON.stringify(entry));
    
    return entry;
  }
  
  /**
   * Logs authentication event
   */
  logAuth(userId, action, success, details = {}) {
    return this.log({
      type: 'auth',
      userId,
      action,
      success,
      ...details
    });
  }
  
  /**
   * Logs data access event
   */
  logAccess(userId, resource, action, details = {}) {
    return this.log({
      type: 'access',
      userId,
      resource,
      action,
      ...details
    });
  }
  
  /**
   * Logs security violation
   */
  logViolation(type, details = {}) {
    return this.log({
      type: 'violation',
      violationType: type,
      severity: details.severity || 'medium',
      ...details
    });
  }
  
  /**
   * Gets recent logs
   * @param {number} count - Number of logs to return
   * @param {Object} filter - Filter criteria
   */
  getRecent(count = 100, filter = {}) {
    let filtered = this.logs;
    
    if (filter.type) {
      filtered = filtered.filter(log => log.type === filter.type);
    }
    
    if (filter.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId);
    }
    
    if (filter.since) {
      const since = new Date(filter.since);
      filtered = filtered.filter(log => new Date(log.timestamp) >= since);
    }
    
    return filtered.slice(-count).reverse();
  }
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Encryption
  encrypt,
  decrypt,
  deriveKey,
  generateEncryptionKey,
  
  // Hashing
  sha256Hash,
  sha512Hash,
  hmacHash,
  secureCompare,
  
  // Token generation
  generateToken,
  generateURLSafeToken,
  generateVerificationCode,
  generateSessionId,
  
  // CSRF
  CSRFProtection,
  
  // Rate limiting
  RateLimiter,
  rateLimiterPresets,
  
  // Security headers
  securityHeaders,
  buildCSPHeader,
  getSecurityHeaders,
  
  // Input sanitization
  preventSQLInjection,
  preventNoSQLInjection,
  preventPathTraversal,
  
  // Password utilities
  generatePassword,
  checkPasswordBreach,
  
  // API Key management
  APIKeyManager,
  
  // Audit logging
  SecurityAuditLogger
};
