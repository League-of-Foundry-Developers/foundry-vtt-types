/**
 * A set of helpers and management functions for dealing with user input from
 * keyboard events.
 * {@link https://keycode.info/}
 */
declare class KeyboardManager {
  /**
   * Enumerate the "digit keys"
   * @defaultValue `['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']`
   */
  DIGIT_KEYS: string[]

  /**
   * Specify a rate limit for mouse wheel to gate repeated scrolling.
   * This is especially important for continuous scrolling mice which emit
   * hundreds of events per second.
   * This designates a minimum number of milliseconds which must pass before
   * another wheel event is handled
   * @defaultValue `50`
   */
  MOUSE_WHEEL_RATE_LIMIT: number

  /**
   * Map keys used for movement
   */
  MOVEMENT_KEYS: Record<string, string[]>

  /**
   * Map keys used for canvas zooming
   */
  ZOOM_KEYS: Record<string, string>

  /**
   * The set of key codes which have been already handled per workflow
   */
  _handled: Set<string>

  /**
   * A mapping of movement keys which are pending
   * @internal
   */
  _moveKeys: Set<string>

  _moveTime: number

  _tabState: number

  _wheelTime: number

  constructor ()

  /**
   * Test whether an input currently has focus
   */
  get hasFocus (): boolean

  /**
   * The key codes which represent a possible movement key
   */
  get moveKeys (): Record<string, string[]>

  /**
   * Return the key codes used for zooming the canvas
   */
  get zoomKeys (): Record<string, string>

  /**
   * Handle panning the canvas using CTRL + directional keys
   */
  _handleCanvasPan (): Promise<void>

  /**
   * Delegate tracked key codes by dispatching to their various handlers
   * @param event - The keydown or keyup event
   * @param key - The key being depressed
   * @param up - A flag for whether the key is down or up
   * @internal
   */
  _handleKeys (event: KeyboardEvent, key: string, up: boolean): void

  /**
   * Handle keyboard movement once a small delay has elapsed to allow for
   * multiple simultaneous key-presses.
   * @internal
   */
  _handleMovement (event: KeyboardEvent, layer: PlaceablesLayer): void

  /**
   * Handle ALT keypress events
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   *                    (unused)
   * @internal
   */
  _onAlt (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Input events do not fire with isComposing = false at the end of a
   * composition event in Chrome
   * See: https://github.com/w3c/uievents/issues/202
   */
  _onCompositionEnd (event: CompositionEvent): void

  /**
   * Handle DELETE Keypress Events
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onDelete (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle number key presses
   * @param event - The original digit key press
   *                (unused)
   * @param up - Is it a keyup?
   * @param modifiers - What modifiers affect the keypress?
   * @internal
   */
  _onDigit (
    event: Event,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle ESC keypress events
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onEscape (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle "A" keypress events (CTRL only) to select all objects
   * @param event - The originating keyboard event
   *                (unused)
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onKeyA (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle "C" keypress events to copy data to clipboard
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onKeyC (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle a key press into the down position
   * @param event - The originating keyboard event
   * @internal
   */
  _onKeyDown (event: KeyboardEvent): void

  /**
   * Handle a key release into the up position
   * @param event - The originating keyboard event
   * @internal
   */
  _onKeyUp (event: KeyboardEvent): void

  /**
   * Handle "V" keypress events to paste data from clipboard
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onKeyV (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle Z Keypress Events to generally undo previous actions
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onKeyZ (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle presses to keyboard zoom keys
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onKeyZoom (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle movement keypress events
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onMovement (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle SPACE keypress events
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onSpace (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Handle TAB keypress events
   * @param event - The originating keyboard event
   * @param up - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   * @internal
   */
  _onTab (
    event: KeyboardEvent,
    up: boolean,
    modifiers: KeyboardManager.MetaModifiers
  ): void

  /**
   * Master mouse-wheel event keyboard handler
   * @internal
   */
  _onWheel (event: Event): void

  /**
   * Reset tracking for which keys are in the down and released states
   * @internal
   */
  _reset (): void

  /**
   * Get a standardized keyboard code for a given event
   * @param event - The originating keypress event
   * @returns The standardized string code to use
   */
  getKey (event: KeyboardEvent): string

  /**
   * A helper method to test whether, given an Event, the CTRL (or CMD) keys are
   * pressed
   */
  isCtrl (event: Event): boolean

  /**
   * Return whether the key code is currently in the DOWN state
   * @param code - key code to test
   */
  isDown (code: string): boolean
}

declare namespace KeyboardManager {
  interface MetaModifiers {
    hasFocus: boolean
    isAlt: boolean
    isCtrl: boolean
    isShift: boolean
    key: string
  }
}
