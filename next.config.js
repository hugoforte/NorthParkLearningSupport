/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	// Use default .next directory for Vercel compatibility
	// distDir: ".next-build", // Commented out for Vercel deployment
};

export default config;
