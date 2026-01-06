/**
 * Advanced API Helpers for SaveBook
 * Comprehensive utilities for API requests, response handling,
 * caching, retries, error handling, and request management.
 * 
 * Author: ayushap18
 * Date: January 2026
 * ECWoC 2026 Contribution
 */

// ============================================================
// API CONFIGURATION
// ============================================================

/**
 * Default API configuration
 */
const DEFAULT_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
  retryBackoff: 2,
  cacheEnabled: true,
  cacheTTL: 300000, // 5 minutes
  headers: {
    'Content-Type': 'application/json'
  }
};

// ============================================================
// HTTP CLIENT
// ============================================================

/**
 * Creates a configured HTTP client instance
 * @param {Object} config - Client configuration
 * @returns {Object} HTTP client instance
 */
export const createAPIClient = (config = {}) => {
  const clientConfig = { ...DEFAULT_CONFIG, ...config };
  const requestInterceptors = [];
  const responseInterceptors = [];
  const cache = new Map();
  
  /**
   * Applies request interceptors
   * @param {Object} requestConfig - Request configuration
   * @returns {Object} Modified configuration
   */
  const applyRequestInterceptors = async (requestConfig) => {
    let config = { ...requestConfig };
    for (const interceptor of requestInterceptors) {
      config = await interceptor(config);
    }
    return config;
  };
  
  /**
   * Applies response interceptors
   * @param {Object} response - Response object
   * @returns {Object} Modified response
   */
  const applyResponseInterceptors = async (response) => {
    let res = response;
    for (const interceptor of responseInterceptors) {
      res = await interceptor(res);
    }
    return res;
  };
  
  /**
   * Generates cache key
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {Object} params - Query parameters
   * @returns {string} Cache key
   */
  const getCacheKey = (method, url, params = {}) => {
    return `${method}:${url}:${JSON.stringify(params)}`;
  };
  
  /**
   * Gets cached response if valid
   * @param {string} key - Cache key
   * @returns {Object|null} Cached response or null
   */
  const getFromCache = (key) => {
    if (!clientConfig.cacheEnabled) return null;
    
    const cached = cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiresAt) {
      cache.delete(key);
      return null;
    }
    
    return cached.data;
  };
  
  /**
   * Stores response in cache
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   * @param {number} ttl - Time to live
   */
  const setCache = (key, data, ttl = clientConfig.cacheTTL) => {
    if (!clientConfig.cacheEnabled) return;
    
    cache.set(key, {
      data,
      expiresAt: Date.now() + ttl
    });
  };
  
  /**
   * Makes an HTTP request with retries
   * @param {Object} requestConfig - Request configuration
   * @returns {Promise<Object>} Response
   */
  const request = async (requestConfig) => {
    const config = await applyRequestInterceptors({
      method: 'GET',
      headers: { ...clientConfig.headers },
      ...requestConfig
    });
    
    const fullURL = config.url.startsWith('http') 
      ? config.url 
      : `${clientConfig.baseURL}${config.url}`;
    
    // Check cache for GET requests
    if (config.method === 'GET' && config.cache !== false) {
      const cacheKey = getCacheKey(config.method, fullURL, config.params);
      const cached = getFromCache(cacheKey);
      if (cached) {
        return { ...cached, fromCache: true };
      }
    }
    
    // Build URL with params
    const url = new URL(fullURL, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    // Retry logic
    let lastError;
    for (let attempt = 0; attempt <= (config.retries ?? clientConfig.retries); attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout || clientConfig.timeout);
        
        const fetchConfig = {
          method: config.method,
          headers: config.headers,
          signal: controller.signal
        };
        
        if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
          fetchConfig.body = typeof config.body === 'string' 
            ? config.body 
            : JSON.stringify(config.body);
        }
        
        const response = await fetch(url.toString(), fetchConfig);
        clearTimeout(timeoutId);
        
        // Parse response
        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else if (contentType?.includes('text/')) {
          data = await response.text();
        } else {
          data = await response.blob();
        }
        
        const result = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          ok: response.ok
        };
        
        if (!response.ok) {
          throw new APIError(
            data.message || data.error || response.statusText,
            response.status,
            data
          );
        }
        
        // Apply response interceptors
        const interceptedResult = await applyResponseInterceptors(result);
        
        // Cache successful GET requests
        if (config.method === 'GET' && config.cache !== false) {
          const cacheKey = getCacheKey(config.method, fullURL, config.params);
          setCache(cacheKey, interceptedResult, config.cacheTTL);
        }
        
        return interceptedResult;
        
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain errors
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout', 408);
        }
        
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          throw error;
        }
        
        // Wait before retry
        if (attempt < (config.retries ?? clientConfig.retries)) {
          const delay = clientConfig.retryDelay * Math.pow(clientConfig.retryBackoff, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };
  
  return {
    /**
     * GET request
     */
    get: (url, config = {}) => request({ ...config, method: 'GET', url }),
    
    /**
     * POST request
     */
    post: (url, body, config = {}) => request({ ...config, method: 'POST', url, body }),
    
    /**
     * PUT request
     */
    put: (url, body, config = {}) => request({ ...config, method: 'PUT', url, body }),
    
    /**
     * PATCH request
     */
    patch: (url, body, config = {}) => request({ ...config, method: 'PATCH', url, body }),
    
    /**
     * DELETE request
     */
    delete: (url, config = {}) => request({ ...config, method: 'DELETE', url }),
    
    /**
     * Adds request interceptor
     */
    addRequestInterceptor: (interceptor) => {
      requestInterceptors.push(interceptor);
      return () => {
        const index = requestInterceptors.indexOf(interceptor);
        if (index > -1) requestInterceptors.splice(index, 1);
      };
    },
    
    /**
     * Adds response interceptor
     */
    addResponseInterceptor: (interceptor) => {
      responseInterceptors.push(interceptor);
      return () => {
        const index = responseInterceptors.indexOf(interceptor);
        if (index > -1) responseInterceptors.splice(index, 1);
      };
    },
    
    /**
     * Clears cache
     */
    clearCache: () => cache.clear(),
    
    /**
     * Gets configuration
     */
    getConfig: () => ({ ...clientConfig })
  };
};

