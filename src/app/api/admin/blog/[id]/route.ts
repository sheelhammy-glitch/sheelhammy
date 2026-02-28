import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const post = await prisma.blog.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PATCH - Update blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
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

    // Check if slug already exists (excluding current post)
    if (slug) {
      const existingPost = await prisma.blog.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt || null;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image || null;
    if (author !== undefined) updateData.author = author || null;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      // If publishing for the first time, set publishedAt
      if (isPublished && publishedAt === undefined) {
        const currentPost = await prisma.blog.findUnique({ where: { id } });
        if (currentPost && !currentPost.publishedAt) {
          updateData.publishedAt = new Date();
        }
      } else if (publishedAt !== undefined) {
        updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
      }
    }
    if (tags !== undefined) updateData.tags = tags || null;
    if (category !== undefined) updateData.category = category || null;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle || null;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription || null;

    const post = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
