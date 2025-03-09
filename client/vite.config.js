import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "node:process";

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement en fonction du mode
  const env = loadEnv(mode, process.cwd());

  console.log("Loaded env:", env); // Vérifie que les variables sont bien chargées

  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_HOST, // Utilisation de la variable d'environnement
          changeOrigin: true,
          secure: true,
        },
      },
    },
    plugins: [react()],
  };
});
