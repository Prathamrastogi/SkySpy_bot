import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "test", // Make sure your database name is correct
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
