import jwt from "jsonwebtoken";

export function verifyJwtToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, userId: decoded.id };
  } catch (error) {
    return { success: false };
  }
}