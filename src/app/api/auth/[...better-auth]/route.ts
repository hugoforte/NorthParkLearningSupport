export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { betterAuth } from "better-auth";
import { toNextJsHandler } from "better-auth/next-js";
import { env } from "@/env.js";
import { convexAdapter } from "@/lib/better-auth-convex-adapter";

const auth = betterAuth({
  database: convexAdapter(),
  secret: env.BETTER_AUTH_SECRET,
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
});

const handler = toNextJsHandler(auth);

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  console.log("[BetterAuth] GET request:", url.pathname, url.search);
  
  const response = await handler.GET(request);
  
  // Log response headers to see if cookies are being set
  const headers = Object.fromEntries(response.headers.entries());
  console.log("[BetterAuth] Response headers:", headers);
  
  // Check if we're setting a session cookie
  if (headers['set-cookie']) {
    console.log("[BetterAuth] Setting cookie:", headers['set-cookie']);
  }
  
  return response;
};

export const POST = async (request: Request) => {
  const url = new URL(request.url);
  console.log("[BetterAuth] POST request:", url.pathname);
  
  const response = await handler.POST(request);
  
  // Log response headers to see if cookies are being set
  const headers = Object.fromEntries(response.headers.entries());
  console.log("[BetterAuth] Response headers:", headers);
  
  // Check if we're setting a session cookie
  if (headers['set-cookie']) {
    console.log("[BetterAuth] Setting cookie:", headers['set-cookie']);
  }
  
  return response;
};


