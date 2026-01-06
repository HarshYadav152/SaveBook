/**
 * Advanced Validation Utilities for SaveBook
 * Comprehensive input validation, sanitization, and schema validation
 * for notes, users, and application data.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// VALIDATION RESULT TYPES
// ============================================================

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 * @property {Object} sanitized - Sanitized data object
 * @property {Object} metadata - Validation metadata
 */

/**
 * @typedef {Object} FieldValidation
 * @property {boolean} valid - Field validation status
 * @property {string} message - Validation message
 * @property {any} value - Validated/sanitized value
 */

// ============================================================
// STRING VALIDATORS
// ============================================================

/**
 * Validates string length within specified bounds
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {FieldValidation}
 */
export const validateStringLength = (value, minLength = 0, maxLength = Infinity) => {
  if (typeof value !== 'string') {
    return { valid: false, message: 'Value must be a string', value: null };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length < minLength) {
    return { 
      valid: false, 
      message: `Must be at least ${minLength} characters`, 
      value: trimmed 
    };
  }
  
  if (trimmed.length > maxLength) {
    return { 
      valid: false, 
      message: `Must not exceed ${maxLength} characters`, 
      value: trimmed.substring(0, maxLength) 
    };
  }
  
  return { valid: true, message: 'Valid', value: trimmed };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {FieldValidation}
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required', value: null };
  }
  
  const trimmed = email.trim().toLowerCase();
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmed)) {
    return { valid: false, message: 'Invalid email format', value: trimmed };
  }
  
  // Additional checks
  if (trimmed.length > 254) {
    return { valid: false, message: 'Email too long', value: trimmed };
  }
  
  const [localPart, domain] = trimmed.split('@');
  if (localPart.length > 64) {
    return { valid: false, message: 'Email local part too long', value: trimmed };
  }
  
  return { valid: true, message: 'Valid email', value: trimmed };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {FieldValidation & { strength: string, score: number }}
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    disallowCommon = true
  } = options;
  
  if (!password || typeof password !== 'string') {
    return { 
      valid: false, 
      message: 'Password is required', 
      value: null, 
      strength: 'none', 
      score: 0 
    };
  }
  
  const errors = [];
  let score = 0;
  
  // Length check
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  } else {
    score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
  }
  
  if (password.length > maxLength) {
    errors.push(`Password must not exceed ${maxLength} characters`);
  }
  
  // Character type checks
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }
  
  if (requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/[0-9]/.test(password)) {
    score += 1;
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~;]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/'`~;]/.test(password)) {
    score += 1;
  }
  
  // Common password check
  if (disallowCommon) {
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'letmein', 'welcome', 'admin', 'login', 'passw0rd',
      '12345678', 'password1', 'iloveyou', 'sunshine', 'princess'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
      score = Math.max(0, score - 2);
    }
  }
  
  // Determine strength
  let strength;
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'fair';
  else if (score <= 6) strength = 'good';
  else strength = 'strong';
  
  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? errors[0] : 'Password is strong',
    value: password,
    strength,
    score,
    errors
  };
};

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {FieldValidation}
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: 'Username is required', value: null };
  }
  
  const trimmed = username.trim().toLowerCase();
  
  // Length check
  if (trimmed.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters', value: trimmed };
  }
  
  if (trimmed.length > 30) {
    return { valid: false, message: 'Username must not exceed 30 characters', value: trimmed };
  }
  
  // Format check - alphanumeric, underscores, hyphens
  if (!/^[a-z0-9_-]+$/.test(trimmed)) {
    return { 
      valid: false, 
      message: 'Username can only contain letters, numbers, underscores, and hyphens', 
      value: trimmed 
    };
  }
  
  // Must start with letter or number
  if (!/^[a-z0-9]/.test(trimmed)) {
    return { 
      valid: false, 
      message: 'Username must start with a letter or number', 
      value: trimmed 
    };
  }
  
  // Reserved usernames
  const reserved = [
    'admin', 'administrator', 'root', 'system', 'support',
    'help', 'info', 'contact', 'api', 'www', 'mail', 'email',
    'savebook', 'official', 'moderator', 'mod', 'null', 'undefined'
  ];
  
  if (reserved.includes(trimmed)) {
    return { valid: false, message: 'This username is reserved', value: trimmed };
  }
  
  return { valid: true, message: 'Valid username', value: trimmed };
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @param {Object} options - Validation options
 * @returns {FieldValidation}
 */
