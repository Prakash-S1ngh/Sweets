import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcrypt";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("❌ MONGO_URI is missing in .env");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) return;

    const existing = await User.findOne({ email: adminEmail });
    if (existing) return;

    const hashed = await bcrypt.hash(adminPassword, 10);

    const admin = new User({
      email: adminEmail,
      password: hashed,
      role: "admin",
    });

    await admin.save();

    console.log("⭐ Admin user created:", adminEmail);
  } catch (err) {
    console.error("❌ Admin seeding failed:", err);
  }
}

export default connectDB;