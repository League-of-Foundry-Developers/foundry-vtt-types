import * as fs from "fs/promises";

import { BettererFileTest } from "@betterer/betterer";
// eslint-disable-next-line import-x/extensions
import { createVitest } from "vitest/node";

const tests = {
  vitestTestsImproving: () =>
    new BettererFileTest(async (_filePaths, fileTestResult) => {
      const vitest = await createVitest("test", {
        watch: false,
        typecheck: {
          enabled: true,
          only: true,
        },
      });

      await vitest.start();

      const files = vitest.state.getFiles();
      for (const vitestFile of files) {
        const errors = vitestFile.result?.errors ?? [];
        if (errors.length === 0) {
          continue;
        }

        const contents = await fs.readFile(vitestFile.filepath, "utf-8");
        const bettererFile = fileTestResult.addFile(vitestFile.filepath, contents);
        for (const error of errors) {
          const stack = error.stacks?.[0];
          bettererFile.addIssue(stack?.line ?? 0, stack?.column ?? 0, 1, error.message);
        }
      }

      await vitest.close();
    }),
};

export default tests;
