import mongoose from "mongoose";

let cached = (global as any).__mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
if (!cached) cached = (global as any).__mongoose = { conn: null, promise: null };

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error("MONGO_URI env var not set — add it to .env.local");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
