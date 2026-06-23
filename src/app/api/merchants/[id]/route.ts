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

    const merchant = await prisma.merchant.update({
      where: { id },
      data: {
        businessName: body.businessName,
        contact: body.contact,
        email: body.email,
        isActive: body.isActive,
      },
    });

    return jsonWithCors({ success: true, data: merchant }, request);
  } catch (error) {
    console.error("Error updating merchant:", error);
    return jsonWithCors(
      { success: false, error: "Failed to update merchant" },
      request,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    await prisma.merchant.delete({ where: { id } });
    return jsonWithCors({ success: true }, request);
  } catch (error) {
    console.error("Error deleting merchant:", error);
    return jsonWithCors(
      { success: false, error: "Failed to delete merchant" },
      request,
      { status: 500 }
    );
  }
}
