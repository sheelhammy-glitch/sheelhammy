import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables from .env file
// Try to find .env file in project root
const projectRoot = process.cwd();
const envPath = path.resolve(projectRoot, ".env");

// Check if .env file exists
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Try parent directory
  const parentEnvPath = path.resolve(projectRoot, "..", ".env");
  if (fs.existsSync(parentEnvPath)) {
    dotenv.config({ path: parentEnvPath });
  } else {
    // Last resort: use default dotenv.config()
    dotenv.config();
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.trim() === "") {
  console.error("❌ Error: DATABASE_URL is not set in .env file");
  console.error("Current working directory:", projectRoot);
  console.error("Looking for .env at:", envPath);
  console.error("\nPlease create a .env file with:");
  console.error(
    'DATABASE_URL="mysql://username:password@localhost:3306/database_name"'
  );
  process.exit(1);
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
