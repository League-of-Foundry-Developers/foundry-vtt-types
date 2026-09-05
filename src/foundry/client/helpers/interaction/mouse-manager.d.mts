import type { Identity } from "#utils";

/**
 * Management class for Mouse events.
 * @see {@linkcode foundry.Game.mouse | Game#mouse}
 */
declare class MouseManager {
  /**
   * @remarks
   * @throws If `game.mouse` is already initialized
   */
  constructor();

  /**
   * Begin listening to mouse events.
   * @internal
   */
  protected _activateListeners(): void;

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
