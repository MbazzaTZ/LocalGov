import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// ✅ Full Vite configuration for your Tanzania Digital Gateway app
export default defineConfig({
  plugins: [
    // Enables React Fast Refresh, JSX, and TSX transformations
    react(),
  ],

  // ✅ Module resolution aliases
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // allows imports like "@/components/Button"
    },
  },

  // ✅ Development server configuration
  server: {
    port: 5173, // You can change this if you want
    open: true, // Automatically open in browser on npm run dev
    cors: true, // Enable CORS
  },

  // ✅ Build options for production
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },

  // ✅ Optimize dependencies for better startup time
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "lucide-react",
      "sonner",
    ],
  },
});
