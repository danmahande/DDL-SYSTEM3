import prisma from "@/lib/prisma";
import { jsonWithCors } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  try {
    const runsheets = await prisma.route.findMany({
      orderBy: { createdAt: "desc" },
      include: { driver: true, stops: true, demandSignals: true },
    });
    return jsonWithCors({ success: true, data: runsheets }, request);
  } catch (error) {
    console.error("Error fetching runsheets:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch runsheets" },
      request,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const routeId = `RTE-${Date.now()}`;

    if (body.isActive) {
      await prisma.route.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const runsheet = await prisma.route.create({
      data: {
        routeId,
        driverId: body.driverId,
        date: new Date(body.date),
        totalDistance: body.totalDistance || null,
        estimatedTime: body.estimatedTime || null,
        stopsCount: body.stopsCount || 0,
        status: body.status || "planned",
        isActive: body.isActive || false,
        optimizationData: body.optimizationData
          ? JSON.stringify(body.optimizationData)
          : null,
      },
      include: { driver: true },
    });

    return jsonWithCors({ success: true, data: runsheet }, request);
  } catch (error) {
    console.error("Error creating runsheet:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create runsheet" },
      request,
      { status: 500 }
    );
  }
}
