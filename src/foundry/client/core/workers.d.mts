import type { ValueOf } from "fvtt-types/utils";

// TODO: smarter types for named functions
declare global {
  /**
   * @deprecated {@link AsyncWorker.WorkerTask | `AsyncWorker.WorkerTask`}
   */
  type WorkerTask = AsyncWorker.WorkerTask;

  /**
   * An asynchronous web Worker which can load user-defined functions and await execution using Promises.
   * @param name    - The worker name to be initialized
   * @param options - Worker initialization options (default: `{}`)
   */
  class AsyncWorker extends Worker {
    constructor(name: string, options?: AsyncWorker.Options);

    name: string;

    /**
     * A path reference to the JavaScript file which provides companion worker-side functionality.
     * @defaultValue `"scripts/worker.js"`
     */
    static WORKER_HARNESS_JS: string;

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    loadFunction(functionName: string, functionRef: Function): Promise<unknown>;

    /**
     * Execute a task on a specific Worker.
     * @param functionName - The named function to execute on the worker. This function must first have been loaded.
     * @param args         - An array of parameters with which to call the requested function (default: `[]`)
     * @param transfer     - An array of transferable objects which are transferred to the worker thread.
     *                       See https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
     *                       (default: `[]`)
     * @returns A Promise which resolves with the returned result of the function once complete.
     */
    executeFunction(functionName: string, args?: any[], transfer?: any[]): Promise<unknown>;
  }

  namespace AsyncWorker {
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
   * @see {@link Game.workers | `Game#workers`}
   */
  class WorkerManager extends Map<string, AsyncWorker> {
    constructor();

    /**
     * Supported worker task actions
     */
    static WORKER_TASK_ACTIONS: Readonly<{
      INIT: "init";
      LOAD: "load";
      EXECUTE: "execute";
    }>;

    /**
     * Create a new named Worker.
     * @param name   - The named Worker to create
     * @param config - Worker configuration parameters passed to the AsyncWorker constructor
     * @returns The created AsyncWorker which is ready to accept tasks
     */
    createWorker(name: string, config?: AsyncWorker.Options): Promise<AsyncWorker>;

    /**
     * Retire a current Worker, terminating it immediately.
     * @see {@link Worker.terminate | `Worker#terminate`}
     * @param name - The named worker to terminate
     */
    retireWorker(name: string): void;

    /**
     * Get a currently active Worker by name.
     * @param name - The named Worker to retrieve
     * @returns The AsyncWorker instance
     * @deprecated since v11, will be removed in v13
     * @remarks `"WorkerManager#getWorker is deprecated in favor of WorkerManager#get"`
     * @remarks Throws an error if the name is not in the internal map, while `get` does not.
     */
    getWorker(name: string): AsyncWorker;
  }

  namespace AsyncWorker {
    interface Options {
      /**
       * Should the worker run in debug mode?
       * @defaultValue `false`
       */
      debug?: boolean | undefined;

      /**
       * Should the worker automatically load the primitives library?
       * @defaultValue `false`
       */
      loadPrimitives?: boolean | undefined;

      /**
       * Should the worker operates in script modes? Optional scripts.
       */
      scripts?: string[] | undefined;
    }
  }
}
