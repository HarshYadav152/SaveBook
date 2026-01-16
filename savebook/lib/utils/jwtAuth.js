<<<<<<< HEAD:savebook/lib/utils/jwtAuth.js
import * as jose from 'jose';
=======
import * as jose from 'jose'
>>>>>>> a61f6ef (Updated login page and update profile page, fix: removal of console logs, restored .env):savebook/lib/utils/JWT.js

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-secret-key-here';

// Generate access token (for API routes - Node.js runtime)
export const generateAuthToken = async (userId) => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);

    const authToken = await new jose.SignJWT({ userId: userId.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY || '7d')
      .sign(secret);

    return { authToken };
  } catch (error) {
    console.error("Token generation error:", error);
    return {
      success: false,
      error: "Error generating access token",
      status: 500
    };
  }
};

// Verify token (Edge-compatible)
export const verifyJwtToken = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        error: "No token provided",
        status: 401
      };
    }

    // console.log("Verifying token...");
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    // console.log("Decoded token:", payload);

    return {
      success: true,
      userId: payload.userId
    };
  } catch (error) {
    console.error("Token verification error:", error.message);
    if (error.code === 'ERR_JWT_EXPIRED') {
      return {
        success: false,
        error: "Token expired",
        status: 401
      };
    }
    return {
      success: false,
      error: "Invalid token",
      status: 401
    };
  }
};
