import type { Vitest } from "vitest/node";

// eslint-disable-next-line import/extensions
import { Reporter } from "vitest/reporters";
import { relative } from "pathe";
import * as fs from "fs/promises";

export default class JSONReporter implements Reporter {
  declare ctx: Vitest;

  async onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  async onFinished(files = this.ctx.state.getFiles()) {
    const fileToErrors = {};

    for (const file of files) {
      const filePath = relative(this.ctx.config.root, file.filepath);
      fileToErrors[filePath] ??= [];

      const errors =
        file.result?.errors?.map((error) => {
          if (error.nameStr != null) {
            return `${error.nameStr}: ${error.message}`;
          }

          return error.message;
        }) ?? [];

      if (errors.length > 0) {
        fileToErrors[filePath].push(...errors);
      }
    }

    try {
      await fs.mkdir("test-results");
    } catch (e) {
      if (e.code !== "EEXIST") {
        throw e;
      }
    }

    await fs.writeFile("test-results/vitest-report.json", JSON.stringify(fileToErrors));
  }
}
