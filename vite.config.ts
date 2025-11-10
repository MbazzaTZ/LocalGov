import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ✅ Vite Configuration for LocalGov Portal
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    host: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // 🚀 Important: Prevents 404 on React Router paths like /dashboard, /admin, /staff
    historyApiFallback: true,
  },
  preview: {
    port: 8080,
    host: true,
    // 👇 Also apply fallback behavior for preview server
    historyApiFallback: true,
  },
  define: {
    "process.env": process.env,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "date-fns",
      "lucide-react",
      "sonner",
    ],
  },
});
