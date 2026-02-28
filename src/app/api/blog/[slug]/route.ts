import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Get single blog post by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params;

    const post = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!post || !post.isPublished) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Increment views
    await prisma.blog.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      views: post.views + 1,
    });
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}
