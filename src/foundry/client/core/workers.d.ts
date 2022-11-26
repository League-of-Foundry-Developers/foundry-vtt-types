export {};

// TODO: smarter types for named functions
declare global {
  interface WorkerTask {
    [key: string]: unknown;

    /** An incrementing task ID used to reference task progress */
    taskId?: number;

    /** The task action being performed, from WorkerManager.WORKER_TASK_ACTIONS */
    action: ValueOf<typeof WorkerManager.WORKER_TASK_ACTIONS>;

    /** A Promise resolution handler */
    resolve?: VoidFunction;

    /** A Promise rejection handler */
    reject?: VoidFunction;
  }

  /**
   * An asynchronous web Worker which can load user-defined functions and await execution using Promises.
   * @param name    - The worker name to be initialized
   * @param options - Worker initialization options (default: `{}`)
   */
  class AsyncWorker extends Worker {
    constructor(name: string, options?: Partial<AsyncWorker.Options>);

    /**
     * A Promise which resolves once the Worker is ready to accept tasks
     */
    ready: Promise<void>;

    name: string;

    /**
     * A path reference to the JavaScript file which provides companion worker-side functionality.
     * @defaultValue `"scripts/worker.js"`
     */
    static WORKER_HARNESS_JS: string;

    /**
     * A queue of active tasks that this Worker is executing.
     */
    tasks: Map<number, WorkerTask>;

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
    loadFunction(functionName: string, functionRef: Function): Promise<unknown>;

    /**
     * Execute a task on a specific Worker.
     * @param functionName - The named function to execute on the worker. This function must first have been loaded.
     * @param params       - An array of parameters with which to call the requested function
     * @returns A Promise which resolves with the returned result of the function once complete.
     */
    executeFunction(functionName: string, ...params: any[]): Promise<unknown>;

    /**
     * Dispatch a task to a named Worker, awaiting confirmation of the result.
     * @param taskData - Data to dispatch to the Worker as part of the task.
     * @returns A Promise which wraps the task transaction.
     * @internal
     */
    protected _dispatchTask(taskData?: WorkerTask): Promise<unknown>;

    /**
     * Handle messages emitted by the Worker thread.
     * @param event - The dispatched message event
     * @internal
     */
    protected _onMessage(event: MessageEvent): void;

    /**
     * Handle errors emitted by the Worker thread.
     * @param error - The dispatched error event
     * @internal
     */
    protected _onError(error: ErrorEvent): void;
  }

  /**
   * A client-side class responsible for managing a set of web workers.
   * This interface is accessed as a singleton instance via game.workers.
   * @see Game#workers
   */
  class WorkerManager {
    constructor();

    /**
     * The currently active workforce.
     * @internal
     */
    protected workforce: Map<string, AsyncWorker>;

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
     * Get a currently active Worker by name.
     * @param name - The named Worker to retrieve
     * @returns The AsyncWorker instance
     */
    getWorker(name: string): AsyncWorker;

    /**
     * Retire a current Worker, terminating it immediately.
     * @see {@link Worker#terminate}
     * @param name - The named worker to terminate
     */
    retireWorker(name: string): void;
  }

  namespace AsyncWorker {
    interface Options {
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
    }
  }
}