// ============================================================
// API ERROR CLASS
// ============================================================

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
  
  /**
   * Checks if error is a specific status
   */
  is(status) {
    return this.status === status;
  }
  
  /**
   * Checks if error is client error (4xx)
   */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }
  
  /**
   * Checks if error is server error (5xx)
   */
  isServerError() {
    return this.status >= 500;
  }
  
  /**
   * Converts to JSON
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp
    };
  }
}

// ============================================================
// RESPONSE HANDLERS
// ============================================================

/**
 * Standard response handler for API routes
 */
export const ResponseHandler = {
  /**
   * Success response
   */
  success(data, message = 'Success', status = 200) {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  },
  
  /**
   * Error response
   */
  error(message = 'An error occurred', status = 500, errors = null) {
    return {
      success: false,
      message,
      errors,
      status,
      timestamp: new Date().toISOString()
    };
  },
  
  /**
   * Paginated response
   */
  paginated(data, page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      timestamp: new Date().toISOString()
    };
  },
  
  /**
   * Created response
   */
  created(data, message = 'Resource created successfully') {
    return this.success(data, message, 201);
  },
  
  /**
   * Updated response
   */
  updated(data, message = 'Resource updated successfully') {
    return this.success(data, message, 200);
  },
  
  /**
   * Deleted response
   */
  deleted(message = 'Resource deleted successfully') {
    return this.success(null, message, 200);
  },
  
  /**
   * Not found response
   */
  notFound(resource = 'Resource') {
    return this.error(`${resource} not found`, 404);
  },
  
  /**
   * Unauthorized response
   */
  unauthorized(message = 'Authentication required') {
    return this.error(message, 401);
  },
  
  /**
   * Forbidden response
   */
  forbidden(message = 'Access denied') {
    return this.error(message, 403);
  },
  
  /**
   * Validation error response
   */
  validationError(errors) {
    return this.error('Validation failed', 400, errors);
  },
  
  /**
   * Rate limit response
   */
  rateLimited(retryAfter = 60) {
    return {
      ...this.error('Too many requests', 429),
      retryAfter
    };
  }
};

// ============================================================
// REQUEST QUEUE
// ============================================================

/**
 * Request queue for managing concurrent requests
 */
