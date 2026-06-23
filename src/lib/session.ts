export const SESSION_COOKIE = "ddl-session";
export const SESSION_MAX_AGE = 60 * 60 * 24;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is required in production");
    }
    return "dev-only-change-me-in-production";
  }
  return secret;
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return Buffer.from(signature).toString("base64url");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(
  user: Omit<SessionUser, "exp">
): Promise<string> {
  const sessionData: SessionUser = {
    ...user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const payload = Buffer.from(JSON.stringify(sessionData)).toString("base64url");
  const signature = await hmacSign(payload, getSessionSecret());
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const payload = token.slice(0, dotIndex);
    const signature = token.slice(dotIndex + 1);
    const expected = await hmacSign(payload, getSessionSecret());

    if (!timingSafeEqual(signature, expected)) return null;

    const sessionData = JSON.parse(
      Buffer.from(payload, "base64url").toString()
    ) as SessionUser;

    if (sessionData.exp < Date.now()) return null;
    return sessionData;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function toPublicSessionUser(user: SessionUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: user.exp,
  };
}
