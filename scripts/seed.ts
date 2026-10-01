import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) throw new Error("Set MONGO_URI in .env.local before seeding");

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, passwordHash: String,
  role: { type: String, default: "USER" }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const TemplateSchema = new mongoose.Schema({
  id: { type: String, unique: true }, name: String, description: String,
  previewImage: String, supportedOccasions: [String],
  defaultPalette: [String], fonts: [String], isActive: { type: Boolean, default: true },
}, { timestamps: true });

async function seed() {
  await mongoose.connect(MONGO_URI);
  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Template = mongoose.models.Template || mongoose.model("Template", TemplateSchema);

  // Seed users
  const adminHash = await bcrypt.hash("Admin@123", 12);
  const userHash = await bcrypt.hash("User@1234", 12);

  await User.findOneAndUpdate(
    { email: "admin@demo.com" },
    { name: "Admin", email: "admin@demo.com", passwordHash: adminHash, role: "ADMIN" },
    { upsert: true }
  );
  await User.findOneAndUpdate(
    { email: "user@demo.com" },
    { name: "Demo User", email: "user@demo.com", passwordHash: userHash, role: "USER" },
    { upsert: true }
  );
  console.log("✅ Users seeded");

  // Seed templates
  const templates = [
    {
      id: "neon-night",
      name: "Neon Night",
      description: "Dark cyberpunk theme with neon glows and glitch effects",
      supportedOccasions: ["BIRTHDAY", "FRIENDSHIP", "CUSTOM"],
      defaultPalette: ["#0B0420", "#FF4FA3", "#22D3EE", "#A78BFA"],
      fonts: ["Space Grotesk"],
    },
    {
      id: "pastel-dream",
      name: "Pastel Dream",
      description: "Soft pastels with balloons, polaroids and doodles",
      supportedOccasions: ["BIRTHDAY", "ANNIVERSARY", "WEDDING", "FRIENDSHIP"],
      defaultPalette: ["#FFF1F5", "#FBCFE8", "#C4B5FD", "#FDE68A"],
      fonts: ["Fredoka", "Caveat"],
    },
    {
      id: "royal-gold",
      name: "Royal Gold",
      description: "Elegant dark theme with gold shimmer and petal animations",
      supportedOccasions: ["ANNIVERSARY", "WEDDING", "FAREWELL", "CONGRATS"],
      defaultPalette: ["#0E0E10", "#D4AF37", "#F5E6C8"],
      fonts: ["Playfair Display"],
    },
  ];

  for (const t of templates) {
    await Template.findOneAndUpdate({ id: t.id }, t, { upsert: true });
  }
  console.log("✅ Templates seeded");

  await mongoose.disconnect();
  console.log("✅ Seed complete. Test credentials: admin@demo.com / Admin@123 | user@demo.com / User@1234");
}

seed().catch((e) => { console.error(e); process.exit(1); });
