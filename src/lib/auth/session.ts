import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET environment variable is missing or less than 32 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  adminId: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Encrypts and signs a JWT session token.
 */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  const key = getEncodedKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(key);
}

/**
 * Verifies and decodes a JWT session token.
 */
export async function decryptSession(
  sessionToken?: string
): Promise<SessionPayload | null> {
  if (!sessionToken) return null;
  try {
    const key = getEncodedKey();
    const { payload } = await jwtVerify(sessionToken, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Creates and sets the encrypted session cookie on the response.
 */
export async function createSession(adminId: string, email: string): Promise<void> {
  const token = await encryptSession({ adminId, email });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Reads and verifies the current session from incoming cookies.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(token);
}

/**
 * Deletes the session cookie to log out.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
