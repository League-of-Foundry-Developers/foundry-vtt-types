// Vite doesn't understand this as an import, ironically.
/// <reference types="vite/types/importMeta.d.ts" />

// eslint-disable-next-line import-x/no-extraneous-dependencies
import { type Test, type VitestRunner, getFn, startTests } from "@vitest/runner";
import type { SerializedConfig, TestAnnotation } from "vitest";

// eslint-disable-next-line import-x/extensions
import { VitestTestRunner } from "vitest/runners";

declare global {
  interface Window {
    testWaitingForReady: {
      reset(): void;
      waitForReady(): Promise<void>;
      setReady(): void;
      testWaiting(): Promise<void>;
    };
  }
}

function createReadyWaiter() {
  const { promise: waitForReady, resolve: c } = Promise.withResolvers<void>();
  const { promise: testWaiting, resolve: startWaiting } = Promise.withResolvers<void>();

  return {
    waitForReady: () => {
      startWaiting();
      return waitForReady;
    },
    setReady: c,
    testWaiting() {
      return testWaiting;
    },
    reset() {
      const readyWaiter = createReadyWaiter();
      this.waitForReady = readyWaiter.waitForReady;
      this.setReady = readyWaiter.setReady;
      this.testWaiting = readyWaiter.testWaiting;
    },
  };
}

window.testWaitingForReady = createReadyWaiter();

const tests = import.meta.glob("/tests/**/*.test.ts");

const config = await window.__get_serialized_config__();

if (!config.snapshotOptions.snapshotEnvironment) {
  config.snapshotOptions.snapshotEnvironment = {
    getVersion(): string {
      return "1";
    },

    getHeader(): string {
      return `// Vitest Snapshot v${this.getVersion()}, https://vitest.dev/guide/snapshot.html`;
    },

    async readSnapshotFile(_filepath: string): Promise<string | null> {
      return null;
    },

    async saveSnapshotFile(_filepath: string, _snapshot: string): Promise<void> {},

    async resolvePath(filepath: string): Promise<string> {
      return filepath;
    },

    async resolveRawPath(testPath: string, rawPath: string): Promise<string> {
      return rawPath;
    },

    async removeSnapshotFile(_filepath: string): Promise<void> {},
  };
}

// @ts-expect-error - Vitest needs this global to exist but then doesn't type it.
window.__vitest_worker__ = {
  ctx: { pool: config.pool },
  config,
  onCleanup() {},
};

class Runner extends VitestTestRunner {
  constructor(
    config: SerializedConfig,
    public modules: Record<string, () => Promise<unknown>>,
  ) {
    super(config);
  }

  override async importFile(filepath: string): Promise<void> {
    const m = this.modules[filepath];
    if (m == null) {
      throw new Error(`Could not find module at ${filepath}`);
    }

    await m();
  }

  ready = false;
  setReady() {
    this.ready = true;
  }

  async runTask(test: Test): Promise<void> {
    const fn = getFn(test);
    await fn();
  }

  async onTestAnnotate(test: Test, annotation: TestAnnotation): Promise<TestAnnotation> {
    return annotation;
  }

  override onAfterRunTask(test: Test) {
    if (test.result?.errors) {
      console.log("Test failed", test.name, test.result.errors);
    }
  }

  override async onAfterRunSuite() {}
}

const runner = new Runner(config, tests);

Hooks.once("ready", () => {
  runner.setReady();

  const allTests = Object.keys(tests);
  startTests(allTests, runner as VitestRunner).then(window.__set_done__);
});

window.loadFoundry();
