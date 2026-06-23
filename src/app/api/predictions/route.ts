import prisma from "@/lib/prisma";
import { jsonWithCors, requireSession } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const predictions = await prisma.buyingPowerPrediction.findMany({
      orderBy: { runAt: "desc" },
      include: { neighborhood: true },
      take: 50,
    });

    const latest = predictions[0];
    const stats = {
      currentAccuracy: latest?.accuracyScore ?? latest?.confidenceScore ?? 0,
      trainingData: predictions.length,
      lastTrained: latest?.runAt ?? null,
      modelVersion: latest?.modelVersion ?? "v1.0.0",
    };

    return jsonWithCors({ success: true, data: predictions, stats }, request);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch predictions" },
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

    const prediction = await prisma.buyingPowerPrediction.create({
      data: {
        neighborhoodId: body.neighborhoodId,
        predictedCategory: body.predictedCategory,
        confidenceScore: body.confidenceScore,
        featureVector: JSON.stringify(body.featureVector || {}),
        modelVersion: body.modelVersion || "v1.0.0",
        accuracyScore: body.accuracyScore || null,
      },
      include: { neighborhood: true },
    });

    await prisma.neighborhood.update({
      where: { id: body.neighborhoodId },
      data: {
        buyingPowerCategory: body.predictedCategory,
        confidenceScore: body.confidenceScore,
        lastPredictedAt: new Date(),
      },
    });

    return jsonWithCors({ success: true, data: prediction }, request, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create prediction" },
      request,
      { status: 500 }
    );
  }
}
