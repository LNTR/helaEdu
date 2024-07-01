import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "./src/pages/"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
      "@styles": path.resolve(__dirname, "./src/styles/"),
      "@utils": path.resolve(__dirname, "./src/utils/"),
      "@components": path.resolve(__dirname, "./src/components/"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
