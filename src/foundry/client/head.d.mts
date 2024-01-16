export {};

declare global {
  /**
   * The string prefix used to prepend console logging
   */
  const vtt: "Foundry VTT";

  /**
   * The singleton Game instance
   * @defaultValue `{}`
   * @remarks
   * Initialized between the `"DOMContentLoaded"` event and the `"init"` hook event.
   */
  let game: "game" extends keyof LenientGlobalVariableTypes ? Game : Game | {};

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
    | { type: Notifications.Notification["type"]; message: string; options: Notifications.NotifyOptions }[]
    | null;

  /**
   * A collection of application instances
   * @remarks
   * - All of the elements of {@link ui} except for `context` and `window` are initialized between the `"setup"` and `"ready"` hook events.
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
  } & ("ui" extends keyof LenientGlobalVariableTypes ? UiApplications : Partial<UiApplications>);

  /**
   * The client side console logger
   */
  let logger: typeof console;

  /**
   * The Color management and manipulation class
   */
  let Color: foundry.utils.Color;
}

type UiApplications = {
  [Key in keyof CONFIG["ui"]]: InstanceType<CONFIG["ui"][Key]>;
};
