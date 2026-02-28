import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all testimonials
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, content, rating, avatar } = body;

    if (!clientName || !content || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        content,
        rating: parseInt(rating),
        avatar: avatar || null,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
