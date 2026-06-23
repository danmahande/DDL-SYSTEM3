import prisma from "@/lib/prisma";
import { jsonWithCors, requireSession } from "@/lib/auth";

function getStockStatus(currentStock: number, minStock: number) {
  if (currentStock <= minStock * 0.3) return "Critical";
  if (currentStock <= minStock) return "Low Stock";
  return "In Stock";
}

export async function OPTIONS(request: Request) {
  return jsonWithCors({}, request);
}

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth instanceof Response) return auth;

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const categories = new Set(products.map((product) => product.category));
    const stockValue = products.reduce(
      (sum, product) => sum + product.currentStock * product.unitCost,
      0
    );
    const lowStock = products.filter(
      (product) => getStockStatus(product.currentStock, product.minStock) !== "In Stock"
    ).length;

    const stats = {
      total: products.length,
      lowStock,
      stockValue,
      categories: categories.size,
    };

    return jsonWithCors({ success: true, data: products, stats }, request);
  } catch (error) {
    console.error("Error fetching products:", error);
    return jsonWithCors(
      { success: false, error: "Failed to fetch products" },
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
    const productId = body.productId || `PRD-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        productId,
        productLabel: body.productLabel,
        brand: body.brand || null,
        variant: body.variant || null,
        category: body.category,
        merchantId: body.merchantId,
        merchantName: body.merchantName,
        unit: body.unit,
        minStock: body.minStock ?? 10,
        unitCost: body.unitCost,
        unitSellingPrice: body.unitSellingPrice,
        commissionPercent: body.commissionPercent ?? 0,
        currentStock: body.currentStock ?? 0,
        isActive: body.isActive ?? true,
      },
    });

    return jsonWithCors({ success: true, data: product }, request, {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return jsonWithCors(
      { success: false, error: "Failed to create product" },
      request,
      { status: 500 }
    );
  }
}
