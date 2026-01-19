import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Mongo URI:", process.env.MONGODB_URI);

async function dbConnect() {
  if (MONGODB_URI) {
    await mongoose.connect(MONGODB_URI);
  } else {
    console.warn("MONGODB_URI not set, running without database");
  }
}

export default dbConnect;
