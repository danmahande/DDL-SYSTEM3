import prisma from "@/lib/prisma";
import { ADMIN_ROLES, jsonWithCors, requireRole } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(ADMIN_ROLES);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.name) data.name = body.name;
    if (body.email) data.email = body.email;
    if (body.role) data.role = body.role;
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (body.password) data.password = bcrypt.hashSync(body.password, 10);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return jsonWithCors({ success: true, data: user }, request);
  } catch (error) {
    console.error("Error updating user:", error);
    return jsonWithCors(
      { success: false, error: "Failed to update user" },
      request,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(ADMIN_ROLES);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return jsonWithCors({ success: true }, request);
  } catch (error) {
    console.error("Error deleting user:", error);
    return jsonWithCors(
      { success: false, error: "Failed to delete user" },
      request,
      { status: 500 }
    );
  }
}
