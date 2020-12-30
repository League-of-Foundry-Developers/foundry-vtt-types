/**
 * A generic type for the Hook callback functions. The parameters differ,
 * depending on the hook. When the callback returns false, no further callbacks
 * are called, that are registered under the same Hook name or would be called
 * for other types after this callback is run. In all other cases the hooks will
 * be run.
 * @param args The arguments passed to the callback
 * @return Whether additional callbacks should be called after this
 */
declare type HookCallback = (...args: any[]) => boolean | void

/**
 * A simple event framework used throughout Foundry Virtual Tabletop.
 * When key actions or events occur, a "hook" is defined where user-defined callback functions can execute.
 * This class manages the registration and execution of hooked callback functions.
 */
declare class Hooks {
	/**
	 * Register a callback handler which should be triggered when a hook is triggered.
	 *
	 * @param hook The unique name of the hooked event
	 * @param fn   The callback function which should be triggered when the hook event occurs
	 * @return An ID number of the hooked function which can be used to turn off the hook later
	 */
	static on(hook: string, fn: HookCallback): number;

	/**
	 * Called during initialization of Foundry
	 */
	static on(hook: 'init', fn: HookCallback): number;

	/**
	 * Called during game setup
	 */
	static on(hook: 'setup', fn: HookCallback): number;

	/**
	 * Called when Foundry is ready
	 */
	static on(hook: 'ready', fn: HookCallback): number;

	/**
	 * Register a callback handler for an event which is only triggered once the first time the event occurs.
	 * After a "once" hook is triggered the hook is automatically removed.
	 *
	 * @param hook The unique name of the hooked event
	 * @param fn   The callback function which should be triggered when the hook event occurs
	 * @return An ID number of the hooked function which can be used to turn off the hook later
	 */
	static once(hook: string, fn: HookCallback): number;

	/**
	 * Called once during initialization of Foundry
	 */
	static once(hook: 'init', fn: HookCallback): number;

	/**
	 * Called once during game setup
	 */
	static once(hook: 'setup', fn: HookCallback): number;

	/**
	 * Called once when Foundry is ready
	 */
	static once(hook: 'ready', fn: HookCallback): number;

	/**
	 * Unregister a callback handler for a particular hook event
	 *
	 * @param hook The unique name of the hooked event
	 * @param fn   The function, or ID number for the function, that should be turned off
	 */
	static off(hook: string, fn: number | HookCallback): void;

	/**
	 * Call all hook listeners in the order in which they were registered
	 * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
	 *
	 * @param hook The hook being triggered
	 * @param args Arguments passed to the hook callback functions
	 */
	static callAll(hook: string, ...args: any[]): boolean | void;

	/**
	 * Call hook listeners in the order in which they were registered.
	 * Continue calling hooks until either all have been called or one returns `false`.
	 *
	 * Hook listeners which return `false` denote that the original event has been adequately handled and no further
	 * hooks should be called.
	 *
	 * @param hook The hook being triggered
	 * @param args Arguments passed to the hook callback functions
	 */
	static call(hook: string, ...args: any[]): boolean;
}
