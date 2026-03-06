import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ✅ FIX 1: Set base path for GitHub Pages
  // If your repo is "username/repo-name", set base to "/repo-name/"
  // If using a custom domain (irtiqastem.org via CNAME), set to "/"
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://ofxkdahgdgunzaxflijs.supabase.co"),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9meGtkYWhnZGd1bnpheGZsaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjE2NzYsImV4cCI6MjA4ODA5NzY3Nn0.c-ecJMNDL-nXfqKwSu8lHUFdvH67RNuhXOugozuu2RE"),
    'import.meta.env.VITE_SUPABASE_PROJECT_ID': JSON.stringify("ofxkdahgdgunzaxflijs"),
  },
}));
