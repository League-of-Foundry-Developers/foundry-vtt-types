/**
 * The lenient variety of global variables defining everything up front.
 *
 * TODO: Add more documentation here to describe as necessary.
 */
declare global {
  let vtt: 'Foundry VTT';

  /**
   * @defaultValue `{}`
   * @remarks
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let game: Game;

  /**
   * @defaultValue `null`
   * @remarks
   * Initialized between the `'DOMContentLoaded'` event and the `'init'` hook event.
   */
  let socket: io.Socket;

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
    [Key in keyof CONFIG['ui']]: InstanceType<CONFIG['ui'][Key]>;
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
  let canvas: Canvas;

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

export {};
