// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///home/project/vite.config.ts";
var env = loadEnv("", process.cwd(), "");
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./")
    }
  },
  publicDir: "public",
  define: {
    "process.env": {
      TOGETHER_API_KEY: JSON.stringify(env.TOGETHER_API_KEY || ""),
      HELICONE_API_KEY: JSON.stringify(env.HELICONE_API_KEY || ""),
      DATABASE_URL: JSON.stringify(env.DATABASE_URL || ""),
      NODE_ENV: JSON.stringify(env.NODE_ENV || "development")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5cbmNvbnN0IGVudiA9IGxvYWRFbnYoJycsIHByb2Nlc3MuY3dkKCksICcnKVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksICcuLycpXG4gICAgfVxuICB9LFxuICBwdWJsaWNEaXI6ICdwdWJsaWMnLFxuICBkZWZpbmU6IHtcbiAgICAncHJvY2Vzcy5lbnYnOiB7XG4gICAgICBUT0dFVEhFUl9BUElfS0VZOiBKU09OLnN0cmluZ2lmeShlbnYuVE9HRVRIRVJfQVBJX0tFWSB8fCAnJyksXG4gICAgICBIRUxJQ09ORV9BUElfS0VZOiBKU09OLnN0cmluZ2lmeShlbnYuSEVMSUNPTkVfQVBJX0tFWSB8fCAnJyksXG4gICAgICBEQVRBQkFTRV9VUkw6IEpTT04uc3RyaW5naWZ5KGVudi5EQVRBQkFTRV9VUkwgfHwgJycpLFxuICAgICAgTk9ERV9FTlY6IEpTT04uc3RyaW5naWZ5KGVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnKVxuICAgIH1cbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxlQUFlO0FBSjBHLElBQU0sMkNBQTJDO0FBTW5MLElBQU0sTUFBTSxRQUFRLElBQUksUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUV6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsS0FBSyxRQUFRLGNBQWMsd0NBQWUsQ0FBQyxHQUFHLElBQUk7QUFBQSxJQUN0RTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFdBQVc7QUFBQSxFQUNYLFFBQVE7QUFBQSxJQUNOLGVBQWU7QUFBQSxNQUNiLGtCQUFrQixLQUFLLFVBQVUsSUFBSSxvQkFBb0IsRUFBRTtBQUFBLE1BQzNELGtCQUFrQixLQUFLLFVBQVUsSUFBSSxvQkFBb0IsRUFBRTtBQUFBLE1BQzNELGNBQWMsS0FBSyxVQUFVLElBQUksZ0JBQWdCLEVBQUU7QUFBQSxNQUNuRCxVQUFVLEtBQUssVUFBVSxJQUFJLFlBQVksYUFBYTtBQUFBLElBQ3hEO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
