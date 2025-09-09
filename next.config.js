/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	// Avoid Windows EPERM on locked .next by using custom distDir
	distDir: ".next-build",
};

export default config;
