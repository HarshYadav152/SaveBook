/**
 * Audio File Validation Utility
 * 
 * Validates audio files before storage:
 * - File type checking
 * - File size limits
 * - Metadata extraction
 */

// Supported MIME types for audio
const SUPPORTED_AUDIO_TYPES = [
  'audio/webm',
  'audio/mp3',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/aac',
  'audio/flac',
];

// Maximum file size: 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Minimum file size: 100 KB (prevents empty/corrupt files)
const MIN_FILE_SIZE = 100 * 1024;

/**
 * Validate audio file before upload
 * 
 * @param {File} file - Audio file from FormData
 * @returns {Promise<{isValid: boolean, error: string|null, duration: number|null}>}
 */
export async function validateAudioFile(file) {
  // Validate file exists
  if (!file || !(file instanceof File)) {
    return {
      isValid: false,
      error: "Invalid file object",
      duration: null,
    };
  }

  // Validate MIME type
  if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported audio format. Supported: ${SUPPORTED_AUDIO_TYPES.join(", ")}`,
      duration: null,
    };
  }

  // Validate file size (minimum)
  if (file.size < MIN_FILE_SIZE) {
    return {
      isValid: false,
      error: `Audio file too small. Minimum: ${MIN_FILE_SIZE / 1024 / 1024}MB`,
      duration: null,
    };
  }

  // Validate file size (maximum)
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Audio file too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      duration: null,
    };
  }

  // Optional: Extract audio duration
  let duration = null;
  try {
    duration = await extractAudioDuration(file);
  } catch (err) {
    console.warn("Could not extract audio duration:", err.message);
    // Don't fail validation if duration extraction fails
  }

  return {
    isValid: true,
    error: null,
    duration: duration,
  };
}

/**
 * Extract audio duration from file
 * Uses Web Audio API (works in Node.js with file buffer)
 * 
 * @param {File} file - Audio file
 * @returns {Promise<number>} Duration in seconds
 */
async function extractAudioDuration(file) {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Try to extract duration from file metadata
    // This is a simplified approach - real implementation would parse audio headers
    const duration = await parseAudioDuration(arrayBuffer, file.type);
    
    return duration;
  } catch (err) {
    throw new Error(`Failed to extract duration: ${err.message}`);
  }
}

/**
 * Parse audio duration from buffer
 * Simplified: returns approximate duration from file size
 * 
 * For production:
 * - Use ffmpeg or ffprobe to extract actual duration
 * - Or parse audio container headers (MP3 frames, WAV chunks, etc.)
 * 
 * @param {ArrayBuffer} buffer - Audio file buffer
 * @param {string} mimeType - MIME type
 * @returns {Promise<number>} Duration in seconds
 */
async function parseAudioDuration(buffer, mimeType) {
  // This is a placeholder implementation
  // In production, you would use proper audio parsing
  
  // Rough estimate: 128 kbps average bitrate
  // This is NOT accurate but gives a reasonable default
  const bitrate = 128000; // bits per second
  const byteCount = buffer.byteLength;
  const estimatedDuration = (byteCount * 8) / bitrate;
  
  return Math.round(estimatedDuration);
}

/**
 * Sanitize file name for storage
 * Removes potentially unsafe characters
 * 
 * @param {string} fileName - Original file name
 * @returns {string} Sanitized file name
 */
export function sanitizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_") // Replace unsafe chars with underscore
    .replace(/^\.+/, "") // Remove leading dots
    .substring(0, 255); // Limit length
}

/**
 * Generate unique file name for storage
 * Prevents naming conflicts and directory traversal
 * 
 * @param {string} originalFileName - Original file name
 * @param {string} userId - User ID
 * @returns {string} Unique file name with timestamp
 */
export function generateUniqueFileName(originalFileName, userId) {
  const sanitized = sanitizeFileName(originalFileName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = sanitized.split(".").pop() || "webm";
  
  return `audio_${userId}_${timestamp}_${random}.${extension}`;
}
