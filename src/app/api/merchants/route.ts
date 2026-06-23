import prisma from "@/lib/prisma";
import { jsonWithCors, requireSession } from "@/lib/auth";

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const merchants = await prisma.merchant.findMany({
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const stats = {
      total: merchants.length,
      active: merchants.filter((merchant) => merchant.isActive).length,
      newThisMonth: merchants.filter(
        (merchant) => merchant.createdAt >= monthStart
      ).length,
    };

    return jsonWithCors({ success: true, data: merchants, stats }, request);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch merchants" },
      request,
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const merchantId = body.merchantId || `MCH-${Date.now()}`;

    const merchant = await prisma.merchant.create({
      data: {
        merchantId,
        businessName: body.businessName,
        contact: body.contact,
        email: body.email,
        isActive: body.isActive ?? true,
        createdBy: auth.id,
      },
    });

    return jsonWithCors({ success: true, data: merchant }, request, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating merchant:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create merchant" },
      request,
      { status: 500 }
    );
  }
}
