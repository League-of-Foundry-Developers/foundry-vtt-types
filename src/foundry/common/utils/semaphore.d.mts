import type { Identity } from "#utils";

/**
 * A simple Semaphore implementation which provides a limited queue for ensuring proper concurrency.
 *
 * @example Using a Semaphore
 * ```ts
 * // Some async function that takes time to execute
 * function fn(x) {
 *   return new Promise(resolve => {
 *     setTimeout(() => {
 *       console.log(x);
 *       resolve(x);
 *     }, 1000);
 *   });
 * }
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
   * @returns A promise that resolves once the added function is executed
   */
  add<F extends (...args: any[]) => any>(fn: F, ...args: Parameters<F>): Promise<Awaited<ReturnType<F>>>;

  /**
   * Abandon any tasks which have not yet concluded
   */
  clear(): void;

  #Semaphore: true;
}

declare namespace Semaphore {
  interface Any extends AnySemaphore {}
  interface AnyConstructor extends Identity<typeof AnySemaphore> {}
}

export default Semaphore;

declare abstract class AnySemaphore extends Semaphore {
  constructor(...args: never);
}
