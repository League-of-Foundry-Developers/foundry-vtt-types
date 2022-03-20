declare global {
  /**
   * Some global variables (such as {@link game}) are only initialized after certain events have happened during the
   * initialization of Foundry VTT. For that reason, the correct types for these variables include the types for the
   * uninitialized state.
   *
   * While this is correct from a type checking perspective, it can be inconvenient to have to type guard these global
   * variables everywhere. Some users might prefer the convenience over the 100% correctness in type checking.
   *
   * For this reason, this interface provides a way for users to configure certain global variables to be typed more
   * leniently, i.e., as the types of their initialized state. This is done via declaration merging. To configure a
   * specific global variable to be typed leniently, the user simply needs to merge a property with the name of the
   * variable into this interface (the type doesn't matter).
   *
   * The currently supported variables are:
   * - {@link game}
   * - {@link socket}
   * - {@link ui}
   * - {@link canvas}
   *
   * @example
   * ```typescript
   * declare global {
   *   interface LenientGlobalVariableTypes {
   *     game: never; // the type doesn't matter
   *   }
   * }
   *
   * const referenceToGame: Game = game; // ok! :)
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface LenientGlobalVariableTypes {}

  let vtt: 'Foundry VTT';

  /**
   * @defaultValue `{}`
   * @remarks
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let game: 'game' extends keyof LenientGlobalVariableTypes ? Game : Game | {};

  /**
   * @defaultValue `null`
   * @remarks
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let socket: 'socket' extends keyof LenientGlobalVariableTypes ? io.Socket : io.Socket | null;

  /**
   * A collection of application instances
   * @remarks
   * - All of the elements of {@link ui} except for `context` and `window` are initialized between the `'setup'` and `'ready'` hook events.
   * - In the `/stream` view, only `chat` is initialized but none of the other {@link Application}s.
   */
  let ui: {
    /**
     * @remarks
     * Initialized whenever a {@link ContextMenu} is opened, deleted when it's closed again.
     */
    context?: ContextMenu;

    /**
     * @defaultValue `{}`
     */
    windows: Record<number, Application>;
  } & ('ui' extends keyof LenientGlobalVariableTypes ? UiApplications : Partial<UiApplications>);

  /** The client-side console is the default logger  */
  let logger: typeof console;

  /**
   * @defaultValue `undefined`
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let canvas: 'canvas' extends keyof LenientGlobalVariableTypes ? Canvas : Canvas | undefined;

  /**
   * A "secret" global to help debug attributes of the currently controlled Token.
   * This is only for debugging, and may be removed in the future, so it's not safe to use.
   */
  let _token: InstanceType<CONFIG['Token']['objectClass']> | null;

  /*
   * Global Variables
   * The following variables are declared directly in foundry's HTML file (or more concretely, in `main.hbs`)
   */

  const SIGNED_EULA: boolean;

  const ROUTE_PREFIX: string;

  const MESSAGES:
    | { type: Notifications.Notification['type']; message: string; options: Notifications.Options }[]
    | null;
}

type UiApplications = {
  [Key in keyof CONFIG['ui']]: InstanceType<CONFIG['ui'][Key]>;
};

export {};
