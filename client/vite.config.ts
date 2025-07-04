/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    plugins: [react()],
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: "./tests/setup.ts",
    },
    optimizeDeps: {
      exclude: ["js-big-decimal"],
    },
  };
});
