import type { SerializedConfig, WorkerGlobalState } from "vitest";
// eslint-disable-next-line import-x/extensions
import { VitestTestRunner } from "vitest/runners";
import { collectTests, startTests } from "@vitest/runner";

let runner: Runner | undefined;
function setup(config: SerializedConfig) {
  // The snapshot environment will not be set up.
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

    async saveSnapshotFile(_filepath: string, _snapshot: string): Promise<void> {
      // Noop, for now.
    },

    async resolvePath(filepath: string): Promise<string> {
      return filepath;
    },

    async resolveRawPath(testPath: string, rawPath: string): Promise<string> {
      return rawPath;
    },

    async removeSnapshotFile(_filepath: string): Promise<void> {
      // Noop, for now.
    },
  };

  const state = {
    ctx: {
      // rpc: null as any,
      pool: "browser",
      workerId: 1,
      config,
      projectName: config.name ?? "",
      files: [],
      environment: {
        name: "browser",
        options: null,
      },
      // this is populated before tests run
      providedContext: {},
      invalidates: [],
    },
    // onCancel: null as any,
    config,
    environment: {
      name: "browser",
      viteEnvironment: "client",
      setup() {
        throw new Error("Not called in the browser");
      },
    },
    // onCleanup: (fn) => getBrowserState().cleanups.push(fn),
    onCleanup: () => {
      // Noop, for now.
    },
    // evaluatedModules: new EvaluatedModules(),
    // resolvingModules: new Set(),
    moduleExecutionInfo: new Map(),
    // metaEnv: null as any,
    // rpc: null as any,
    durations: {
      environment: 0,
      prepare: performance.now(),
    },
    providedContext: {},
  } as unknown as WorkerGlobalState;

  // @ts-expect-error Vitest wants this global to exist but doesn't type it.
  globalThis.__vitest_browser__ = true;
  // @ts-expect-error Vitest wants this global to exist but doesn't type it.
  globalThis.__vitest_worker__ = state;

  runner = new Runner(config);
}

class Runner extends VitestTestRunner {
  override trace = <T>(name: string, attributes: Record<string, unknown> | (() => T), cb?: () => T): T => {
    return typeof attributes === "function" ? attributes() : cb!();
  };

  override async importFile(filePath: string) {
    await import(/* @vite-ignore */ filePath);
  }

  override async onAfterRunSuite() {
    // Noop, for now.
  }
}

function getRunner() {
  if (runner == null) {
    throw new Error("Could not get runner! Setup must be run first.");
  }

  return runner;
}

window.__foundry_vitest__ = {
  setup: setup,
  run: (context) => startTests(context.files, getRunner()),
  collect: (context) => collectTests(context.files, getRunner()),
};
