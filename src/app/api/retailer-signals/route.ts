import prisma from "@/lib/prisma";
import { jsonWithCors, requireRetailerApiKey } from "@/lib/auth";
import { getRedisClient } from "@/lib/redis";
import { z } from "zod";

const retailerSignalSchema = z.object({
  signalId: z.string().min(1),
  shopkeeperId: z.string().min(1),
  businessName: z.string().optional(),
  neighborhood: z.string().min(1),
  productCategory: z.string().min(1),
  productLabel: z.string().min(1),
  productId: z.string().optional(),
  packageSize: z.string().min(1),
  priceTier: z.string().min(1),
  quantity: z.number().int().positive().optional(),
  urgency: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  locationAccuracy: z.number().optional(),
  notes: z.string().optional(),
});

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function POST(request: Request) {
  const authError = requireRetailerApiKey(request);
  if (authError) return authError;

  try {
    const body = retailerSignalSchema.parse(await request.json());

    const existingSignal = await prisma.demandSignal.findUnique({
      where: { signalId: body.signalId },
    });

    if (existingSignal) {
      return jsonWithCors(
        { success: true, data: { signalId: existingSignal.signalId } },
        request
      );
    }

    const newSignal = await prisma.demandSignal.create({
      data: {
        signalId: body.signalId,
        shopkeeperId: body.shopkeeperId,
        businessName: body.businessName || "",
        neighborhood: body.neighborhood,
        productCategory: body.productCategory,
        productLabel: body.productLabel,
        productId: body.productId || "",
        packageSize: body.packageSize,
        priceTier: body.priceTier,
        quantity: body.quantity || 1,
        urgency: body.urgency || "normal",
        status: "pending",
        latitude: body.latitude,
        longitude: body.longitude,
        locationAccuracy: body.locationAccuracy,
        source: "retailer_app",
        notes: body.notes,
        isSynced: true,
        syncedAt: new Date(),
        privacyApplied: false,
      },
    });

    try {
      const redis = getRedisClient();
      await redis.set(`signal:${newSignal.id}`, JSON.stringify(newSignal), {
        ex: 3600,
      });
    } catch (e) {
      console.error("Failed to save signal to Redis:", e);
    }

    return jsonWithCors(
      { success: true, data: { signalId: newSignal.signalId } },
      request
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonWithCors(
        { success: false, error: "Invalid request body", details: error.issues },
        request,
        { status: 400 }
      );
    }
    console.error("Error creating retailer signal:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create signal" },
      request,
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const signals = await prisma.demandSignal.findMany({
      where: { source: "retailer_app" },
      orderBy: { createdAt: "desc" },
    });

    return jsonWithCors({ success: true, data: signals }, request);
  } catch (error) {
    console.error("Error fetching retailer signals:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch signals" },
      request,
      { status: 500 }
    );
  }
}
