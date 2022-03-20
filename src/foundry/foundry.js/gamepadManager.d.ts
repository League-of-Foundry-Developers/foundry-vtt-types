/** Management class for Gamepad events */
declare class GamepadManager {
  constructor();

  /**
   * @defaultValue `null`
   * @internal
   */
  protected _gamepadPoller: number | null;

  /**
   * The connected Gamepads
   * @internal
   */
  protected _connectedGamepads: Map<string, ConnectedGamepad>;

  /**
   * How often Gamepad polling should check for button presses
   * @defaultValue `100`
   */
  static GAMEPAD_POLLER_INTERVAL_MS: number;

  /**
   * Handles a Gamepad Connection event, adding its info to the poll list
   * @param event - The originating Event
   * @internal
   */
  protected _onGamepadConnect(event: GamepadEvent): void;

  /**
   * Handles a Gamepad Disconnect event, removing it from consideration for polling
   * @param event - The originating Event
   * @internal
   */
  protected _onGamepadDisconnect(event: GamepadEvent): void;

  /**
   * Polls all Connected Gamepads for updates. If they have been updated, checks status of Axis and Buttons,
   * firing off Keybinding Contexts as appropriate
   * @internal
   */
  protected _pollGamepads(): void;

  /**
   * Converts a Gamepad Input event into a KeyboardEvent, then fires it
   * @param gamepadId - The string representation of the Gamepad Input
   * @param up        - True if the Input is pressed or active
   * @param repeat    - True if the Input is being held
   *                    (default: `false`)
   * @internal
   */
  protected _handleGamepadInput(gamepadId: string, up: boolean, repeat?: boolean): void;
}
