// eslint-disable-next-line import-x/extensions
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    typecheck: {
      tsconfig: "./tests/tsconfig.json",
    },
  },
});
