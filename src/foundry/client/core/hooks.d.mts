import type { AnyFunction } from "../../../utils/index.d.mts";

export {};

declare global {
  /**
   * A simple event framework used throughout Foundry Virtual Tabletop.
   * When key actions or events occur, a "hook" is defined where user-defined callback functions can execute.
   * This class manages the registration and execution of hooked callback functions.
   */
  class Hooks {
    /**
     * A mapping of hook events which have functions registered to them.
     */
    static get events(): Hooks.HookedFunction[];

    /**
     * Register a callback handler which should be triggered when a hook is triggered.
     *
     * @param hook    - The unique name of the hooked event
     * @param fn      - The callback function which should be triggered when the hook event occurs
     * @param options - Options which customize hook registration
     * @returns An ID number of the hooked function which can be used to turn off the hook later
     */
    static on<K extends keyof Hooks.StaticCallbacks>(
      hook: K,
      fn: Hooks.StaticCallbacks[K],
      options?: Hooks.OnOptions,
    ): number;
    static on<H extends Hooks.DynamicCallbacks>(hook: string, fn: H, options?: Hooks.OnOptions): number;
    static on<H extends AnyFunction>(hook: string, fn: H, options?: Hooks.OnOptions): number;

    /**
     * Register a callback handler for an event which is only triggered once the first time the event occurs.
     * An alias for Hooks.on with `{once: true}`
     * @param hook - The unique name of the hooked event
     * @param fn   - The callback function which should be triggered when the hook event occurs
     * @returns An ID number of the hooked function which can be used to turn off the hook later
     */
    static once<K extends keyof Hooks.StaticCallbacks>(
      hook: K,
      fn: Hooks.StaticCallbacks[K],
    ): ReturnType<(typeof Hooks)["on"]>;
    static once<H extends Hooks.DynamicCallbacks>(hook: string, fn: H): ReturnType<(typeof Hooks)["on"]>;
    static once<H extends (...args: any) => any>(hook: string, fn: H): ReturnType<(typeof Hooks)["on"]>;

    /**
     * Unregister a callback handler for a particular hook event
     *
     * @param hook - The unique name of the hooked event
     * @param fn   - The function, or ID number for the function, that should be turned off
     */
    static off<K extends keyof Hooks.StaticCallbacks>(hook: K, fn: number | Hooks.StaticCallbacks[K]): void;
    static off<H extends Hooks.DynamicCallbacks>(hook: string, fn: number | H): void;
    static off<H extends (...args: any) => any>(hook: string, fn: number | H): void;

    /**
     * Call all hook listeners in the order in which they were registered
     * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
     *
     * @param hook - The hook being triggered
     * @param args - Arguments passed to the hook callback functions
     */
    static callAll<K extends keyof Hooks.StaticCallbacks>(hook: K, ...args: Parameters<Hooks.StaticCallbacks[K]>): true;
    static callAll<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): true;
    static callAll<H extends (...args: any) => any>(hook: string, ...args: Parameters<H>): true;

    /**
     * Call hook listeners in the order in which they were registered.
     * Continue calling hooks until either all have been called or one returns false.
     *
     * Hook listeners which return false denote that the original event has been adequately handled and no further
     * hooks should be called.
     *
     * @param hook - The hook being triggered
     * @param args - Arguments passed to the hook callback functions
     */
    static call<K extends keyof Hooks.StaticCallbacks>(hook: K, ...args: Parameters<Hooks.StaticCallbacks[K]>): boolean;
    static call<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): boolean;
    static call<H extends (...args: any) => any>(hook: string, ...args: Parameters<H>): boolean;

    /**
     * Notify subscribers that an error has occurred within foundry.
     * @param location - The method where the error was caught.
     * @param error    - The error.
     * @param options  - Additional options to configure behaviour.
     */
    static onError(
      location: string,
      error: Error,
      {
        msg,
        notify,
        log,
        ...data
      }?: {
        /**
         * Additional data to pass to the hook subscribers.
         * @defaultValue `{}`
         */
        [key: string]: unknown;

        /**
         * A message which should prefix the resulting error or notification.
         * @defaultValue `""`
         */
        msg?: string | undefined;

        /**
         * The level at which to log the error to console (if at all).
         * @defaultValue `null`
         */
        notify?: keyof NonNullable<(typeof ui)["notifications"]> | null | undefined;

        /**
         * The level at which to spawn a notification in the UI (if at all).
         * @defaultValue `null`
         */
        log?: keyof typeof console | null | undefined;
      },
    ): void;
  }

  namespace Hooks {
    interface HookedFunction {
      hook: string;
      id: number;
      fn: AnyFunction;
      once: boolean;
    }
  }
}
