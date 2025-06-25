import type { Brand, Identity, InexactPartial } from "#utils";
import type ClientKeybindings from "./client-keybindings.mjs";

/**
 * A set of helpers and management functions for dealing with user input from keyboard events.
 * {@link https://keycode.info/}
 * @see {@linkcode foundry.Game.keyboard | Game#keyboard}
 */
declare class KeyboardManager {
  /**
   * @remarks
   * @throws If `game.keyboard` is already initialized
   */
  constructor();

  /**
   * Begin listening to keyboard events.
   */
  protected _activateListeners(): void;

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
  static MODIFIER_KEYS: KeyboardManager.ModifierKeys;

  /**
   * Track which KeyboardEvent#code presses associate with each modifier
   * @defaultValue
   * ```js
   * {
   *   Alt: ["AltLeft", "AltRight"];
   *   Control: ["ControlLeft", "ControlRight", "MetaLeft", "MetaRight", "Meta", "OsLeft", "OsRight"];
   *   Shift: ["ShiftLeft", "ShiftRight"];
   * }
   * ```
   */
  static MODIFIER_CODES: KeyboardManager.ModifierCodes;

  /**
   * Key codes which are "protected" and should not be used because they are reserved for browser-level actions.
   * @defaultValue `["F5", "F11", "F12", "PrintScreen", "ScrollLock", "NumLock", "CapsLock"]`
   */
  static PROTECTED_KEYS: string[];

  /**
   * The OS-specific string display for what their Command key is
   * @defaultValue `navigator.appVersion.includes("Mac") ? "⌘" : "Control"`
   */
  static CONTROL_KEY_STRING: string;

  /**
   * A special mapping of how special KeyboardEvent#code values should map to displayed strings or symbols.
   * Values in this configuration object override any other display formatting rules which may be applied.
   * @defaultValue
   * ```js
   * {
   *   ArrowLeft: "⬅",
   *   ArrowRight: "➡",
   *   ArrowUp: "⬆",
   *   ArrowDown: "⬇",
   *   Backquote: "`",
   *   Backslash: "\\",
   *   BracketLeft: "[",
   *   BracketRight: "]",
   *   Comma: ",",
   *   Control: this.CONTROL_KEY_STRING,
   *   Equal: "=",
   *   Meta: isMac ? "⌘" : "⊞",
   *   MetaLeft: isMac ? "⌘" : "⊞",
   *   MetaRight: isMac ? "⌘" : "⊞",
   *   OsLeft: isMac ? "⌘" : "⊞",
   *   OsRight: isMac ? "⌘" : "⊞",
   *   Minus: "-",
   *   NumpadAdd: "Numpad+",
   *   NumpadSubtract: "Numpad-",
   *   Period: ".",
   *   Quote: "'",
   *   Semicolon: ";",
   *   Slash: "/"
   * }
   * ```
   */
  static KEYCODE_DISPLAY_MAPPING: Record<string, string>;

  /**
   * Determines whether an `HTMLElement` currently has focus, which may influence keybinding actions.
   *
   * An element is considered to have focus if:
   * 1. It has a `dataset.keyboardFocus` attribute explicitly set to `"true"` or an empty string (`""`).
   * 2. It is an `<input>`, `<select>`, or `<textarea>` element, all of which inherently accept keyboard input.
   * 3. It has the `isContentEditable` property set to `true`, meaning it is an editable element.
   * 4. It is a `<button>` element inside a `<form>`, which suggests interactive use.
   *
   * An element is considered **not** focused if:
   * 1. There is no currently active element (`document.activeElement` is not an `HTMLElement`).
   * 2. It has a `dataset.keyboardFocus` attribute explicitly set to `"false"`.
   *
   * If none of these conditions are met, the element is assumed to be unfocused.
   */
  get hasFocus(): boolean;

  /**
   * Emulates a key being pressed, triggering the Keyboard event workflow.
   * @param up   - If True, emulates the `keyup` Event. Else, the `keydown` event
   * @param code - The {@linkcode KeyboardEvent.code | KeyboardEvent#code} which is being pressed
   */
  static emulateKeypress(
    up: boolean,
    key: string,
    options?: KeyboardManager.EmulateKeypressOptions,
  ): KeyboardManager.KeyboardEventContext;

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
   * @param up    - A flag for whether the key is down or up (default: `false`)
   * @returns The standardized context of the event
   */
  static getKeyboardEventContext(event: KeyboardEvent, up?: boolean): KeyboardManager.KeyboardEventContext;

