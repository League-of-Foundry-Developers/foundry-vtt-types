import type { AnyFunction, Identity, InexactPartial } from "#utils";
import type { Hooks as HookConfig } from "#configuration";

/**
 * A simple event framework used throughout Foundry Virtual Tabletop.
 * When key actions or events occur, a "hook" is defined where user-defined callback functions can execute.
 * This class manages the registration and execution of hooked callback functions.
 * @remarks TODO: Evaluate if this should remove from declare global - complicated by interaction with `src/foundry/client/hooks.d.mts`
 */
declare global {
  class Hooks {
    /**
     * A mapping of hook events which have functions registered to them.
     */
    static get events(): Record<string, Hooks.HookedFunction[]>;

    /**
     * Register a callback handler which should be triggered when a hook is triggered.
     *
     * @param hook    - The unique name of the hooked event
     * @param fn      - The callback function which should be triggered when the hook event occurs
     * @param options - Options which customize hook registration
     * @returns An ID number of the hooked function which can be used to turn off the hook later
     */
    static on<K extends Hooks.HookName>(hook: K, fn: Hooks.Function<K>, options?: Hooks.OnOptions): number;

    /**
     * @deprecated These hooks are now designed to be automatically inferred.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    static on<H extends Hooks.DynamicCallbacks>(hook: string, fn: H, options?: Hooks.OnOptions): number;

    /**
     * @deprecated This hook has been deprecated. See the hook's definition for more details.
     */
    static on<K extends keyof HookConfig.DeprecatedHookConfig>(
      hook: K,
      fn: HookConfig.DeprecatedHookConfig[K],
      options?: Hooks.OnOptions,
    ): number;

    /**
     * @deprecated Please merge into {@linkcode HookConfig.HookConfig | "fvtt-types/configuration/Hooks.HookConfig"} instead.
     */
    static on<H extends AnyFunction>(hook: string, fn: H, options?: Hooks.OnOptions): number;

    /**
     * Register a callback handler for an event which is only triggered once the first time the event occurs.
     * An alias for Hooks.on with `{once: true}`
     * @param hook - The unique name of the hooked event
     * @param fn   - The callback function which should be triggered when the hook event occurs
     * @returns An ID number of the hooked function which can be used to turn off the hook later
     */
    static once<K extends Hooks.HookName>(hook: K, fn: Hooks.Function<K>): number;

    /**
     * @deprecated These hooks are now designed to be automatically inferred.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    static once<H extends Hooks.DynamicCallbacks>(hook: string, fn: H): number;

    /**
     * @deprecated This hook has been deprecated. See the hook's definition for more details.
     */
    static once<K extends keyof HookConfig.DeprecatedHookConfig>(
      hook: K,
      fn: HookConfig.DeprecatedHookConfig[K],
      options?: Hooks.OnOptions,
    ): number;

    static once<H extends AnyFunction>(hook: string, fn: H): number;

    /**
     * Unregister a callback handler for a particular hook event
     *
     * @param hook - The unique name of the hooked event
     * @param fn   - The function, or ID number for the function, that should be turned off
     */
    static off<K extends Hooks.HookName>(hook: K, fn: number | Hooks.Function<K>): void;

    /**
     * @deprecated These hooks are now designed to be automatically inferred.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    static off<H extends Hooks.DynamicCallbacks>(hook: string, fn: number | H): void;

    /**
     * @deprecated This hook has been deprecated. See the hook's definition for more details.
     */
    static off<K extends keyof HookConfig.DeprecatedHookConfig>(
      hook: K,
      fn: number | HookConfig.DeprecatedHookConfig[K],
      options?: Hooks.OnOptions,
    ): void;

    /**
     * @deprecated Please merge into {@linkcode HookConfig.HookConfig | "fvtt-types/configuration/Hooks.HookConfig"} instead.
     */
    static off<H extends AnyFunction>(hook: string, fn: number | H): void;

    /**
     * Call all hook listeners in the order in which they were registered
     * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
     *
     * @param hook - The hook being triggered
     * @param args - Arguments passed to the hook callback functions
     */
    static callAll<K extends Hooks.HookName>(hook: K, ...args: Hooks.HookParameters<K>): true;

    /**
     * @deprecated These hooks are now designed to be automatically inferred.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    static callAll<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): true;

    /**
     * @deprecated This hook has been deprecated. See the hook's definition for more details.
     */
    static callAll<K extends keyof HookConfig.DeprecatedHookConfig>(
      hook: K,
      ...args: Parameters<HookConfig.DeprecatedHookConfig[K]>
    ): true;

    /**
     * @deprecated Please merge into {@linkcode HookConfig.HookConfig | "fvtt-types/configuration/Hooks.HookConfig"} instead.
     */
    static callAll<H extends (...args: unknown[]) => unknown>(hook: string, ...args: Parameters<H>): true;

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
    static call<K extends Hooks.HookName>(hook: K, ...args: Hooks.HookParameters<K>): boolean;

    /**
     * @deprecated These hooks are now designed to be automatically inferred.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    static call<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): boolean;

    /**
     * @deprecated This hook has been deprecated. See the hook's definition for more details.
     */
    static call<K extends keyof HookConfig.DeprecatedHookConfig>(
      hook: K,
      ...args: Parameters<HookConfig.DeprecatedHookConfig[K]>
    ): boolean;

    /**
     * @deprecated Please merge into {@linkcode HookConfig.HookConfig | "fvtt-types/configuration/Hooks.HookConfig"} instead.
     */
    static call<H extends (...args: unknown[]) => unknown>(hook: string, ...args: Parameters<H>): boolean;

    /**
     * Notify subscribers that an error has occurred within foundry.
     * @param location - The method where the error was caught.
     * @param error    - The error.
     * @param options  - Additional options to configure behaviour.
     */
    static onError(location: string, error: Error, { msg, notify, log, ...data }?: Hooks.OnError): void;
  }

  namespace Hooks {
    interface Any extends AnyHooks {}
    interface AnyConstructor extends Identity<typeof AnyHooks> {}

    type _OnOptions = InexactPartial<{
      /** Only trigger the hooked function once */
      once: boolean;
    }>;

    interface OnOptions extends _OnOptions {}

    type HookName = keyof HookConfig.HookConfig;
    type Function<K extends HookName> = HookConfig.HookConfig[K];
    type HookParameters<K extends HookName> = Parameters<Function<K>>;

    interface HookedFunction {
      hook: string;
      id: number;
      fn: AnyFunction;
      once: boolean;
    }

    interface OnError {
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
      notify?: keyof NonNullable<typeof ui.notifications> | null | undefined;

      /**
       * The level at which to spawn a notification in the UI (if at all).
       * @defaultValue `null`
       */
      log?: keyof typeof console | null | undefined;
    }
  }
}

export default Hooks;

declare abstract class AnyHooks extends Hooks {
  constructor(...args: never);
}
