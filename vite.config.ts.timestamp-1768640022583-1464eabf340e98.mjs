// vite.config.ts
import { defineConfig } from "file:///C:/Users/hp/OneDrive/Desktop/tradesense-ai-hub-main/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/hp/OneDrive/Desktop/tradesense-ai-hub-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/hp/OneDrive/Desktop/tradesense-ai-hub-main/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\hp\\OneDrive\\Desktop\\tradesense-ai-hub-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      react: path.resolve(__vite_injected_original_dirname, "node_modules/react"),
      "react-dom": path.resolve(__vite_injected_original_dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__vite_injected_original_dirname, "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(
        __vite_injected_original_dirname,
        "node_modules/react/jsx-dev-runtime"
      )
    },
    dedupe: ["react", "react-dom"]
  },
  optimizeDeps: {
    include: ["lightweight-charts"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxocFxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXHRyYWRlc2Vuc2UtYWktaHViLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGhwXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcdHJhZGVzZW5zZS1haS1odWItbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvaHAvT25lRHJpdmUvRGVza3RvcC90cmFkZXNlbnNlLWFpLWh1Yi1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgfSxcbiAgcGx1Z2luczogW3JlYWN0KCksIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKV0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgcmVhY3Q6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwibm9kZV9tb2R1bGVzL3JlYWN0XCIpLFxuICAgICAgXCJyZWFjdC1kb21cIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJub2RlX21vZHVsZXMvcmVhY3QtZG9tXCIpLFxuICAgICAgXCJyZWFjdC9qc3gtcnVudGltZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIm5vZGVfbW9kdWxlcy9yZWFjdC9qc3gtcnVudGltZVwiKSxcbiAgICAgIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCI6IHBhdGgucmVzb2x2ZShcbiAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICBcIm5vZGVfbW9kdWxlcy9yZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIlxuICAgICAgKSxcbiAgICB9LFxuICAgIGRlZHVwZTogW1wicmVhY3RcIiwgXCJyZWFjdC1kb21cIl0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcImxpZ2h0d2VpZ2h0LWNoYXJ0c1wiXSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsU0FBUyxvQkFBb0I7QUFDcFgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLE9BQU8sS0FBSyxRQUFRLGtDQUFXLG9CQUFvQjtBQUFBLE1BQ25ELGFBQWEsS0FBSyxRQUFRLGtDQUFXLHdCQUF3QjtBQUFBLE1BQzdELHFCQUFxQixLQUFLLFFBQVEsa0NBQVcsZ0NBQWdDO0FBQUEsTUFDN0UseUJBQXlCLEtBQUs7QUFBQSxRQUM1QjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLEVBQy9CO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsb0JBQW9CO0FBQUEsRUFDaEM7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
