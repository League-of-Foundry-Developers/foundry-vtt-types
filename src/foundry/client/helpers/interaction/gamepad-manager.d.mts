import type { Identity } from "#utils";

/**
 * Management class for Gamepad events
 */
declare class GamepadManager {
  constructor();

  /**
   * How often Gamepad polling should check for button presses
   * @defaultValue `100`
   */
  static GAMEPAD_POLLER_INTERVAL_MS: number;

  /**
   * Begin listening to gamepad events.
   * @internal
   */
  protected _activateListeners(): void;
}

declare namespace GamepadManager {
  interface Any extends AnyGamepadManager {}
  interface AnyConstructor extends Identity<typeof AnyGamepadManager> {}

  /**
   * Connected Gamepad info
   * @remarks Copied from `client/_types.mjs`
   */
  interface ConnectedGamepad {
    /** A map of axes values */
    axes: Map<string, number>;

    /** The Set of pressed Buttons */
    activeButtons: Set<string>;
  }
}

export default GamepadManager;

declare abstract class AnyGamepadManager extends GamepadManager {
  constructor(...args: never);
}
