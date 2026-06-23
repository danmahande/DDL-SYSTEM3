import prisma from "@/lib/prisma";
import { ADMIN_ROLES, jsonWithCors, requireRole } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  const auth = await requireRole(ADMIN_ROLES);
  if (auth instanceof Response) return auth;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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

    const stats = {
      total: users.length,
      active: users.filter((user) => user.isActive).length,
      inactive: users.filter((user) => !user.isActive).length,
    };

    return jsonWithCors({ success: true, data: users, stats }, request);
  } catch (error) {
    console.error("Error fetching users:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch users" },
      request,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(ADMIN_ROLES);
  if (auth instanceof Response) return auth;

  try {
    const { name, email, password, role, isActive } = await request.json();

    if (!name || !email || !password) {
      return jsonWithCors(
        { success: false, error: "Name, email, and password are required" },
        request,
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: role || "viewer",
        isActive: isActive ?? true,
      },
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

    return jsonWithCors({ success: true, data: user }, request, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create user" },
      request,
      { status: 500 }
    );
  }
}