export class RequestQueue {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 5;
    this.queue = [];
    this.running = 0;
    this.paused = false;
    this.onProgress = options.onProgress || null;
    this.completed = 0;
    this.failed = 0;
  }
  
  /**
   * Adds request to queue
   * @param {Function} requestFn - Function that returns a promise
   * @param {Object} options - Request options
   * @returns {Promise} Request promise
   */
  add(requestFn, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject,
        priority: options.priority || 0,
        id: options.id || Date.now() + Math.random().toString(36)
      });
      
      // Sort by priority
      this.queue.sort((a, b) => b.priority - a.priority);
      
      this.processQueue();
    });
  }
  
  /**
   * Processes queue
   */
  async processQueue() {
    if (this.paused) return;
    
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      this.running++;
      
      this.runRequest(item);
    }
  }
  
  /**
   * Runs a single request
   */
  async runRequest(item) {
    try {
      const result = await item.requestFn();
      this.completed++;
      item.resolve(result);
    } catch (error) {
      this.failed++;
      item.reject(error);
    } finally {
      this.running--;
      this.emitProgress();
      this.processQueue();
    }
  }
  
  /**
   * Emits progress event
   */
  emitProgress() {
    if (this.onProgress) {
      this.onProgress({
        completed: this.completed,
        failed: this.failed,
        pending: this.queue.length,
        running: this.running,
        total: this.completed + this.failed + this.queue.length + this.running
      });
    }
  }
  
  /**
   * Pauses queue processing
   */
  pause() {
    this.paused = true;
  }
  
  /**
   * Resumes queue processing
   */
  resume() {
    this.paused = false;
    this.processQueue();
  }
  
  /**
   * Clears queue
   */
  clear() {
    this.queue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }
  
  /**
   * Gets queue status
   */
  getStatus() {
    return {
      pending: this.queue.length,
      running: this.running,
      completed: this.completed,
      failed: this.failed,
      paused: this.paused
    };
  }
}

// ============================================================
// BATCH REQUESTS
// ============================================================

/**
 * Batches multiple requests into one
 */
export class RequestBatcher {
  constructor(options = {}) {
    this.batchFn = options.batchFn;
    this.maxBatchSize = options.maxBatchSize || 50;
    this.delay = options.delay || 50;
    this.batch = [];
    this.timeout = null;
  }
  
  /**
   * Adds item to batch
   * @param {*} item - Item to add
   * @returns {Promise} Result promise
   */
  add(item) {
    return new Promise((resolve, reject) => {
      this.batch.push({ item, resolve, reject });
      
      if (this.batch.length >= this.maxBatchSize) {
        this.flush();
      } else if (!this.timeout) {
        this.timeout = setTimeout(() => this.flush(), this.delay);
      }
    });
  }
  
  /**
   * Flushes batch
   */
  async flush() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    if (this.batch.length === 0) return;
    
    const currentBatch = [...this.batch];
    this.batch = [];
    
    try {
      const items = currentBatch.map(b => b.item);
      const results = await this.batchFn(items);
      
      currentBatch.forEach((entry, index) => {
        if (results[index]?.error) {
          entry.reject(results[index].error);
        } else {
          entry.resolve(results[index]);
        }
      });
    } catch (error) {
      currentBatch.forEach(entry => entry.reject(error));
    }
  }
}

// ============================================================
// API CACHING
// ============================================================

/**
 * Advanced caching with tags and invalidation
 */
export class APICache {
  constructor(options = {}) {
    this.storage = new Map();
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
    this.maxSize = options.maxSize || 1000;
    this.tags = new Map();
  }
  
  /**
   * Sets cache entry
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {Object} options - Cache options
   */
  set(key, value, options = {}) {
    const { ttl = this.defaultTTL, tags = [] } = options;
    
    // Evict if at max size
    if (this.storage.size >= this.maxSize) {
      this.evictOldest();
    }
    
    const entry = {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
      tags
    };
    
    this.storage.set(key, entry);
    
    // Index by tags
    for (const tag of tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag).add(key);
    }
    
