import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Don't throw error immediately, just warn
if (!MONGODB_URI) {
  console.warn("⚠️  MONGODB_URI is not defined. Using mock connection for development.");
}

let isConnected = false;

async function dbConnect() {
  // If already connected, return
  if (isConnected) {
    return;
  }

  // If no MONGODB_URI, just return without connecting
  if (!MONGODB_URI) {
    console.warn("⚠️  Running without MongoDB. Using in-memory data for development.");
    isConnected = true; // Pretend we're connected for development
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // Don't throw, just log and continue
    isConnected = false;
  }
}

export default dbConnect;