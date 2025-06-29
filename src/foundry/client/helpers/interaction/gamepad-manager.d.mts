import type { Identity } from "#utils";

/**
 * Management class for Gamepad events
 */
declare class GamepadManager {
  constructor();

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _gamepadPoller: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _connectedGamepads: never;

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

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _onGamepadConnect(event: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _onGamepadDisconnect(event: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _pollGamepads(event: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _handleGamepadInput(gamepadId: never, up: never, repeat: never): never;
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
