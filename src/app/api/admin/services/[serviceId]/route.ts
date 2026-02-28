import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId } = await params;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        category: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PATCH - Update service
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId } = await params;
    const body = await request.json();

    const {
      title,
      shortDescription,
      description,
      categoryId,
      priceGuideline,
      image,
      features,
      isActive,
      countries,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription || null;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) {
      updateData.category = { connect: { id: categoryId } };
    }
    if (priceGuideline !== undefined) updateData.priceGuideline = priceGuideline ? parseFloat(priceGuideline) : null;
    if (image !== undefined) updateData.image = image || null;
    if (features !== undefined) {
      updateData.features = Array.isArray(features)
        ? features
            .map((v: any) => String(v ?? "").trim())
            .filter(Boolean)
        : [];
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    if (countries !== undefined) updateData.countries = Array.isArray(countries) ? countries : Prisma.JsonNull;

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(service);
  } catch (error: any) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { serviceId } = await params;

    // Check if service has orders
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (service._count.orders > 0) {
      return NextResponse.json(
        { error: "Cannot delete service with existing orders" },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete service" },
      { status: 500 }
    );
  }
}