export const validateURL = (url, options = {}) => {
  const {
    requireProtocol = true,
    allowedProtocols = ['http:', 'https:'],
    allowLocalhost = false
  } = options;
  
  if (!url || typeof url !== 'string') {
    return { valid: false, message: 'URL is required', value: null };
  }
  
  const trimmed = url.trim();
  
  try {
    const parsed = new URL(trimmed);
    
    if (requireProtocol && !allowedProtocols.includes(parsed.protocol)) {
      return { 
        valid: false, 
        message: `URL must use ${allowedProtocols.join(' or ')}`, 
        value: trimmed 
      };
    }
    
    if (!allowLocalhost && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return { valid: false, message: 'Localhost URLs are not allowed', value: trimmed };
    }
    
    return { valid: true, message: 'Valid URL', value: trimmed };
  } catch (e) {
    return { valid: false, message: 'Invalid URL format', value: trimmed };
  }
};

// ============================================================
// NOTE VALIDATORS
// ============================================================

/**
 * Validates note title
 * @param {string} title - Note title
 * @returns {FieldValidation}
 */
export const validateNoteTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, message: 'Note title is required', value: '' };
  }
  
  const sanitized = sanitizeText(title.trim());
  
  if (sanitized.length < 1) {
    return { valid: false, message: 'Note title cannot be empty', value: sanitized };
  }
  
  if (sanitized.length > 200) {
    return { 
      valid: false, 
      message: 'Note title must not exceed 200 characters', 
      value: sanitized.substring(0, 200) 
    };
  }
  
  return { valid: true, message: 'Valid title', value: sanitized };
};

/**
 * Validates note content
 * @param {string} content - Note content
 * @param {Object} options - Validation options
 * @returns {FieldValidation}
 */
export const validateNoteContent = (content, options = {}) => {
  const {
    maxLength = 100000, // 100KB default
    allowHTML = false,
    allowMarkdown = true
  } = options;
  
  if (content === undefined || content === null) {
    return { valid: true, message: 'Content is optional', value: '' };
  }
  
  if (typeof content !== 'string') {
    return { valid: false, message: 'Content must be a string', value: '' };
  }
  
  let sanitized = content;
  
  if (!allowHTML) {
    sanitized = sanitizeHTML(sanitized);
  }
  
  if (sanitized.length > maxLength) {
    return { 
      valid: false, 
      message: `Content must not exceed ${maxLength} characters`, 
      value: sanitized.substring(0, maxLength) 
    };
  }
  
  return { valid: true, message: 'Valid content', value: sanitized };
};

/**
 * Validates note tags
 * @param {string[]} tags - Array of tags
 * @returns {FieldValidation}
 */
export const validateNoteTags = (tags) => {
  if (!tags) {
    return { valid: true, message: 'Tags are optional', value: [] };
  }
  
  if (!Array.isArray(tags)) {
    return { valid: false, message: 'Tags must be an array', value: [] };
  }
  
  if (tags.length > 20) {
    return { valid: false, message: 'Maximum 20 tags allowed', value: tags.slice(0, 20) };
  }
  
  const sanitizedTags = [];
  const errors = [];
  
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    
    if (typeof tag !== 'string') {
      errors.push(`Tag at index ${i} must be a string`);
      continue;
    }
    
    const sanitized = tag.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    
    if (sanitized.length < 1) {
      continue; // Skip empty tags
    }
    
    if (sanitized.length > 30) {
      errors.push(`Tag "${tag}" exceeds 30 characters`);
      continue;
    }
    
    // Avoid duplicates
    if (!sanitizedTags.includes(sanitized)) {
      sanitizedTags.push(sanitized);
    }
  }
  
  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? errors[0] : 'Valid tags',
    value: sanitizedTags,
    errors
  };
};

