import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: { output: { manualChunks: undefined } }
  },
  server: {
    port: 5173,
    open: true,
    host: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    historyApiFallback: true      // 👈 prevents 404s on /dashboard, /admin, etc.
  },
  preview: {
    port: 8080,
    host: true,
    historyApiFallback: true      // 👈 same for `vite preview`
  },
  define: { "process.env": process.env },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "date-fns",
      "lucide-react",
      "sonner"
    ]
  }
});