    return entry;
  }
  
  /**
   * Gets cache entry
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    const entry = this.storage.get(key);
    
    if (!entry) return undefined;
    
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return undefined;
    }
    
    return entry.value;
  }
  
  /**
   * Checks if key exists
   * @param {string} key - Cache key
   * @returns {boolean} Whether key exists
   */
  has(key) {
    return this.get(key) !== undefined;
  }
  
  /**
   * Deletes cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    const entry = this.storage.get(key);
    
    if (entry) {
      // Remove from tag index
      for (const tag of entry.tags) {
        const tagKeys = this.tags.get(tag);
        if (tagKeys) {
          tagKeys.delete(key);
          if (tagKeys.size === 0) {
            this.tags.delete(tag);
          }
        }
      }
      
      this.storage.delete(key);
    }
  }
  
  /**
   * Invalidates by tag
   * @param {string} tag - Tag to invalidate
   */
  invalidateByTag(tag) {
    const keys = this.tags.get(tag);
    if (keys) {
      for (const key of keys) {
        this.storage.delete(key);
      }
      this.tags.delete(tag);
    }
  }
  
  /**
   * Invalidates by pattern
   * @param {RegExp|string} pattern - Pattern to match
   */
  invalidateByPattern(pattern) {
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
    
    for (const key of this.storage.keys()) {
      if (regex.test(key)) {
        this.delete(key);
      }
    }
  }
  
  /**
   * Evicts oldest entries
   */
  evictOldest() {
    let oldest = null;
    let oldestKey = null;
    
    for (const [key, entry] of this.storage.entries()) {
      if (!oldest || entry.createdAt < oldest.createdAt) {
        oldest = entry;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }
  
  /**
   * Clears all cache
   */
  clear() {
    this.storage.clear();
    this.tags.clear();
  }
  
  /**
   * Gets cache stats
   */
  getStats() {
    let expired = 0;
    let valid = 0;
    
    const now = Date.now();
    for (const entry of this.storage.values()) {
      if (now > entry.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return {
      size: this.storage.size,
      valid,
      expired,
      tags: this.tags.size,
      maxSize: this.maxSize
    };
  }
  
  /**
   * Prunes expired entries
   */
  prune() {
    const now = Date.now();
    const keysToDelete = [];
    
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }
    
    for (const key of keysToDelete) {
      this.delete(key);
    }
    
    return keysToDelete.length;
  }
}

// ============================================================
// API MIDDLEWARE HELPERS
// ============================================================

/**
 * Creates an API handler with middleware support
 * @param {Object} handlers - HTTP method handlers
 * @returns {Function} API handler
 */
export const createAPIHandler = (handlers) => {
  return async (req, res) => {
    const method = req.method.toUpperCase();
    const handler = handlers[method];
    
    if (!handler) {
      return res.status(405).json(
        ResponseHandler.error(`Method ${method} not allowed`, 405)
      );
    }
    
    try {
      const result = await handler(req, res);
      
      // If handler returned a value, send it
      if (result !== undefined && !res.headersSent) {
        const status = result.status || 200;
        return res.status(status).json(result);
      }
    } catch (error) {
      console.error(`API Error [${method}]:`, error);
      
      if (error instanceof APIError) {
        return res.status(error.status).json(
          ResponseHandler.error(error.message, error.status, error.data)
        );
      }
      
      return res.status(500).json(
        ResponseHandler.error('Internal server error', 500)
      );
    }
  };
};

/**
 * Wraps handler with error handling
 * @param {Function} handler - Handler function
 * @returns {Function} Wrapped handler
 */
export const withErrorHandling = (handler) => {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof APIError) {
        return res.status(error.status).json(
          ResponseHandler.error(error.message, error.status)
        );
      }
      
      return res.status(500).json(
        ResponseHandler.error('Internal server error', 500)
      );
    }
  };
};

/**
 * Validates request body against schema
 * @param {Object} schema - Validation schema
 * @returns {Function} Middleware function
 */
export const validateBody = (schema) => {
  return (req) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      // Required check
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }
      
      if (value === undefined || value === null) continue;
      
      // Type check
      if (rules.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rules.type) {
          errors.push({ field, message: `${field} must be a ${rules.type}` });
          continue;
        }
      }
      
      // Min length
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
      }
      
      // Max length
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
      }
      
      // Pattern
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        errors.push({ field, message: rules.patternMessage || `${field} format is invalid` });
      }
      
      // Enum
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
      }
      
      // Min value
      if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
        errors.push({ field, message: `${field} must be at least ${rules.min}` });
      }
      
      // Max value
      if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
        errors.push({ field, message: `${field} must be at most ${rules.max}` });
      }
      
      // Custom validator
      if (rules.validate) {
        const result = rules.validate(value, req.body);
        if (result !== true) {
          errors.push({ field, message: result || `${field} is invalid` });
        }
      }
    }
    
    return errors.length > 0 ? errors : null;
  };
};

// ============================================================
// PAGINATION HELPERS
// ============================================================

/**
 * Parses pagination parameters
 * @param {Object} query - Query parameters
 * @param {Object} defaults - Default values
 * @returns {Object} Pagination config
 */
export const parsePagination = (query, defaults = {}) => {
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    ...filters
  } = query;
  
  return {
    page: Math.max(1, parseInt(page) || defaults.page || 1),
    limit: Math.min(100, Math.max(1, parseInt(limit) || defaults.limit || 20)),
    skip: (Math.max(1, parseInt(page) || 1) - 1) * Math.min(100, Math.max(1, parseInt(limit) || 20)),
    sortBy: sortBy || defaults.sortBy || 'createdAt',
    sortOrder: sortOrder === 'asc' ? 1 : -1,
    filters
  };
};