/**
 * Validates note color/theme
 * @param {string} color - Color value
 * @returns {FieldValidation}
 */
export const validateNoteColor = (color) => {
  const validColors = [
    'default', 'red', 'orange', 'yellow', 'green', 'teal',
    'blue', 'purple', 'pink', 'brown', 'gray', 'white'
  ];
  
  if (!color) {
    return { valid: true, message: 'Using default color', value: 'default' };
  }
  
  const normalized = color.trim().toLowerCase();
  
  // Check predefined colors
  if (validColors.includes(normalized)) {
    return { valid: true, message: 'Valid color', value: normalized };
  }
  
  // Check hex color format
  if (/^#[0-9a-f]{6}$/i.test(normalized) || /^#[0-9a-f]{3}$/i.test(normalized)) {
    return { valid: true, message: 'Valid hex color', value: normalized };
  }
  
  return { valid: false, message: 'Invalid color value', value: 'default' };
};

/**
 * Complete note validation
 * @param {Object} note - Note object to validate
 * @returns {ValidationResult}
 */
export const validateNote = (note) => {
  const errors = [];
  const sanitized = {};
  
  // Title validation
  const titleResult = validateNoteTitle(note.title);
  if (!titleResult.valid) {
    errors.push(titleResult.message);
  }
  sanitized.title = titleResult.value;
  
  // Content validation
  const contentResult = validateNoteContent(note.content);
  if (!contentResult.valid) {
    errors.push(contentResult.message);
  }
  sanitized.content = contentResult.value;
  
  // Tags validation
  const tagsResult = validateNoteTags(note.tags);
  if (!tagsResult.valid) {
    errors.push(tagsResult.message);
  }
  sanitized.tags = tagsResult.value;
  
  // Color validation
  const colorResult = validateNoteColor(note.color);
  sanitized.color = colorResult.value;
  
  // Optional fields
  if (note.isPinned !== undefined) {
    sanitized.isPinned = Boolean(note.isPinned);
  }
  
  if (note.isArchived !== undefined) {
    sanitized.isArchived = Boolean(note.isArchived);
  }
  
  if (note.isLocked !== undefined) {
    sanitized.isLocked = Boolean(note.isLocked);
  }
  
  if (note.folderId) {
    sanitized.folderId = validateMongoId(note.folderId).valid ? note.folderId : null;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    metadata: {
      titleLength: sanitized.title?.length || 0,
      contentLength: sanitized.content?.length || 0,
      tagCount: sanitized.tags?.length || 0
    }
  };
};

// ============================================================
// USER VALIDATORS
// ============================================================

/**
 * Complete user registration validation
 * @param {Object} userData - User registration data
 * @returns {ValidationResult}
 */
export const validateUserRegistration = (userData) => {
  const errors = [];
  const sanitized = {};
  
  // Username validation
  const usernameResult = validateUsername(userData.username);
  if (!usernameResult.valid) {
    errors.push(usernameResult.message);
  }
  sanitized.username = usernameResult.value;
  
  // Email validation
  const emailResult = validateEmail(userData.email);
  if (!emailResult.valid) {
    errors.push(emailResult.message);
  }
  sanitized.email = emailResult.value;
  
  // Password validation
  const passwordResult = validatePassword(userData.password);
  if (!passwordResult.valid) {
    errors.push(passwordResult.message);
  }
  
  // Password confirmation
  if (userData.confirmPassword !== userData.password) {
    errors.push('Passwords do not match');
  }
  
  // Name validation (optional)
  if (userData.name) {
    const nameResult = validateStringLength(userData.name, 2, 100);
    if (!nameResult.valid) {
      errors.push(`Name: ${nameResult.message}`);
    }
    sanitized.name = sanitizeText(nameResult.value);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    metadata: {
      passwordStrength: passwordResult.strength,
      passwordScore: passwordResult.score
    }
  };
};

