import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/DMS";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.promise = mongoose.connect(MONGO_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}
