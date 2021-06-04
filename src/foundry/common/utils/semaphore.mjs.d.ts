/**
 * A simple Semaphore implementation which provides a limited queue for ensuring proper concurrency.
 *
 * @example
 * ```typescript
 * // Some async function that takes time to execute
 * function fn(x: string): Promise<string> {
 *   return new Promise(resolve => {
 *     setTimeout(() => {
 *       console.log(x);
 *       resolve(x);
 *     }, 1000));
 *   }
 * };
 *
 * // Create a Semaphore and add many concurrent tasks
 * const semaphore = new Semaphore(1);
 * for ( let i of Array.fromRange(100) ) {
 *   semaphore.add(fn, i);
 * }
 * ```
 */
declare class Semaphore {
  /**
   * @param max - The maximum number of tasks which are allowed concurrently.
   *              (default: 1)
   */
  constructor(max?: number);

  /**
   * The maximum number of tasks which can be simultaneously attempted.
   */
  max: number;

  /**
   * A queue of pending function signatures
   * @defaultValue `[]`
   * @remarks The first element of an element of `_queue` is always a function and the rest of the elements are
   * parameters to be passed to that function.
   */
  _queue: Array<Array<unknown>>;

  /**
   * The number of tasks which are currently underway
   * @defaultValue `0`
   */
  protected _active: number;

  /**
   * The number of pending tasks remaining in the queue
   */
  get remaining(): number;

  /**
   * The number of actively executing tasks
   */
  get active(): number;

  /**
   * Add a new tasks to the managed queue
   * @param fn   - A callable function
   * @param args - Function arguments
   */
  add<F extends (...args: any[]) => any>(fn: F, ...args: Parameters<F>): void;

  /**
   * Abandon any tasks which have not yet concluded
   */
  clear(): void;

  /**
   * Attempt to perform a task from the queue.
   * If all workers are busy, do nothing.
   * If successful, try again.
   * @returns Was a function called?
   */
  protected _try(): Promise<boolean>;
}

export default Semaphore;
