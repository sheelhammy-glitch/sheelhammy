import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

// GET - Get single FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ faqId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { faqId } = await params;

    const faq = await prisma.fAQ.findUnique({
      where: { id: faqId },
    });

    if (!faq) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error: any) {
    console.error("Error fetching FAQ:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch FAQ" },
      { status: 500 }
    );
  }
}

// PATCH - Update FAQ
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ faqId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { faqId } = await params;
    const body = await request.json();

    const { question, answer } = body;

    const updateData: any = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;

    const faq = await prisma.fAQ.update({
      where: { id: faqId },
      data: updateData,
    });

    return NextResponse.json(faq);
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Delete FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ faqId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { faqId } = await params;

    await prisma.fAQ.delete({
      where: { id: faqId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
