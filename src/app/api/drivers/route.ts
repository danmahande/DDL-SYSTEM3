import prisma from "@/lib/prisma";
import { jsonWithCors } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
      include: { routes: true },
    });
    return jsonWithCors({ success: true, data: drivers }, request);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch drivers" },
      request,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const driverId = `DRV-${Date.now()}`;

    const driver = await prisma.driver.create({
      data: {
        driverId,
        name: body.name,
        phone: body.phone,
        vehicleNumber: body.vehicleNumber || null,
        licenseNumber: body.licenseNumber || null,
        photoUrl: body.photoUrl || null,
        status: body.status || "active",
      },
    });
    return jsonWithCors({ success: true, data: driver }, request);
  } catch (error) {
    console.error("Error creating driver:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create driver" },
      request,
      { status: 500 }
    );
  }
}
