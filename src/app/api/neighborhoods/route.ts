import prisma from "@/lib/prisma";
import { jsonWithCors, requireSession } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const neighborhoods = await prisma.neighborhood.findMany({
      orderBy: { name: "asc" },
      include: {
        buyingPowerPredictions: {
          orderBy: { runAt: "desc" },
          take: 1,
        },
      },
    });

    const stats = {
      total: neighborhoods.length,
      high: neighborhoods.filter((n) => n.buyingPowerCategory === "HIGH").length,
      average: neighborhoods.filter((n) => n.buyingPowerCategory === "AVERAGE")
        .length,
      budget: neighborhoods.filter((n) => n.buyingPowerCategory === "BUDGET")
        .length,
      modelAccuracy:
        neighborhoods.reduce(
          (sum, n) => sum + (n.confidenceScore || 0),
          0
        ) / Math.max(neighborhoods.length, 1),
    };

    return jsonWithCors({ success: true, data: neighborhoods, stats }, request);
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch neighborhoods" },
      request,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();

    const neighborhood = await prisma.neighborhood.create({
      data: {
        name: body.name,
        boundary: body.boundary ? JSON.stringify(body.boundary) : null,
        buyingPowerCategory: body.buyingPowerCategory || null,
        confidenceScore: body.confidenceScore || null,
        totalSignals: body.totalSignals ?? 0,
        dominantPriceTier: body.dominantPriceTier || null,
        topProductCategory: body.topProductCategory || null,
      },
    });

    return jsonWithCors({ success: true, data: neighborhood }, request, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating neighborhood:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create neighborhood" },
      request,
      { status: 500 }
    );
  }
}
