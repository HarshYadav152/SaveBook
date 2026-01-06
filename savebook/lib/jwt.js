// Simple JWT utilities for testing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function verifyJwtToken(token) {
  try {
    // For testing, just decode the token without verification
    if (!token) return null;
    
    // Simple base64 decode for testing
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function createJwtToken(payload) {
  try {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const signature = btoa(JWT_SECRET);
    
    return `${header}.${payloadEncoded}.${signature}`;
  } catch (error) {
    console.error('JWT creation error:', error);
    return null;
  }
}