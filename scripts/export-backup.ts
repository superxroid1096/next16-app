/**
 * Script: Export MongoDB database backup
 *
 * Usage:
 *   npx tsx scripts/export-backup.ts
 *
 * Exports all portfolio collections to a JSON backup file.
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment.");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB for backup export...");

  const db = mongoose.connection.db!;

  const collections = [
    "sitesettings",
    "projects",
    "skillgroups",
    "experiences",
    "certificates",
    "feedbacks",
  ];

  const backupData: Record<string, unknown[]> = {
    exportedAt: [new Date().toISOString() as any],
  };

  for (const colName of collections) {
    const docs = await db.collection(colName).find().toArray();
    backupData[colName] = docs;
    console.log(`- Exported ${colName}: ${docs.length} documents`);
  }

  const backupDir = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(backupDir, `portfolio-backup-${timestamp}.json`);

  fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), "utf-8");
  console.log(`\nBackup saved successfully to:\n${filePath}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});
