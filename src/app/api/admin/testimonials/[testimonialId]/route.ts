import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testimonialId } = await params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PATCH - Update testimonial
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testimonialId } = await params;
    const body = await request.json();

    const { clientName, content, rating, avatar } = body;

    const updateData: any = {};
    if (clientName !== undefined) updateData.clientName = clientName;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (avatar !== undefined) updateData.avatar = avatar || null;

    const testimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: updateData,
    });

    return NextResponse.json(testimonial);
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ testimonialId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testimonialId } = await params;

    await prisma.testimonial.delete({
      where: { id: testimonialId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