/**
 * User profile update validation
 * @param {Object} profileData - Profile update data
 * @returns {ValidationResult}
 */
export const validateProfileUpdate = (profileData) => {
  const errors = [];
  const sanitized = {};
  
  // Name
  if (profileData.name !== undefined) {
    if (profileData.name === null || profileData.name === '') {
      sanitized.name = '';
    } else {
      const nameResult = validateStringLength(profileData.name, 2, 100);
      if (!nameResult.valid) {
        errors.push(`Name: ${nameResult.message}`);
      }
      sanitized.name = sanitizeText(nameResult.value);
    }
  }
  
  // Bio
  if (profileData.bio !== undefined) {
    const bioResult = validateStringLength(profileData.bio || '', 0, 500);
    if (!bioResult.valid) {
      errors.push(`Bio: ${bioResult.message}`);
    }
    sanitized.bio = sanitizeText(bioResult.value);
  }
  
  // Website
  if (profileData.website) {
    const urlResult = validateURL(profileData.website, { requireProtocol: true });
    if (!urlResult.valid) {
      errors.push(`Website: ${urlResult.message}`);
    }
    sanitized.website = urlResult.value;
  }
  
  // Avatar URL
  if (profileData.avatarUrl) {
    const avatarResult = validateURL(profileData.avatarUrl, { requireProtocol: true });
    if (!avatarResult.valid) {
      errors.push(`Avatar URL: ${avatarResult.message}`);
    }
    sanitized.avatarUrl = avatarResult.value;
  }
  
  // Theme preference
  if (profileData.theme) {
    const validThemes = ['light', 'dark', 'system'];
    if (!validThemes.includes(profileData.theme)) {
      errors.push('Invalid theme preference');
    } else {
      sanitized.theme = profileData.theme;
    }
  }
  
  // Language preference
  if (profileData.language) {
    const validLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'hi', 'ar', 'pt'];
    if (!validLanguages.includes(profileData.language)) {
      errors.push('Invalid language preference');
    } else {
      sanitized.language = profileData.language;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    metadata: {
      fieldsUpdated: Object.keys(sanitized).length
    }
  };
};

// ============================================================
// FOLDER VALIDATORS
// ============================================================

/**
 * Validates folder name
 * @param {string} name - Folder name
 * @returns {FieldValidation}
 */
export const validateFolderName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: 'Folder name is required', value: '' };
  }
  
  const sanitized = sanitizeText(name.trim());
  
  if (sanitized.length < 1) {
    return { valid: false, message: 'Folder name cannot be empty', value: sanitized };
  }
  
  if (sanitized.length > 50) {
    return { 
      valid: false, 
      message: 'Folder name must not exceed 50 characters', 
      value: sanitized.substring(0, 50) 
    };
  }
  
  // Check for invalid characters
  if (/[<>:"/\\|?*]/.test(sanitized)) {
    return { 
      valid: false, 
      message: 'Folder name contains invalid characters', 
      value: sanitized.replace(/[<>:"/\\|?*]/g, '') 
    };
  }
  
  return { valid: true, message: 'Valid folder name', value: sanitized };
};

/**
 * Complete folder validation
 * @param {Object} folder - Folder object to validate
 * @returns {ValidationResult}
 */
export const validateFolder = (folder) => {
  const errors = [];
  const sanitized = {};
  
  // Name validation
  const nameResult = validateFolderName(folder.name);
  if (!nameResult.valid) {
    errors.push(nameResult.message);
  }
  sanitized.name = nameResult.value;
  
  // Color validation
  const colorResult = validateNoteColor(folder.color);
  sanitized.color = colorResult.value;
  
  // Parent folder ID (optional)
  if (folder.parentId) {
    const parentResult = validateMongoId(folder.parentId);
    if (!parentResult.valid) {
      errors.push('Invalid parent folder ID');
    }
    sanitized.parentId = folder.parentId;
  }
  
  // Icon (optional)
  if (folder.icon) {
    const iconResult = validateStringLength(folder.icon, 1, 50);
    if (!iconResult.valid) {
      errors.push(`Icon: ${iconResult.message}`);
    }
    sanitized.icon = iconResult.value;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    metadata: {}
  };
};

// ============================================================
// ID VALIDATORS
// ============================================================

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {FieldValidation}
 */
export const validateMongoId = (id) => {
  if (!id || typeof id !== 'string') {
    return { valid: false, message: 'ID is required', value: null };
  }
  
  const trimmed = id.trim();
  
  // MongoDB ObjectId is 24 hex characters
  if (!/^[0-9a-f]{24}$/i.test(trimmed)) {
    return { valid: false, message: 'Invalid ID format', value: trimmed };
  }
  
  return { valid: true, message: 'Valid ID', value: trimmed };
};

/**
 * Validates UUID format
 * @param {string} uuid - UUID to validate
 * @returns {FieldValidation}
 */
export const validateUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') {
    return { valid: false, message: 'UUID is required', value: null };
  }
  
  const trimmed = uuid.trim().toLowerCase();
  
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(trimmed)) {
    return { valid: false, message: 'Invalid UUID format', value: trimmed };
  }
  
  return { valid: true, message: 'Valid UUID', value: trimmed };
};

