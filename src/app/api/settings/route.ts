import prisma from "@/lib/prisma";
import { ADMIN_ROLES, jsonWithCors, requireRole } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  const auth = await requireRole(ADMIN_ROLES);
  if (auth instanceof Response) return auth;

  try {
    const settings = await prisma.setting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });

    return jsonWithCors({ success: true, data: settings }, request);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch settings" },
      request,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireRole(ADMIN_ROLES);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();

    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: {
        value: body.value,
        category: body.category,
      },
      create: {
        key: body.key,
        value: body.value,
        category: body.category || "general",
      },
    });

    return jsonWithCors({ success: true, data: setting }, request);
  } catch (error) {
    console.error("Error saving setting:", error);
    return jsonWithCors(
      { success: false, error: "Failed to save setting" },
      request,
      { status: 500 }
    );
  }
}
