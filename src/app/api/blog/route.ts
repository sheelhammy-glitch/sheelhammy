import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    // Check if prisma.blog exists (Prisma Client needs to be regenerated)
    if (!prisma || !(prisma as any).blog) {
      console.error("Prisma Client error: blog model not found. Please run 'npx prisma generate'");
      return NextResponse.json(
        { 
          error: "Database model not found. Please run 'npx prisma generate' and restart the server.",
          details: "The Blog model was added but Prisma Client needs to be regenerated."
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = category;
    }

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          image: true,
          author: true,
          publishedAt: true,
          views: true,
          category: true,
          tags: true,
          createdAt: true,
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
