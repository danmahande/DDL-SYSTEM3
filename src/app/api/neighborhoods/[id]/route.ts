import prisma from "@/lib/prisma";
import { jsonWithCors, requireSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await request.json();

    const neighborhood = await prisma.neighborhood.update({
      where: { id },
      data: {
        name: body.name,
        boundary: body.boundary ? JSON.stringify(body.boundary) : undefined,
        buyingPowerCategory: body.buyingPowerCategory,
        confidenceScore: body.confidenceScore,
        totalSignals: body.totalSignals,
        dominantPriceTier: body.dominantPriceTier,
        topProductCategory: body.topProductCategory,
      },
    });

    return jsonWithCors({ success: true, data: neighborhood }, request);
  } catch (error) {
    console.error("Error updating neighborhood:", error);
    return jsonWithCors(
      { success: false, error: "Failed to update neighborhood" },
      request,
      { status: 500 }
    );
  }
}
