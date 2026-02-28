import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

const isPrismaGenerate =
  process.argv.some((arg) => arg.includes("prisma")) &&
  process.argv.some((arg) => arg.includes("generate"));

const isRuntime =
  process.env.VERCEL_ENV !== undefined ||
  process.argv.some((arg) => arg.includes("start"));

const isNextBuild =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NEXT_PHASE === "phase-production-compile" ||
  (process.env.VERCEL === "1" && !process.env.VERCEL_ENV) ||
  (process.argv.some((arg) => arg.includes("next")) &&
    process.argv.some((arg) => arg.includes("build"))) ||
  (process.env.NODE_ENV === "production" &&
    !isRuntime &&
    !process.argv.some((arg) => arg.includes("start")));

const connectionString = process.env.DATABASE_URL || "";

const isBuildContext =
  ((isPrismaGenerate || isNextBuild) &&
    !isRuntime &&
    process.env.NODE_ENV !== "development") ||
  (process.env.NODE_ENV === "production" && !isRuntime && !connectionString);

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
      connectTimeout: 60000, // Increased for remote connections
      acquireTimeout: 50000, // Increased for remote connections

      enableKeepAlive: true,
      keepAliveInitialDelay: 0,

      queueLimit: 0,

      reconnect: true,
      
      // Required for Aiven and some MySQL 8.0+ servers
      allowPublicKeyRetrieval: true,
      
      // Add retry configuration
      retry: {
        min: 1000,
        max: 5000,
        factor: 2,
        randomize: true,
      },
    };

    // SSL configuration for Aiven and other cloud providers
    if (sslRequired || isProduction || isRailway || isAiven) {
      if (sslParam === "strict") {
        adapterConfig.ssl = {
          rejectUnauthorized: true,
        };
      } else {
        // Aiven and most cloud providers use self-signed certificates
        adapterConfig.ssl = {
          rejectUnauthorized: false,
        };
      }
    }

    adapter = new PrismaMariaDb(adapterConfig);

    if (process.env.NODE_ENV === "development") {
      console.log("Prisma adapter configured:", {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        database: url.pathname.slice(1),
        ssl: sslRequired,
      });
    }
  } catch (error) {
    // If URL parsing fails
    if (isBuildContext) {
      // During build time, use placeholder adapter
      console.warn(
        "Failed to parse DATABASE_URL during build, using placeholder adapter:",
        error
      );
      adapter = new PrismaMariaDb({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "placeholder",
        connectionLimit: 1,
        connectTimeout: 1000,
        acquireTimeout: 1000,
      });
    } else {
      // At runtime, throw an error
      throw new Error(
        `Invalid DATABASE_URL format: ${
          error instanceof Error ? error.message : String(error)
        }. Please check your DATABASE_URL environment variable.`
      );
    }
  }
} else {
  // DATABASE_URL is missing
  if (isBuildContext) {
    // During build time, use placeholder adapter
    console.warn(
      "DATABASE_URL not set during build, using placeholder adapter. Make sure to set DATABASE_URL in your production environment."
    );
    adapter = new PrismaMariaDb({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "",
      database: "placeholder",
      connectionLimit: 1,
      connectTimeout: 1000,
      acquireTimeout: 1000,
    });
  } else {
    throw new Error(
      "DATABASE_URL environment variable is required but not set. Please set DATABASE_URL in your environment variables."
    );
  }
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
