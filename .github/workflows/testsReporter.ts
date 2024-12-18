import { Vitest } from "vitest/node";
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

      const errors = file.result?.errors ?? [];

      if (errors.length > 0) {
        fileToErrors[filePath] ??= [];
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
