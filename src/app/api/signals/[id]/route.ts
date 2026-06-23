import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { jsonWithCors } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status) updateData.status = body.status;
    if (body.driverId) {
      updateData.driverId = body.driverId;
      updateData.status = "assigned";
      updateData.assignedAt = new Date();
    }
    if (body.routeId) updateData.routeId = body.routeId;

    const updatedSignal = await prisma.demandSignal.update({
      where: { id },
      data: updateData,
    });

    return jsonWithCors({ success: true, data: updatedSignal }, request);
  } catch (error) {
    console.error("Error updating signal:", error);
    return jsonWithCors(
      { success: false, error: "Failed to update signal" },
      request,
      { status: 500 }
    );
  }
}
