import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL || "";

let adapter: PrismaMariaDb;

if (connectionString && connectionString.trim() !== "") {
  try {
    const url = new URL(connectionString);

    const sslParam =
      url.searchParams.get("ssl-mode") ||
      url.searchParams.get("sslaccept") ||
      url.searchParams.get("ssl");
    const sslRequired =
      sslParam === "strict" ||
      sslParam === "required" ||
      sslParam === "REQUIRED" ||
      process.env.NODE_ENV === "production";

    const isVercel = process.env.VERCEL === "1";
    const connectionLimit = isVercel ? 5 : 10;
    
    const isAiven =
      url.hostname.includes("aivencloud.com") || url.hostname.includes("aiven.io");
    const isRailway =
      url.hostname.includes("railway") || url.hostname.includes("rlwy.net");
    const isProduction = process.env.NODE_ENV === "production";

    const adapterConfig: any = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      connectionLimit: connectionLimit,
      connectTimeout: 60000,
      acquireTimeout: 50000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      queueLimit: 0,
      reconnect: true,
      allowPublicKeyRetrieval: true,
      retry: {
        min: 1000,
        max: 5000,
        factor: 2,
        randomize: true,
      },
    };

    if (sslRequired || isProduction || isRailway || isAiven) {
      if (sslParam === "strict") {
        adapterConfig.ssl = {
          rejectUnauthorized: true,
        };
      } else {
        adapterConfig.ssl = {
          rejectUnauthorized: false,
        };
      }
    }

    adapter = new PrismaMariaDb(adapterConfig);
  } catch (error) {
    throw new Error(
      `Invalid DATABASE_URL format: ${
        error instanceof Error ? error.message : String(error)
      }. Please check your DATABASE_URL environment variable.`
    );
  }
} else {
  throw new Error(
    "DATABASE_URL environment variable is required but not set. Please set DATABASE_URL in your environment variables."
  );
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
