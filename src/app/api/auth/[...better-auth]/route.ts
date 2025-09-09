export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { betterAuth } from "better-auth";
import { nextCookies, toNextJsHandler } from "better-auth/next-js";
import { env } from "@/env.js";
import { convexAdapter } from "@/lib/better-auth-convex-adapter";

const auth = betterAuth({
  database: convexAdapter(),
  appName: "NorthPark Learning Support",
  logger: {
    level: "debug",
  },
  onAPIError: {
    onError: (e) => {
      console.error("Better Auth API error:", e);
    },
  },
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
          },
        }
      : {}),
  },
  plugins: [nextCookies()],
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
  },
});

export const { GET, POST } = toNextJsHandler(auth);

// Extra visibility in dev
if (env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.log("[BetterAuth] API route mounted at /api/auth");
}


