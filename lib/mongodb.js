import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("⚠ MONGODB_URI is not defined in .env.local");
}

// Use a global variable to cache the connection across hot reloads
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "skyspy", // Change to your actual DB name if needed
    }).then((mongoose) => {
      console.log("✅ MongoDB Connected!");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB Connection Error:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
