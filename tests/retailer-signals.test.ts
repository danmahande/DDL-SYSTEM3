import { describe, expect, it } from "vitest";
import { z } from "zod";

const retailerSignalSchema = z.object({
  signalId: z.string().min(1),
  shopkeeperId: z.string().min(1),
  neighborhood: z.string().min(1),
  productCategory: z.string().min(1),
  productLabel: z.string().min(1),
  packageSize: z.string().min(1),
  priceTier: z.string().min(1),
});

describe("retailer signal schema", () => {
  it("accepts valid retailer payloads", () => {
    const parsed = retailerSignalSchema.parse({
      signalId: "SIG-001",
      shopkeeperId: "SHOP-001",
      neighborhood: "Bugolobi Market",
      productCategory: "Beverages",
      productLabel: "Soda 500ml",
      packageSize: "medium",
      priceTier: "mid-range",
    });

    expect(parsed.signalId).toBe("SIG-001");
  });

  it("rejects incomplete retailer payloads", () => {
    expect(() =>
      retailerSignalSchema.parse({
        signalId: "SIG-001",
        shopkeeperId: "SHOP-001",
      })
    ).toThrow();
  });
});
