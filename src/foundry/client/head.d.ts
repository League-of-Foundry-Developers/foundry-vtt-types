export {};

declare global {
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

  let logger: typeof console;
}

type UiApplications = {
  [Key in keyof CONFIG['ui']]: InstanceType<CONFIG['ui'][Key]>;
};
