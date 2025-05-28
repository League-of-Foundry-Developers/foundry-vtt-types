import type { EarlierHook, FixedInstanceType, InitializationHook } from "#utils";

type ValidRanHooks = Extract<keyof AssumeHookRan, InitializationHook>;

type _UninitializedGame = { [K in keyof foundry.Game]?: never };

interface UninitializedGame extends _UninitializedGame {}

// These type aliases are used for intellisense reasons so that the type displays `UninitializedGame | InitGame | ...` instead of a too complex looking type.
interface Games {
  none: UninitializedGame;
  init: InitGame;
  i18nInit: I18nInitGame;
  setup: SetupGame;
  ready: ReadyGame;
}

// Needs to include the current hook as well as all hooks that can run after it.
type GameHooks = Exclude<InitializationHook, EarlierHook[ValidRanHooks]>;

type MaybeUI = Extract<ValidRanHooks, "ready"> extends never ? Partial<UiApplications> : UiApplications;

declare global {
  /**
   * The string prefix used to prepend console logging
   */
  const vtt: "Foundry VTT";

  /**
   * The singleton Game instance
   * @defaultValue `{}`
   * @remarks
   * Initialized just before the `"init"` hook event.
   */
  let game: Games[GameHooks];

  /**
   * The global boolean for whether the EULA is signed
   */
  let SIGNED_EULA: boolean;

  /**
   * The global route prefix which is applied to this game
   */
  let ROUTE_PREFIX: string;

  /**
   * Critical server-side startup messages which need to be displayed to the client.
   */
  let MESSAGES:
    | {
        type: foundry.applications.ui.Notifications.Type;
        message: string;
        options: foundry.applications.ui.Notifications.NotifyOptions;
      }[]
    | null;

  interface UI {
    /**
     * @remarks
     * Initialized whenever a {@link foundry.applications.ux.ContextMenu | `ContextMenu`} is opened, deleted when it's closed again.
     */
    context?: foundry.applications.ux.ContextMenu;

    /**
     * @defaultValue `{}`
     */
    windows: Record<number, Application.Any>;
  }

  /**
   * A collection of application instances
   * @remarks
   * - All of the elements of {@linkcode ui} except for `context` and `window` are initialized between the `"setup"` and `"ready"` hook events.
   * - In the `/stream` view, only `chat` is initialized but none of the other {@linkcode Application}s.
   */
  let ui: UI & MaybeUI;

  /**
   * The client side console logger
   */
  let logger: typeof console;

  /**
   * The Color management and manipulation class
   */
  export import Color = foundry.utils.Color;
}

type UiApplications = {
  [Key in keyof CONFIG["ui"]]: FixedInstanceType<CONFIG["ui"][Key]>;
};
