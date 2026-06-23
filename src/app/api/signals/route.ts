import prisma from "@/lib/prisma";
import { jsonWithCors } from "@/lib/auth";
import type { DemandSignal, Prisma } from "@prisma/client";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const neighborhood = searchParams.get("neighborhood");
    const urgency = searchParams.get("urgency");
    const recent = searchParams.get("recent") === "true";

    const where: Prisma.DemandSignalWhereInput = {};
    if (category) where.productCategory = category;
    if (neighborhood) where.neighborhood = neighborhood;
    if (urgency) where.urgency = urgency;
    if (recent) {
      where.createdAt = {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };
    }

    const signals = await prisma.demandSignal.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: signals.length,
      pending: signals.filter((s: DemandSignal) => s.status === "pending")
        .length,
      active: signals.filter((s: DemandSignal) =>
        ["assigned", "in_transit"].includes(s.status)
      ).length,
      delivered: signals.filter((s: DemandSignal) => s.status === "delivered")
        .length,
    };

    return jsonWithCors(
      {
        success: true,
        data: signals,
        stats,
      },
      request
    );
  } catch (error) {
    console.error("Error fetching signals:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch signals" },
      request,
      { status: 500 }
    );
  }
}