// ============================================================
// SANITIZATION FUNCTIONS
// ============================================================

/**
 * Sanitizes text by removing dangerous characters
 * @param {string} text - Text to sanitize
 * @returns {string}
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .trim();
};

/**
 * Sanitizes HTML to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string}
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Basic HTML entity encoding
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return html.replace(/[&<>"'`=\/]/g, (s) => entityMap[s]);
};

/**
 * Decodes HTML entities
 * @param {string} html - HTML string to decode
 * @returns {string}
 */
export const decodeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  const entityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  return html.replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g, (s) => entityMap[s] || s);
};

/**
 * Sanitizes filename
 * @param {string} filename - Filename to sanitize
 * @returns {string}
 */
export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return 'untitled';
  
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/\.+/g, '.') // Replace multiple dots
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, 255) // Limit length
    || 'untitled';
};

/**
 * Sanitizes search query
 * @param {string} query - Search query to sanitize
 * @returns {string}
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  
  return query
    .replace(/[<>{}()\[\]\\^$.|?*+]/g, '') // Remove regex special chars
    .trim()
    .substring(0, 200); // Limit length
};

// ============================================================
// PAGINATION VALIDATORS
// ============================================================

/**
 * Validates pagination parameters
 * @param {Object} params - Pagination parameters
 * @param {Object} options - Validation options
 * @returns {ValidationResult}
 */
export const validatePagination = (params, options = {}) => {
  const {
    maxLimit = 100,
    defaultLimit = 20,
    defaultPage = 1
  } = options;
  
  const errors = [];
  const sanitized = {};
  
  // Page number
  let page = parseInt(params.page, 10);
  if (isNaN(page) || page < 1) {
    page = defaultPage;
  }
  sanitized.page = page;
  
  // Limit
  let limit = parseInt(params.limit, 10);
  if (isNaN(limit) || limit < 1) {
    limit = defaultLimit;
  } else if (limit > maxLimit) {
    limit = maxLimit;
  }
  sanitized.limit = limit;
  
  // Sort field
  if (params.sortBy) {
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'name'];
    if (allowedSortFields.includes(params.sortBy)) {
      sanitized.sortBy = params.sortBy;
    } else {
      sanitized.sortBy = 'createdAt';
    }
  } else {
    sanitized.sortBy = 'createdAt';
  }
  
  // Sort order
  if (params.sortOrder) {
    sanitized.sortOrder = params.sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
  } else {
    sanitized.sortOrder = 'desc';
  }
  
  // Calculate skip
  sanitized.skip = (sanitized.page - 1) * sanitized.limit;
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    metadata: {
      maxLimit,
      defaultLimit
    }
  };
};

