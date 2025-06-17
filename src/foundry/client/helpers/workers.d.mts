import type { AnyArray, AnyFunction, Brand, Identity, InexactPartial, ValueOf } from "#utils";

/**
 * An asynchronous web Worker which can load user-defined functions and await execution using Promises.
 * @param name    - The worker name to be initialized
 * @param options - Worker initialization options (default: `{}`)
 */
declare class AsyncWorker extends Worker {
  constructor(name: string, options?: AsyncWorker.ConstructionOptions);

  /**
   * A path reference to the JavaScript file which provides companion worker-side functionality.
   * @defaultValue `"scripts/worker.js"`
   */
  static WORKER_HARNESS_JS: string;

  name: string;

  /**
   * A Promise which resolves once the Worker is ready to accept tasks
   */
  get ready(): Promise<void>;

  /**
   * An auto-incrementing task index.
   * @defaultValue `0`
   * @internal
   */
  protected _taskIndex: number;

  /**
   * Load a function onto a given Worker.
   * The function must be a pure function with no external dependencies or requirements on global scope.
   * @param functionName - The name of the function to load
   * @param functionRef  - A reference to the function that should be loaded
   * @returns A Promise which resolves once the Worker has loaded the function.
   */
  loadFunction(functionName: string, functionRef: AnyFunction): Promise<unknown>;

  /**
   * Execute a task on a specific Worker.
   * @param functionName - The named function to execute on the worker. This function must first have been loaded.
   * @param args         - An array of parameters with which to call the requested function (default: `[]`)
   * @param transfer     - An array of transferable objects which are transferred to the worker thread.
   *                       See {@link https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects}
   *                       (default: `[]`)
   * @returns A Promise which resolves with the returned result of the function once complete.
   */
  executeFunction(functionName: string, args?: AnyArray, transfer?: AnyArray): Promise<unknown>;

  override terminate(): void;
}

declare namespace AsyncWorker {
  interface Any extends AnyAsyncWorker {}
  interface AnyConstructor extends Identity<typeof AnyAsyncWorker> {}

  /** @internal */
  type _ConstructionOptions = InexactPartial<{
    /**
     * Should the worker run in debug mode?
     * @defaultValue `false`
     */
    debug: boolean;

    /**
     * Should the worker automatically load the primitives library?
     * @defaultValue `false`
     */
    loadPrimitives: boolean;

    /**
     * Should the worker operates in script modes? Optional scripts.
     */
    scripts: string[];
  }>;

  interface ConstructionOptions extends _ConstructionOptions {}

  interface WorkerTask {
    [key: string]: unknown;

    /** An incrementing task ID used to reference task progress */
    taskId?: number;

    /** The task action being performed, from WorkerManager.WORKER_TASK_ACTIONS */
    action: ValueOf<typeof WorkerManager.WORKER_TASK_ACTIONS>;
  }
}

/**
 * A client-side class responsible for managing a set of web workers.
 * This interface is accessed as a singleton instance via game.workers.
 * @see {@linkcode foundry.Game.workers | Game#workers}
 */
declare class WorkerManager extends Map<string, AsyncWorker> {
  /**
   * @remarks
   * @throws If {@linkcode game.workers} is already initialized
   */
  constructor();

  /**
   * Supported worker task actions
   */
  static WORKER_TASK_ACTIONS: Readonly<WorkerManager.WorkerTaskActions>;

  /**
   * Create a new named Worker.
   * @param name   - The named Worker to create
   * @param config - Worker configuration parameters passed to the AsyncWorker constructor
   * @returns The created AsyncWorker which is ready to accept tasks
   */
  createWorker(name: string, config?: AsyncWorker.ConstructionOptions): Promise<AsyncWorker>;

  /**
   * Retire a current Worker, terminating it immediately.
   * @see {@link Worker.terminate | `Worker#terminate`}
   * @param name - The named worker to terminate
   */
  retireWorker(name: string): void;
}

declare namespace WorkerManager {
  interface Any extends AnyWorkerManager {}
  interface AnyConstructor extends Identity<typeof AnyWorkerManager> {}

  type WORKER_TASK_ACTIONS = Brand<string, "WorkerManager.WORKER_TASK_ACTIONS">;

  interface WorkerTaskActions {
    INIT: "init" & WORKER_TASK_ACTIONS;
    LOAD: "load" & WORKER_TASK_ACTIONS;
    EXECUTE: "execute" & WORKER_TASK_ACTIONS;
  }
}

export { AsyncWorker, WorkerManager };

declare abstract class AnyAsyncWorker extends AsyncWorker {
  constructor(...args: never);
}

declare abstract class AnyWorkerManager extends WorkerManager {
  constructor(...args: never);
}
