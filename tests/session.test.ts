import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
} from "../src/lib/session";

describe("session tokens", () => {
  it("creates and verifies a signed session token", async () => {
    process.env.SESSION_SECRET = "test-secret";

    const token = await createSessionToken({
      id: "user-1",
      email: "admin@ddl.com",
      name: "Admin",
      role: "super_admin",
    });

    const session = await verifySessionToken(token);
    expect(session).not.toBeNull();
    expect(session?.email).toBe("admin@ddl.com");
    expect(session?.role).toBe("super_admin");
  });

  it("rejects tampered session tokens", async () => {
    process.env.SESSION_SECRET = "test-secret";

    const token = await createSessionToken({
      id: "user-1",
      email: "admin@ddl.com",
      name: "Admin",
      role: "viewer",
    });

    const [payload] = token.split(".");
    const tampered = `${payload}.invalid-signature`;
    const session = await verifySessionToken(tampered);
    expect(session).toBeNull();
  });
});
