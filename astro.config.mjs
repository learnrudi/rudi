import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://learnrudi.com",
  output: "static",
  outDir: "./dist-astro",
  build: {
    format: "directory",
  },
});
