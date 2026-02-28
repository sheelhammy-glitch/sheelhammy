import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

// GET - Get all services
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;

    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format services for frontend
    const formattedServices = services.map((service) => ({
      id: service.id,
      title: service.title,
      shortDescription: service.shortDescription,
      description: service.description,
      image: service.image,
      priceGuideline: service.priceGuideline,
      features: Array.isArray(service.features) ? service.features : [],
      isActive: service.isActive,
      countries: Array.isArray(service.countries) ? service.countries : [],
      category: service.category,
      createdAt: service.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedServices);
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, shortDescription, description, categoryId, priceGuideline, image, features, isActive, countries } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        shortDescription: shortDescription || null,
        description,
        categoryId,
        priceGuideline: priceGuideline ? parseFloat(priceGuideline) : null,
        image: image || null,
        features: Array.isArray(features)
          ? features
              .map((v: any) => String(v ?? "").trim())
              .filter(Boolean)
          : [],
        isActive: isActive !== undefined ? isActive : true,
        countries: Array.isArray(countries) ? countries : Prisma.JsonNull,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
