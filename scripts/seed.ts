// npm run seed — creates demo accounts, template docs and sample pages (safe to run repeatedly).
// Uses MONGO_URI from .env.local if set, otherwise the local development MongoDB.
import { readFileSync } from "fs";

try {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // no .env.local — fine for local development
}

async function main() {
  process.env.SEED_ON_EMPTY = "false";
  const { connectDB, disconnectDB } = await import("../lib/db");
  const { seedDatabase } = await import("../lib/seed");
  await connectDB();
  await seedDatabase();
  console.log("✅ Seed complete");
  console.log("   admin@demo.com / Admin@123  (admin)");
  console.log("   demo@demo.com  / Demo@1234  (creator, has sample pages)");
  console.log("   Sample pages: /w/riya-birthday-demo · /w/mom-dad-anniversary-demo · /w/kabir-ishita-wedding-demo");
  await disconnectDB();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
