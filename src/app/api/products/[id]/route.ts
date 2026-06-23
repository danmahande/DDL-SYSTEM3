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

    const product = await prisma.product.update({
      where: { id },
      data: body,
    });

    return jsonWithCors({ success: true, data: product }, request);
  } catch (error) {
    console.error("Error updating product:", error);
    return jsonWithCors(
      { success: false, error: "Failed to update product" },
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
    await prisma.product.delete({ where: { id } });
    return jsonWithCors({ success: true }, request);
  } catch (error) {
    console.error("Error deleting product:", error);
    return jsonWithCors(
      { success: false, error: "Failed to delete product" },
      request,
      { status: 500 }
    );
  }
}
