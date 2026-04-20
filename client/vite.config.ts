/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    define: {
      // For legacy code requiring process.env, avoid exposing non-VITE vars.
      "process.env": {},
      "import.meta.env": env,
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
