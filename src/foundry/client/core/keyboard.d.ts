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
   * The set of movement keys which were recently pressed
   */
  moveKeys: Set<string>;

  /**
   * Allowed modifier keys
   */
  static MODIFIER_KEYS: {
    CONTROL: "Control";
    SHIFT: "Shift";
    ALT: "Alt";
  };

  /**
   * Track which KeyboardEvent#code presses associate with each modifier
   */
  static MODIFIER_CODES: {
    Alt: ["AltLeft", "AltRight"];
    Control: ["ControlLeft", "ControlRight", "MetaLeft", "MetaRight"];
    Shift: ["ShiftLeft", "ShiftRight"];
  };

  /**
   * Key codes which are "protected" and should not be used because they are reserved for browser-level actions.
   */
  static PROTECTED_KEYS: ["F5", "F11", "F12", "PrintScreen", "ScrollLock", "NumLock", "CapsLock"];

  /** The OS-specific string display for what their Command key is */
  static CONTROL_KEY_STRING: "⌘" | "Control";

  /**
   * An special mapping of how special KeyboardEvent#code values should map to displayed strings or symbols.
   * Values in this configuration object override any other display formatting rules which may be applied.
   */
  static KEYCODE_DISPLAY_MAPPING: {
    ArrowLeft: "←" | "🡸";
    ArrowRight: "→" | "🡺";
    ArrowUp: "↑" | "🡹";
    ArrowDown: "↓" | "🡻";
    Backquote: "`";
    Backslash: "\\";
    BracketLeft: "[";
    BracketRight: "]";
    Comma: ",";
    Control: typeof KeyboardManager["CONTROL_KEY_STRING"];
    Equal: "=";
    MetaLeft: "⌘" | "⊞";
    MetaRight: "⌘" | "⊞";
    OsLeft: "⌘" | "⊞";
    OsRight: "⌘" | "⊞";
    Minus: "-";
    NumpadAdd: "Numpad+";
    NumpadSubtract: "Numpad-";
    Period: ".";
    Quote: "'";
    Semicolon: ";";
    Slash: "/";
  };

  /**
   * Test whether a Form Element currently has focus
   */
  get hasFocus(): boolean;

  /**
   * Emulates a key being pressed, triggering the Keyboard event workflow.
   * @param up       - If True, emulates the `keyup` Event. Else, the `keydown` event
   * @param code     - The KeyboardEvent#code which is being pressed
   * @param altKey   - Emulate the ALT modifier as pressed
   *                   (default: `false`)
   * @param ctrlKey  - Emulate the CONTROL modifier as pressed
   *                   (default: `false`)
   * @param shiftKey - Emulate the SHIFT modifier as pressed
   *                   (default: `false`)
   * @param repeat   - Emulate this as a repeat event
   *                   (default: `false`)
   */
  static emulateKeypress(
    up: boolean,
    key: string,
    {
      altKey,
      ctrlKey,
      shiftKey,
      repeat
    }?: { altKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; repeat?: boolean }
  ): KeyboardEventContext;

  /**
   * Format a KeyboardEvent#code into a displayed string.
   * @param code - The input code
   * @returns The displayed string for this code
   */
  static getKeycodeDisplayString(code: string): string;

  /**
   * Get a standardized keyboard context for a given event.
   * Every individual keypress is uniquely identified using the KeyboardEvent#code property.
   * A list of possible key codes is documented here: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
   *
   * @param event - The originating keypress event
   * @param up    - A flag for whether the key is down or up
   *                (default: `false`)
   * @returns The standardized context of the event
   */
  static getKeyboardEventContext(event: KeyboardEvent, up: boolean): KeyboardEventContext;

  /**
   * Report whether a modifier in KeyboardManager.MODIFIER_KEYS is currently actively depressed.
   * @param modifier - A modifier in MODIFIER_KEYS
   * @returns Is this modifier key currently down (active)?
   */
  isModifierActive(modifier: string): boolean;

  /**
   * Converts a Keyboard Context event into a string representation, such as "C" or "Control+C"
   * @param context          - The standardized context of the event
   * @param includeModifiers - If True, includes modifiers in the string representation
   *                           (default: `true`)
   * @internal
   */
  protected static _getContextDisplayString(context: KeyboardEventContext, includeModifiers?: boolean): string;

  /**
   * Given a standardized pressed key, find all matching registered Keybind Actions.
   * @param context - A standardized keyboard event context
   * @returns The matched Keybind Actions. May be empty.
   * @internal
   */
  static _getMatchingActions(context: KeyboardEventContext): KeybindingAction[];

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
   * @param context - The keyboard event context
   * @internal
   */
  protected _processKeyboardContext(context: KeyboardEventContext): void;

  /**
   * Reset tracking for which keys are in the down and released states
   * @internal
   */
  protected _reset(): void;

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
}
