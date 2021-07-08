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
  } & {
    [Key in keyof CONFIG['ui']]?: InstanceType<CONFIG['ui'][Key]>;
  };

  /** The client-side console is the default logger  */
  let logger: typeof console;

  /**
   * @deprecated since 0.8.0
   * You are referencing the FEATURES object which has been deprecated as it is no longer an agreed-upon method for how to track evolution of the Foundry Virtual Tabletop API. Discussion about alternate approaches is actively ongoing within the League of Developers community. For the time being the recommendation is to test against game.data.version to understand the current Foundry VTT version which is active. The FEATURES object will be removed in 0.9.0.
   */
  let FEATURES: {
    readonly ACTIVE_EFFECTS: 2;
    readonly ACTORS: 3;
    readonly AUDIO_VIDEO: 2;
    readonly CHAT: 3;
    readonly COMBAT: 3;
    readonly COMPENDIUM: 3;
    readonly DICE: 2;
    readonly DRAWINGS: 3;
    readonly ENTITIES: 5;
    readonly GRID: 2;
    readonly ITEMS: 3;
    readonly JOURNAL: 2;
    readonly LIGHTING: 3;
    readonly LOCALIZATION: 2;
    readonly MACROS: 2;
    readonly NOTES: 2;
    readonly PLAYLISTS: 2;
    readonly ROLL_TABLES: 2;
    readonly SETTINGS: 3;
    readonly SOUND: 2;
    readonly TEMPLATES: 2;
    readonly TILES: 3;
    readonly TOKENS: 4;
    readonly WALLS: 3;
  };

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
}

export {};
