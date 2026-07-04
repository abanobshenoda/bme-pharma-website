import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

// ── Rate Limiter for Login Page ──────────────────────────────────────────────
// In-memory store: { ip -> { count, resetAt } }
// This is process-scoped — resets on server restart. For production at scale,
// use Redis (e.g. Upstash). For a single-server deployment this is solid.

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

type RateEntry = { count: number; resetAt: number };
const loginAttempts = new Map<string, RateEntry>();

function getIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — start fresh
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    return true;
  }

  return false;
}

// ── NextAuth middleware ───────────────────────────────────────────────────────
const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting only to the login form POST
  if (pathname === "/login" && request.method === "POST") {
    const ip = getIp(request);

    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({
          error:
            "Too many login attempts. Please wait 15 minutes before trying again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "900",
          },
        }
      );
    }
  }

  // Pass to NextAuth's auth middleware for session/redirect logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (auth as any)(request);
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
