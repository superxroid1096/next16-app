/**
 * Script: Create Admin User
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from environment
 * or prompts for them if not set.
 *
 * This script creates a single admin user.
 * There is NO public registration — only this script.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment.");
  process.exit(1);
}

async function main() {
  let email = process.env.ADMIN_EMAIL || process.argv[2];
  let password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!email || !password) {
    const rl = readline.createInterface({ input, output });
    if (!email) {
      const ans = await rl.question("Admin Email (press Enter for admin@portfolio.local): ");
      email = ans.trim() || "admin@portfolio.local";
    }
    if (!password) {
      const ans = await rl.question("Admin Password (press Enter for admin123456): ");
      password = ans.trim() || "admin123456";
    }
    rl.close();
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db!;
  const collection = db.collection("admins");

  // Check if admin already exists
  const existing = await collection.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin with email "${email}" already exists. You can log in with your existing password.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await collection.insertOne({
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log(`\nAdmin account created successfully!`);
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Login at: http://localhost:3000/admin/login\n`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error creating admin:", err);
  process.exit(1);
});