/**
 * Creates pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const createPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

// ============================================================
// QUERY BUILDER
// ============================================================

/**
 * MongoDB query builder
 */
export class QueryBuilder {
  constructor(baseQuery = {}) {
    this.query = { ...baseQuery };
    this.options = {};
  }
  
  /**
   * Adds equality condition
   */
  where(field, value) {
    if (value !== undefined && value !== null && value !== '') {
      this.query[field] = value;
    }
    return this;
  }
  
  /**
   * Adds regex search
   */
  search(field, value, options = 'i') {
    if (value) {
      this.query[field] = { $regex: value, $options: options };
    }
    return this;
  }
  
  /**
   * Adds in condition
   */
  in(field, values) {
    if (Array.isArray(values) && values.length > 0) {
      this.query[field] = { $in: values };
    }
    return this;
  }
  
  /**
   * Adds range condition
   */
  range(field, min, max) {
    const conditions = {};
    if (min !== undefined && min !== null) conditions.$gte = min;
    if (max !== undefined && max !== null) conditions.$lte = max;
    
    if (Object.keys(conditions).length > 0) {
      this.query[field] = conditions;
    }
    return this;
  }
  
  /**
   * Adds date range
   */
  dateRange(field, from, to) {
    const conditions = {};
    if (from) conditions.$gte = new Date(from);
    if (to) conditions.$lte = new Date(to);
    
    if (Object.keys(conditions).length > 0) {
      this.query[field] = conditions;
    }
    return this;
  }
  
  /**
   * Adds exists condition
   */
  exists(field, exists = true) {
    this.query[field] = { $exists: exists };
    return this;
  }
  
  /**
   * Adds not equal condition
   */
  notEqual(field, value) {
    this.query[field] = { $ne: value };
    return this;
  }
  
  /**
   * Sets sort
   */
  sort(field, order = 'desc') {
    this.options.sort = { [field]: order === 'asc' ? 1 : -1 };
    return this;
  }
  
  /**
   * Sets pagination
   */
  paginate(page, limit) {
    this.options.skip = (page - 1) * limit;
    this.options.limit = limit;
    return this;
  }
  
  /**
   * Sets field selection
   */
  select(fields) {
    this.options.projection = {};
    const fieldArray = typeof fields === 'string' ? fields.split(' ') : fields;
    
    for (const field of fieldArray) {
      if (field.startsWith('-')) {
        this.options.projection[field.substring(1)] = 0;
      } else {
        this.options.projection[field] = 1;
      }
    }
    return this;
  }
  
  /**
   * Builds and returns query
   */
  build() {
    return {
      query: this.query,
      options: this.options
    };
  }
}

// ============================================================
// URL HELPERS
// ============================================================

/**
 * Builds URL with query parameters
 * @param {string} base - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} Full URL
 */
export const buildURL = (base, params = {}) => {
  const url = new URL(base, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }
  
  return url.toString();
};

/**
 * Parses query string
 * @param {string} queryString - Query string
 * @returns {Object} Parsed parameters
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

// ============================================================
// REQUEST DEDUPLICATION
// ============================================================

/**
 * Deduplicates concurrent identical requests
 */
export class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
  }
  
  /**
   * Makes request with deduplication
   * @param {string} key - Request key
   * @param {Function} requestFn - Request function
   * @returns {Promise} Request result
   */
  async request(key, requestFn) {
    // If request is already pending, return the same promise
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }
    
    // Create new request
    const promise = requestFn().finally(() => {
      this.pending.delete(key);
    });
    
    this.pending.set(key, promise);
    return promise;
  }
  
  /**
   * Clears pending request
   */
  clear(key) {
    this.pending.delete(key);
  }
  
  /**
   * Clears all pending requests
   */
  clearAll() {
    this.pending.clear();
  }
}

// ============================================================
// EXPORTS
// ============================================================

// Create default API client instance
export const api = createAPIClient();

export default {
  createAPIClient,
  APIError,
  ResponseHandler,
  RequestQueue,
  RequestBatcher,
  APICache,
  createAPIHandler,
  withErrorHandling,
  validateBody,
  parsePagination,
  createPaginationMeta,
  QueryBuilder,
  buildURL,
  parseQueryString,
  RequestDeduplicator,
  api
};
