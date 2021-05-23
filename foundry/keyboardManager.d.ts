/**
 * A set of helpers and management functions for dealing with user input from keyboard events.
 * {@link https://keycode.info/}
 */
declare class KeyboardManager {
  /**
   * Enumerate the "digit keys"
   */
  static DIGIT_KEYS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  /**
   * Specify a rate limit for mouse wheel to gate repeated scrolling.
   * This is especially important for continuous scrolling mice which emit hundreds of events per second.
   * This designates a minimum number of milliseconds which must pass before another wheel event is handled
   */
  static MOUSE_WHEEL_RATE_LIMIT: 50;

  /**
   * Map keys used for movement
   */
  static MOVEMENT_KEYS: {
    w: ['up'];
    a: ['left'];
    s: ['down'];
    d: ['right'];
    W: ['up'];
    A: ['left'];
    S: ['down'];
    D: ['right'];
    ArrowUp: ['up'];
    ArrowRight: ['right'];
    ArrowDown: ['down'];
    ArrowLeft: ['left'];
    Numpad1: ['down', 'left'];
    Numpad2: ['down'];
    Numpad3: ['down', 'right'];
    Numpad4: ['left'];
    Numpad6: ['right'];
    Numpad7: ['up', 'left'];
    Numpad8: ['up'];
    Numpad9: ['up', 'right'];
  };

  /**
   * Map keys used for canvas zooming
   */
  static ZOOM_KEYS: {
    NumpadAdd: 'in';
    NumpadSubtract: 'out';
    PageDown: 'out';
    PageUp: 'in';
  };

  constructor();

  /**
   * The set of key codes which are currently depressed (down)
   */
  protected _downKeys: Set<string>;

  /**
   * The set of key codes which have been already handled per workflow
   */
  protected _handled: Set<string>;

  /**
   * A mapping of movement keys which are pending
   * @defaultValue `null`
   */
  protected _moveKeys: Set<string>;

  /**
   * @defaultValue `null`
   */
  protected _moveTime: number | null;

  /**
   * @defaultValue `0`
   */
  protected _tabState: 0 | 1;

  /**
   * @defaultValue `0`
   */
  protected _wheelTime: number;

  /**
   * The key codes which represent a digit key
   */
  get digitKeys(): string[];

  /**
   * Test whether an input currently has focus
   */
  get hasFocus(): boolean;

  /**
   * The key codes which represent a possible movement key
   */
  get moveKeys(): Record<string, string[]>;

  /**
   * Return the key codes used for zooming the canvas
   */
  get zoomKeys(): Record<string, string>;

  /**
   * Get a standardized keyboard code for a given event
   * @param event - The originating keypress event
   * @returns The standardized string code to use
   */
  getKey(event: KeyboardEvent): string;

  /**
   * A helper method to test whether, given an Event, the CTRL (or CMD) keys are pressed
   */
  isCtrl(event: Event): boolean;

  /**
   * Return whether the key code is currently in the DOWN state
   * @param code - key code to test
   */
  isDown(code: string): boolean;

  /**
   * Handle panning the canvas using CTRL + directional keys
   */
  protected _handleCanvasPan(): Promise<void>;

  /**
   * Delegate tracked key codes by dispatching to their various handlers
   * @param event - The keydown or keyup event
   * @param key   - The key being depressed
   * @param up    - A flag for whether the key is down or up
   */
  protected _handleKeys(event: KeyboardEvent, key: string, up: boolean): void;

  /**
   * Handle keyboard movement once a small delay has elapsed to allow for multiple simultaneous key-presses.
   */
  protected _handleMovement(event: KeyboardEvent, layer: PlaceablesLayer): void;

  /**
   * Handle ALT keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   *                    (unused)
   */
  protected _onAlt(event: KeyboardEvent, up: boolean, modifiers?: any): void;

  /**
   * Input events do not fire with isComposing = false at the end of a composition event in Chrome
   * See: https://github.com/w3c/uievents/issues/202
   */
  protected _onCompositionEnd(event: CompositionEvent): void;

  /**
   * Handle DELETE Keypress Events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onDelete(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle number key presses
   * @param event     - The original digit key press
   *                    (unused)
   * @param up        - Is it a keyup?
   * @param modifiers - What modifiers affect the keypress?
   */
  protected _onDigit(event: any, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle ESC keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onEscape(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle "A" keypress events (CTRL only) to select all objects
   * @param event     - The originating keyboard event
   *                    (unused)
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyA(event: any, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle "C" keypress events to copy data to clipboard
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyC(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle a key press into the down position
   * @param event - The originating keyboard event
   */
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * Handle a key release into the up position
   * @param event - The originating keyboard event
   */
  protected _onKeyUp(event: KeyboardEvent): void;

  /**
   * Handle "V" keypress events to paste data from clipboard
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyV(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle Z Keypress Events to generally undo previous actions
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyZ(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle presses to keyboard zoom keys
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onKeyZoom(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle movement keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onMovement(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle SPACE keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onSpace(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Handle TAB keypress events
   * @param event     - The originating keyboard event
   * @param up        - Is the key being released?
   * @param modifiers - The identified modifiers attached to this keypress
   */
  protected _onTab(event: KeyboardEvent, up: boolean, modifiers: KeyboardManager.MetaModifiers): void;

  /**
   * Master mouse-wheel event keyboard handler
   */
  protected _onWheel(event: Event): void;

  /**
   * Reset tracking for which keys are in the down and released states
   */
  protected _reset(): void;
}

declare namespace KeyboardManager {
  interface MetaModifiers {
    hasFocus: boolean;
    isAlt: boolean;
    isCtrl: boolean;
    isShift: boolean;
    key: string;
  }
}
