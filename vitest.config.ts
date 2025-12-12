// eslint-disable-next-line import-x/extensions
import { defineConfig } from "vitest/config";
import dotenv from "dotenv";
import { customPool } from "./tests/pool.ts";

const { error } = dotenv.config({ path: ".env.local", quiet: true });
if (error != null) {
  // dotenv mistypes the error as `dotenv.DotenvError` but fs errors like `ENOENT` can creep in.
  const realError = error as unknown;
  if (!(realError instanceof Error) || !("code" in realError) || realError.code !== "ENOENT") {
    throw error;
  }
}

export default defineConfig({
  test: {
    typecheck: {
      tsconfig: "./tests/tsconfig.json",
      checker: "tsgo",
    },
    pool: customPool,
    maxWorkers: 1,
    isolate: false,
  },
});
