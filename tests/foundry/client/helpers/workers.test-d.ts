import { expectTypeOf } from "vitest";

import AsyncWorker = foundry.helpers.AsyncWorker;
import WorkerManager = foundry.helpers.WorkerManager;

expectTypeOf(WorkerManager.WORKER_TASK_ACTIONS).toEqualTypeOf<Readonly<WorkerManager.WorkerTaskActions>>();

const manager = new WorkerManager();

expectTypeOf(manager.createWorker("foo")).toEqualTypeOf<Promise<AsyncWorker>>();
expectTypeOf(manager.createWorker("foo", {})).toEqualTypeOf<Promise<AsyncWorker>>();
expectTypeOf(
  manager.createWorker("foo", { debug: true, loadPrimitives: false, scripts: ["some/script.js"] }),
).toEqualTypeOf<Promise<AsyncWorker>>();
expectTypeOf(
  manager.createWorker("foo", { debug: undefined, loadPrimitives: undefined, scripts: undefined }),
).toEqualTypeOf<Promise<AsyncWorker>>();

expectTypeOf(manager.retireWorker("foo")).toEqualTypeOf<void>();

expectTypeOf(AsyncWorker.WORKER_HARNESS_JS).toEqualTypeOf<string>();

new AsyncWorker("bar"); // construction options tested above via `createWorker`
const asyncWorker = await manager.createWorker("bar");

expectTypeOf(asyncWorker.name).toEqualTypeOf<string>();
expectTypeOf(asyncWorker.ready).toEqualTypeOf<Promise<void>>();
expectTypeOf(asyncWorker["_taskIndex"]).toBeNumber();

function f(p1: string) {
  return [p1, "bar"]; // it really wants a tuple return from limited runtime testing
}
const transfer: unknown[] = [];
expectTypeOf(asyncWorker.loadFunction("f", f)).toEqualTypeOf<Promise<unknown>>();
// executeFunction doesn't know what args your function needs, it'll let you not pass any
expectTypeOf(asyncWorker.executeFunction("f")).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(asyncWorker.executeFunction("f", ["some string"])).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(asyncWorker.executeFunction("f", ["some string"], transfer)).toEqualTypeOf<Promise<unknown>>();

expectTypeOf(asyncWorker.terminate()).toBeVoid();
