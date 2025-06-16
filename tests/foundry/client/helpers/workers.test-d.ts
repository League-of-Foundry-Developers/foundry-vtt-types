import { expectTypeOf } from "vitest";

import AsyncWorker = foundry.helpers.AsyncWorker;
import WorkerManager = foundry.helpers.WorkerManager;

const asyncWorker = new AsyncWorker("");

expectTypeOf(asyncWorker.name).toEqualTypeOf<string>();
expectTypeOf(asyncWorker.ready).toEqualTypeOf<Promise<void>>();
expectTypeOf(asyncWorker.loadFunction("", () => null)).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(asyncWorker.executeFunction("")).toEqualTypeOf<Promise<unknown>>();

expectTypeOf(AsyncWorker.WORKER_HARNESS_JS).toEqualTypeOf<string>();

const manager = new WorkerManager();

expectTypeOf(manager.createWorker("")).toEqualTypeOf<Promise<AsyncWorker>>();
expectTypeOf(manager.retireWorker("")).toEqualTypeOf<void>();

expectTypeOf(WorkerManager.WORKER_TASK_ACTIONS).toEqualTypeOf<
  Readonly<{
    INIT: "init";
    LOAD: "load";
    EXECUTE: "execute";
  }>
>();
