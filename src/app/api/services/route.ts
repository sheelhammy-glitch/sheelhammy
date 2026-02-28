import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
 
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const limit = searchParams.get("limit");

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    // TODO: Uncomment after regenerating Prisma Client with: npx prisma generate
    // where.isActive = true;

    const services = await prisma.service.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? parseInt(limit, 10) : undefined,
    });
 
    const formattedServices = services.map((service) => ({
      id: service.id,
      title: service.title,
      shortDescription: service.shortDescription,
      description: service.description,
      image: service.image,
      priceGuideline: service.priceGuideline,
      features: Array.isArray(service.features) ? service.features : [],
      countries: Array.isArray(service.countries) ? service.countries : [],
      category: service.category,
      createdAt: service.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedServices);
  } catch (error: any) {
    console.error("Error fetching public services:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch services" },
      { status: 500 }
    );
  }
}
