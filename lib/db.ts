import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// MongoDB connection.
// - MONGO_URI set   → connect to it (Atlas in production).
// - local, no URI   → reuse/start a persistent local MongoDB (mongodb-memory-server, data in .data/mongo)
//                     so `npm run dev` works on a fresh machine with zero setup.
// - Vercel, no URI  → fail loudly instead of silently losing data.

const LOCAL_PORT = 27027;
const LOCAL_URI = `mongodb://127.0.0.1:${LOCAL_PORT}/wishly`;

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; seeded: Promise<void> | null };
const g = globalThis as any;
const cached: Cache = (g.__mongoose ??= { conn: null, promise: null, seeded: null });

async function canReach(uri: string) {
  const probe = mongoose.createConnection(uri, { serverSelectionTimeoutMS: 800 });
  try {
    await probe.asPromise();
    return true;
  } catch {
    return false;
  } finally {
    await probe.close().catch(() => {});
  }
}

export async function resolveMongoUri(): Promise<string> {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  if (process.env.VERCEL) {
    throw Object.assign(new Error("Database isn't configured. Add MONGO_URI in Vercel → Settings → Environment Variables, then redeploy."), {
      code: "DB_NOT_CONFIGURED",
      status: 503,
    });
  }
  g.__localMongo ??= (async () => {
    if (await canReach(LOCAL_URI)) return LOCAL_URI; // another process (dev server / seed) already runs it
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const dbPath = path.join(process.cwd(), ".data", "mongo");
    fs.mkdirSync(dbPath, { recursive: true });
    g.__mongod = await MongoMemoryServer.create({ instance: { port: LOCAL_PORT, dbPath, storageEngine: "wiredTiger" } });
    console.log(`[db] No MONGO_URI — started local MongoDB at ${LOCAL_URI} (data in .data/mongo)`);
    return LOCAL_URI;
  })();
  return g.__localMongo;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = resolveMongoUri()
      .then((uri) => mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 10_000 }))
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;

  // First boot on an empty database: create demo accounts + sample pages so it's testable immediately
  if (process.env.SEED_ON_EMPTY !== "false") {
    cached.seeded ??= import("@/lib/seed").then(({ seedIfEmpty }) => seedIfEmpty()).catch((e) => {
      console.error("[seed] failed", e);
    });
    await cached.seeded;
  }
  return cached.conn;
}

// Used by scripts (seed) to exit cleanly
export async function disconnectDB() {
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  if (g.__mongod) await g.__mongod.stop({ doCleanup: false, force: false });
}
