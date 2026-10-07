import bcrypt from "bcryptjs";
import { config } from "dotenv";

// IMPORTANT: Load env before importing anything that uses DATABASE_URL
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./schema";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, casing: "snake_case" });

async function createMaster() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  const email = "admin@library.com";

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(users)
      .set({
        password: passwordHash,
        role: "ADMIN",
        status: "APPROVED",
        fullName: "Master Admin",
        universityId: 1001,
      })
      .where(eq(users.email, email));
    console.log("✅ Master admin account updated successfully!");
  } else {
    await db.insert(users).values({
      fullName: "Master Admin",
      email: email,
      universityId: 1001,
      password: passwordHash,
      universityCard: "https://placehold.co/600x400/png",
      status: "APPROVED",
      role: "ADMIN",
    });
    console.log("✅ Master admin account created successfully!");
  }

  console.log("\nLogin credentials:");
  console.log("  Email:    admin@library.com");
  console.log("  Password: Admin123!");

  process.exit(0);
}

createMaster().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
