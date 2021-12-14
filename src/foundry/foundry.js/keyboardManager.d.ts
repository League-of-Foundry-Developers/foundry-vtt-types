/**
 * A set of helpers and management functions for dealing with user input from keyboard events.
 * {@link https://keycode.info/}
 */
declare class KeyboardManager {
  constructor();

  /**
   * The set of key codes which are currently depressed (down)
   */
  downKeys: Set<string>;

  /**
   * @defaultValue `null`
   */
  protected _moveTime: number | null;

  /**
   * Enumerate the "digit keys"
   */
  static DIGIT_KEYS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  /**
   * Map keys used for movement
   */
  static MOVEMENT_KEYS: {
    W: ['up'];
    A: ['left'];
    S: ['down'];
    D: ['right'];
    ARROWUP: ['up'];
    ARROWRIGHT: ['right'];
    ARROWDOWN: ['down'];
    ARROWLEFT: ['left'];
    NUMPAD1: ['down', 'left'];
    NUMPAD2: ['down'];
    NUMPAD3: ['down', 'right'];
    NUMPAD4: ['left'];
    NUMPAD6: ['right'];
    NUMPAD7: ['up', 'left'];
    NUMPAD8: ['up'];
    NUMPAD9: ['up', 'right'];
  };

  /**
   * Map keys used for canvas zooming
   */
  static ZOOM_KEYS: {
    PAGEUP: 'in';
    PAGEDOWN: 'out';
    NUMPADADD: 'in';
    NUMPADSUBTRACT: 'out';
  };

  /** The OS-specific string display for what their Command key is */
  static CONTROL_KEY_STRING: string;

  /**
   * Reset tracking for which keys are in the down and released states
   */
  protected _reset(): void;

  /**
   * Emulates a key being pressed, triggering the Keyboard event workflow.
   * @param up  - If True, emulates the `keyup` Event. Else, the `keydown` event
   * @param key - The string Key that is being pressed
   */
  static emulateKeypress(up: boolean, key: string): void;

  /**
   * Converts a Keyboard Context event into a string representation, such as "C" or "CTRL+C"
   * @param context          - The standardized context of the event
   * @param includeModifiers - If True, includes modifiers in the string representation
   *                           (default: `true`)
   * @internal
   */
  protected static _getContextDisplayString(context: KeyboardEventContext, includeModifiers?: boolean): string;

  /**
   * Get a standardized keyboard context for a given event
   * @param event - The originating keypress event
   * @param up    - A flag for whether the key is down or up
   *                (default: `false`)
   * @returns The standardized context of the event
   */
  static getKeyboardEventContext(event: KeyboardEvent, up?: boolean): KeyboardEventContext;

  /**
   * Standardizes a string key, replacing shorthands with full values and uppercasing the string
   * @param key - The key to standardize
   * @returns The standardized key
   */
  static standardizeKey(key: string): string;

  /**
   * Given a standardized pressed key, find all matching registered Keybind Actions
   * @param context - A standardized keyboard event context
   * @returns The matched Keybind Actions. May be empty.
   */
  protected static _getMatchingKeybinds(context: KeyboardEventContext): KeybindingAction[];

  /**
   * Test whether a keypress context matches the registration for a keybinding action
   * @param action  - The keybinding action
   * @param context - The keyboard event context
   * @returns Does the context match the action requirements?
   * @internal
   */
  protected static _testContext(action: KeybindingAction, context: KeyboardEventContext): boolean;

  /**
   * Given a registered Keybinding Action, executes the action with a given event and context
   *
   * @param keybind - The registered Keybinding action to execute
   * @param context - The gathered context of the event
   * @returns Returns true if the keybind was consumed
   * @internal
   */
  protected static _executeKeybind(keybind: KeybindingAction, context: KeyboardEventContext): boolean;

  /**
   * Processes a keyboard event context, checking it against registered keybinding actions
   *
   * @param context - The keyboard event context
   * @internal
   */
  protected _processKeyboardContext(context: KeyboardEventContext): void;

  /**
   * The key codes which represent a possible movement key
   */
  get moveKeys(): KeybindingActionBinding[];

  /**
   * The key codes which represent a digit key
   */
  get digitKeys(): typeof KeyboardManager.DIGIT_KEYS;

  /**
   * Return the Bindings used for zooming the canvas
   */
  get zoomKeys(): KeybindingActionBinding[];

  /**
   * Test whether an input currently has focus
   */
  get hasFocus(): boolean;

  /**
   * Handle a key press into the down position
   * @param event - The originating keyboard event
   * @param up    - A flag for whether the key is down or up
   * @internal
   */
  protected _handleKeyboardEvent(event: KeyboardEvent, up: boolean): void;

  /**
   * Input events do not fire with isComposing = false at the end of a composition event in Chrome
   * See: https://github.com/w3c/uievents/issues/202
   */
  protected _onCompositionEnd(event: CompositionEvent): void;

  /** @deprecated since v9, will be removed in v10 */
  static get MOUSE_WHEEL_RATE_LIMIT(): number;

  /**
   * @deprecated since v9, will be removed in v10
   * A helper method to test whether, given an Event, the CTRL (or CMD, or META) keys are pressed
   * @param event - The originating event or canvas interaction
   */
  static isControl(event: KeyboardEvent | PIXI.InteractionEvent): boolean;

  /**
   * @deprecated since V9, will be removed in V10
   * Return whether the key code is currently in the DOWN state
   * @param code - The key code to test
   */
  isDown(code: string): boolean;

  /**
   * @deprecated since v9, will be removed in v10
   * @see KeyboardManager.isControl
   */
  isCtrl(event: Event | PIXI.InteractionEvent): boolean;

  /**
   * The set of key codes which are currently depressed (down)
   * @deprecated in favor of `downKeys`. Will be removed in V10.
   */
  get _downKeys(): Set<string>;
}
