import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@ddl.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "System Admin",
      email: adminEmail,
      password: bcrypt.hashSync(adminPassword, 10),
      role: "super_admin",
      isActive: true,
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { merchantId: "MCH-001" },
    update: {},
    create: {
      merchantId: "MCH-001",
      businessName: "Mama Johnson's Shop",
      contact: "0772123456",
      email: "mama.j@example.com",
      isActive: true,
      createdBy: admin.id,
    },
  });

  await prisma.product.upsert({
    where: { productId: "PRD-001" },
    update: {},
    create: {
      productId: "PRD-001",
      productLabel: "Soda 500ml",
      category: "Beverages",
      merchantId: merchant.merchantId,
      merchantName: merchant.businessName,
      unit: "bottle",
      minStock: 10,
      unitCost: 800,
      unitSellingPrice: 1200,
      commissionPercent: 5,
      currentStock: 245,
      isActive: true,
    },
  });

  const neighborhood = await prisma.neighborhood.upsert({
    where: { name: "Bugolobi Market" },
    update: {},
    create: {
      name: "Bugolobi Market",
      buyingPowerCategory: "HIGH",
      confidenceScore: 92,
      totalSignals: 87,
      topProductCategory: "Beverages",
      dominantPriceTier: "mid-range",
    },
  });

  await prisma.buyingPowerPrediction.create({
    data: {
      neighborhoodId: neighborhood.id,
      predictedCategory: "HIGH",
      confidenceScore: 92,
      featureVector: JSON.stringify({ orderFrequency: 0.9 }),
      modelVersion: "v1.0.0",
      accuracyScore: 84.2,
    },
  });

  await prisma.setting.upsert({
    where: { key: "app.name" },
    update: { value: "DDL Platform" },
    create: {
      key: "app.name",
      value: "DDL Platform",
      category: "general",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
