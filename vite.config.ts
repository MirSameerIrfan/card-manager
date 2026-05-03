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
      traceDeps: ["pg"],
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
