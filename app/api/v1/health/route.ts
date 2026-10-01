import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET /api/v1/health — quick deploy check: is the app up and can it reach MongoDB?
export async function GET() {
  const started = Date.now();
  try {
    await connectDB();
    await mongoose.connection.db?.admin().ping();
    return successResponse({
      status: "ok",
      db: "connected",
      dbName: mongoose.connection.name,
      latencyMs: Date.now() - started,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    return errorResponse("DB_UNAVAILABLE", err?.code === "DB_NOT_CONFIGURED" ? err.message : "Can't reach the database — check MONGO_URI and Atlas network access", 503);
  }
}