  /**
   * Report whether a modifier in KeyboardManager.MODIFIER_KEYS is currently actively depressed.
   * @param modifier - A modifier in MODIFIER_KEYS
   * @returns Is this modifier key currently down (active)?
   */
  isModifierActive(modifier: keyof KeyboardManager.ModifierKeys): boolean;

  /**
   * Report whether a core action key is currently actively depressed.
   * @param action - The core action to verify (ex: "target")
   * @returns Is this core action key currently down (active)?
   */
  isCoreActionKeyActive(action: string): boolean;

  /** @deprecated Removed in v13 (this warning will be removed in v14) */
  protected static _getContextDisplayString(context: never, includeModifiers: never): never;

  /**
   * Given a standardized pressed key, find all matching registered Keybind Actions.
   * @param context - A standardized keyboard event context
   * @returns The matched Keybind Actions. May be empty.
   * @internal
   */
  protected static _getMatchingActions(
    context: KeyboardManager.KeyboardEventContext,
  ): ClientKeybindings.KeybindingAction[];

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _testContext(action: never, context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _executeKeybind(keybind: never, context: never): never;

  /**
   * Processes a keyboard event context, checking it against registered keybinding actions
   * @param context - The keyboard event context
   * @internal
   */
  protected _processKeyboardContext(
    context: KeyboardManager.KeyboardEventContext,
    options?: KeyboardManager.ProcessKeyboardContextOptions,
  ): void;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _reset(): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _handleKeyboardEvent(event: never, up: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _onCompositionEnd(event: never): never;

  /**
   * Emulate a key-up event for any currently down keys. When emulating, we go backwards such that combinations such as
   * "CONTROL + S" emulate the "S" first in order to capture modifiers.
   * @param force - Force the keyup events to be handled.
   */
  releaseKeys(options?: KeyboardManager.ReleaseKeysOptions): void;

  /**
   * Release any down keys when focusing a form element.
   * @param event - The focus event.
   */
  protected _onFocusIn(event: FocusEvent): void;

  #KeyboardManager: true;
}

declare namespace KeyboardManager {
  interface Any extends AnyKeyboardManager {}
  interface AnyConstructor extends Identity<typeof AnyKeyboardManager> {}

  type MODIFIER_KEYS = Brand<string, "KeyboardManager.MODIFIER_KEYS">;

  interface ModifierKeys {
    CONTROL: "Control" & MODIFIER_KEYS;
    SHIFT: "Shift" & MODIFIER_KEYS;
    ALT: "Alt" & MODIFIER_KEYS;
  }

  interface ModifierCodes {
    Alt: string[];
    Control: string[];
    Shift: string[];
  }

  /** @internal */
  type _EmulateKeypressOptions = InexactPartial<{
    /**
     * Emulate the ALT modifier as pressed
     * @defaultValue `false`
     */
    altKey: boolean;

    /**
     * Emulate the CONTROL modifier as pressed
     * @defaultValue `false`
     */
    ctrlKey: boolean;

    /**
     * Emulate the SHIFT modifier as pressed
     * @defaultValue `false`
     */
    shiftKey: boolean;

    /**
     * Emulate this as a repeat event
     * @defaultValue `false`
     */
    repeat: boolean;

    /**
     * Force the event to be handled.
     * @defaultValue `false`
     */
    force: boolean;
  }>;

  interface EmulateKeypressOptions extends _EmulateKeypressOptions {}

  /**
   * Keyboard event context
   * @remarks Copied from `client/_types.mjs`
   */
  interface KeyboardEventContext {
    /** The normalized string key, such as "KeyA" */
    key: string;

    /** The originating keypress event */
    event: KeyboardEvent;

    /** Is the Shift modifier being pressed */
    isShift: boolean;

    /** Is the Control or Meta modifier being processed */
    isControl: boolean;

    /** Is the Alt modifier being pressed */
    isAlt: boolean;

    /** Are any of the modifiers being pressed */
    hasModifier: boolean;

    /** A list of string modifiers applied to this context, such as ["CONTROL"] */
    modifiers: string[];

    /** True if the Key is Up, else False if down */
    up: boolean;

    /** True if the given key is being held down such that it is automatically repeating. */
    repeat: boolean;

    /** The executing Keybinding Action. May be undefined until the action is known. */
    action?: string | undefined;
  }

  interface ProcessKeyboardContextOptions extends Pick<EmulateKeypressOptions, "force"> {}

  type _ReleaseKeysOptions = InexactPartial<{
    /**
     * Force the keyup events to be handled.
     * @defaultValue `true`
     */
    force: boolean;
  }>;

  interface ReleaseKeysOptions extends _ReleaseKeysOptions {}
}

export default KeyboardManager;

declare abstract class AnyKeyboardManager extends KeyboardManager {
  constructor(...args: never);
}
