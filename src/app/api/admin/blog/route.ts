import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const posts = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      image,
      author,
      isPublished,
      publishedAt,
      tags,
      category,
      seoTitle,
      seoDescription,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blog.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        image: image || null,
        author: author || null,
        isPublished: isPublished || false,
        publishedAt: isPublished && publishedAt ? new Date(publishedAt) : isPublished ? new Date() : null,
        tags: tags || null,
        category: category || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create blog post" },
      { status: 500 }
    );
  }
}