// ============================================================
// DATE VALIDATORS
// ============================================================

/**
 * Validates date string
 * @param {string} dateString - Date string to validate
 * @returns {FieldValidation}
 */
export const validateDate = (dateString) => {
  if (!dateString) {
    return { valid: false, message: 'Date is required', value: null };
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Invalid date format', value: null };
  }
  
  return { valid: true, message: 'Valid date', value: date };
};

/**
 * Validates date range
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {ValidationResult}
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = [];
  const sanitized = {};
  
  const startResult = validateDate(startDate);
  if (!startResult.valid) {
    errors.push(`Start date: ${startResult.message}`);
  }
  sanitized.startDate = startResult.value;
  
  const endResult = validateDate(endDate);
  if (!endResult.valid) {
    errors.push(`End date: ${endResult.message}`);
  }
  sanitized.endDate = endResult.value;
  
  // Check range validity
  if (sanitized.startDate && sanitized.endDate) {
    if (sanitized.startDate > sanitized.endDate) {
      errors.push('Start date must be before end date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
    metadata: {}
  };
};

// ============================================================
// SCHEMA VALIDATION
// ============================================================

/**
 * Creates a schema validator
 * @param {Object} schema - Validation schema
 * @returns {Function} Validation function
 */
export const createSchemaValidator = (schema) => {
  return (data) => {
    const errors = [];
    const sanitized = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip optional empty fields
      if (!rules.required && (value === undefined || value === null)) {
        continue;
      }
      
      // Type check
      if (rules.type) {
        const valueType = Array.isArray(value) ? 'array' : typeof value;
        if (valueType !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
          continue;
        }
      }
      
      // Min length
      if (rules.minLength !== undefined && typeof value === 'string') {
        if (value.length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters`);
        }
      }
      
      // Max length
      if (rules.maxLength !== undefined && typeof value === 'string') {
        if (value.length > rules.maxLength) {
          errors.push(`${field} must not exceed ${rules.maxLength} characters`);
        }
      }
      
      // Min value
      if (rules.min !== undefined && typeof value === 'number') {
        if (value < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        }
      }
      
      // Max value
      if (rules.max !== undefined && typeof value === 'number') {
        if (value > rules.max) {
          errors.push(`${field} must not exceed ${rules.max}`);
        }
      }
      
      // Pattern
      if (rules.pattern && typeof value === 'string') {
        if (!rules.pattern.test(value)) {
          errors.push(`${field} has invalid format`);
        }
      }
      
      // Enum
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      }
      
      // Custom validator
      if (rules.validator && typeof rules.validator === 'function') {
        const customResult = rules.validator(value);
        if (!customResult.valid) {
          errors.push(customResult.message || `${field} is invalid`);
        }
      }
      
      // Apply sanitizer if provided
      if (rules.sanitize && typeof rules.sanitize === 'function') {
        sanitized[field] = rules.sanitize(value);
      } else {
        sanitized[field] = value;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
      metadata: {
        totalFields: Object.keys(schema).length,
        validatedFields: Object.keys(sanitized).length
      }
    };
  };
};

// ============================================================
// EXPORT UTILITY
// ============================================================

export default {
  // String validators
  validateStringLength,
  validateEmail,
  validatePassword,
  validateUsername,
  validateURL,
  
  // Note validators
  validateNoteTitle,
  validateNoteContent,
  validateNoteTags,
  validateNoteColor,
  validateNote,
  
  // User validators
  validateUserRegistration,
  validateProfileUpdate,
  
  // Folder validators
  validateFolderName,
  validateFolder,
  
  // ID validators
  validateMongoId,
  validateUUID,
  
  // Sanitization
  sanitizeText,
  sanitizeHTML,
  decodeHTML,
  sanitizeFilename,
  sanitizeSearchQuery,
  
  // Pagination
  validatePagination,
  
  // Date validators
  validateDate,
  validateDateRange,
  
  // Schema validation
  createSchemaValidator
};
