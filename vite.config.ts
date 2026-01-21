import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // 👇 Vite project root
  root: path.resolve(__dirname, "client"),

  plugins: [
    react(),
  ],

  // 👇 Path aliases (MATCHES root = client)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },

  // 👇 Build output (Vercel-safe)
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },

  // 👇 Local dev only (Vercel ignores this)
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
