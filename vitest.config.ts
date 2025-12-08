// eslint-disable-next-line import-x/extensions
import { defineConfig } from "vitest/config";
import { customPool } from "./tests/pool.ts";

export default defineConfig({
  test: {
    typecheck: {
      tsconfig: "./tests/tsconfig.json",
      checker: "tsgo",
    },
    pool: customPool,
  },
});
