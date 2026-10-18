import { defineConfig } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

// The unit tests only need the @/ alias. Loading vite.config.ts instead starts
// the app's plugins (Nitro, TanStack Start), which keep vitest from exiting.
export default defineConfig({
  plugins: [viteTsConfigPaths()],
});
