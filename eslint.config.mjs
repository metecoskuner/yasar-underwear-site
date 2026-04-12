import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".vercel/**",
    "out/**",
    "build/**",
    // ignore backup copy directory used in this workspace
    "backup/**",
    "next-env.d.ts",
    // ignore utility scripts (use CommonJS, not TypeScript)
    "scripts/**",
    "*.js",
    "check-db-and-run-dev.js",
  ]),
]);

export default eslintConfig;
