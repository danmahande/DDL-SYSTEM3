import prisma from "@/lib/prisma";
import { jsonWithCors } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const runsheet = await prisma.route.findUnique({
      where: { id },
      include: { driver: true, stops: true, demandSignals: true },
    });
    return jsonWithCors({ success: true, data: runsheet }, request);
  } catch (error) {
    console.error("Error fetching runsheet:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch runsheet" },
      request,
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.isActive) {
      await prisma.route.updateMany({
        where: { id: { not: id }, isActive: true },
        data: { isActive: false },
      });
    }

    const runsheet = await prisma.route.update({
      where: { id },
      data: body,
    });
    return jsonWithCors({ success: true, data: runsheet }, request);
  } catch (error) {
    console.error("Error updating runsheet:", error);
    return jsonWithCors(
      { success: false, error: "Failed to update runsheet" },
      request,
      { status: 500 }
    );
  }
}
