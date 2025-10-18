import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';

// Generate access token
export const generateAuthToken = async (userId) => {
  try {
    const authToken = jwt.sign(
      { _id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '7d' }
    );
    
    return { authToken: authToken };
  } catch (error) {
    return { 
      success: false, 
      error: "Error generating access token", 
      status: 500 
    };
  }
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Verify token from request
export const verifyToken = async (request) => {
  try {
    // Get token from cookies
    const token = request.cookies.get('authToken')?.value;
    
    if (!token) {
      return {
        success: false,
        error: "Unauthorized - No token provided",
        status: 401
      };
    }
    
    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Get user from database
    const user = await User.findById(decodedToken._id).select("-password");
    
    if (!user) {
      return {
        success: false,
        error: "Unauthorized - Invalid token",
        status: 401
      };
    }
    return {
      success: true,
      user,
      userId: user._id
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return {
        success: false,
        error: "Invalid token",
        status: 401
      };
    }
    
    if (error.name === 'TokenExpiredError') {
      return {
        success: false,
        error: "Token expired",
        status: 401
      };
    }
    
    return {
      success: false,
      error: error.message || "Authentication failed",
      status: 401
    };
  }
};

// Verify token directly without request
export const verifyJwtToken = (token) => {
  try {
    if (!token) {
      return {
        success: false,
        error: "No token provided",
        status: 401
      };
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return {
      success: true,
      userId: decodedToken._id
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
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

// Create token cookie
export const createTokenCookie = (token) => {
  return {
    name: 'authToken',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  };
};