import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import generateSitemap from "vite-plugin-pages-sitemap";

// https://vitejs.dev/config/
export default defineConfig({
  base:"",
  plugins: [
    vue(),
    Pages({
      onRoutesGenerated(routes) {
        generateSitemap({
          hostname: "https://6tentalk.com/",
          routes,
          allowRobots: true,
          exclude:['/diagnostics']
        });
      },
    }),
  ],
});
