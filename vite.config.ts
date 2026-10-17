import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";

const config = defineConfig({
  plugins: [
    devtools(),
    nitro({
      wasm: false,
      // Loaded from node_modules instead of bundled. Sentry (initialised in
      // src/server.ts) patches module loading with require-in-the-middle, a
      // CommonJS package that crashes every later require (pg included) when
      // bundled as ESM.
      traceDeps: ["pg", "require-in-the-middle", "import-in-the-middle"],
      preset: process.env.NETLIFY ? "netlify" : undefined,
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    sentryTanstackStart({
      org: "mir-sameer-irfan",
      project: "javascript-tanstackstart-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});

export default config;
