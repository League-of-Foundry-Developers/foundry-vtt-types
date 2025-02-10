import type { Vitest } from "vitest/node";
import type { Reporter } from "vitest/reporters";
import { relative } from "pathe";
import * as fs from "fs/promises";

export default class JSONReporter implements Reporter {
  declare ctx: Vitest;

  onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  async onFinished(files = this.ctx.state.getFiles()) {
    const fileToErrors: Record<string, string[]> = {};

    for (const file of files) {
      const filePath = relative(this.ctx.config.root, file.filepath);

      const errors = fileToErrors[filePath] ?? [];
      fileToErrors[filePath] = errors;

      const errorMessages =
        file.result?.errors?.map((error) => {
          if (error.nameStr != null) {
            return `${error.nameStr}: ${error.message}`;
          }

          return error.message;
        }) ?? [];

      errors.push(...errorMessages);
    }

    try {
      await fs.mkdir("test-results");
    } catch (e) {
      if (!(e instanceof Error && "code" in e && e.code !== "EEXIST")) {
        throw e;
      }
    }

    await fs.writeFile("test-results/vitest-report.json", JSON.stringify(fileToErrors));
  }
}
