import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

// Unit tests run in Node against the pure library logic (no DOM). The "@/"
// alias mirrors tsconfig so tests import modules the same way the app does.
export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globals: false,
  },
});
