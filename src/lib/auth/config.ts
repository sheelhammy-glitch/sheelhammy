import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

// Dynamic import for Prisma to avoid edge runtime issues
async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

// Validate that secret is set
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
if (!secret || secret === "your-secret-key-here-change-this-in-production") {
  console.error(
    "⚠️  NEXTAUTH_SECRET is not set or is using default value. Please set a secure secret in your .env file."
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const prisma = await getPrisma();
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: secret || "fallback-secret-for-development-only-change-in-production",
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
