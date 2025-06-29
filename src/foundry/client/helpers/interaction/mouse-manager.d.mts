import type { Identity } from "#utils";

/**
 * Management class for Mouse events
 * @see {@linkcode foundry.Game.mouse | Game#mouse}
 */
declare class MouseManager {
  /**
   * @remarks
   * @throws If `game.mouse` is already initialized
   */
  constructor();

  /**
   * Specify a rate limit for mouse wheel to gate repeated scrolling.
   * This is especially important for continuous scrolling mice which emit hundreds of events per second.
   * This designates a minimum number of milliseconds which must pass before another wheel event is handled
   * @defaultValue `50`
   */
  static MOUSE_WHEEL_RATE_LIMIT: number;

  /**
   * Begin listening to mouse events.
   */
  protected _activateListeners(): void;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _onWheel(event: never): never;

  #MouseManager: true;
}

declare namespace MouseManager {
  interface Any extends AnyMouseManager {}
  interface AnyConstructor extends Identity<typeof AnyMouseManager> {}
}

export default MouseManager;

declare abstract class AnyMouseManager extends MouseManager {
  constructor(...args: never);
}
