import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get all FAQs
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(faqs);
  } catch (error: any) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
      },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
