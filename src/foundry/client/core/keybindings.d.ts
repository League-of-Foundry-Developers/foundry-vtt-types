type InteractionLayer = unknown; // FIXME: remove when created

/**
 * A class responsible for managing defined game keybinding.
 * Each keybinding is a string key/value pair belonging to a certain namespace and a certain store scope.
 *
 * When Foundry Virtual Tabletop is initialized, a singleton instance of this class is constructed within the global
 * Game object as as game.keybindings.
 *
 * @see {@link Game.keybindings}
 * @see {@link SettingKeybindingConfig}
 * @see {@link KeybindingsConfig}
 */
declare class ClientKeybindings {
  constructor();

  /** Registered Keybinding actions */
  actions: Map<string, KeybindingActionConfig>;

  /** A mapping of a string key to possible Actions that might execute off it */
  activeKeys: Map<string, KeybindingAction[]>;

  /**
   * A stored cache of Keybind Actions Ids to Bindings
   * @remarks This is only undefined before the "ready" hook.
   */
  bindings: Map<string, KeybindingActionBinding[]> | undefined;

  /**
   * A count of how many registered keybindings there are
   * @internal
   * @defaultValue `0`
   */
  protected _registered: number;

  /**
   * A timestamp which tracks the last time a pan operation was performed
   * @internal
   * @defaultValue `0`
   */
  protected _moveTime: number;

  static MOVEMENT_DIRECTIONS: ClientKeybindings.MovementDirections;

  static ZOOM_DIRECTIONS: ClientKeybindings.ZoomDirections;

  /**
   * An alias of the movement key set tracked by the keyboard
   */
  get moveKeys(): Set<string>;

  /** Initializes the keybinding values for all registered actions */
  initialize(): void;

  /**
   * Register a new keybinding
   *
   * @param namespace - The namespace the Keybinding Action belongs to
   * @param action    - A unique machine-readable id for the Keybinding Action
   * @param data      - Configuration for keybinding data
   *
   * @example Define a keybinding which shows a notification
   * ```typescript
   * game.keybindings.register("myModule", "showNotification", {
   *   name: "My Settings Keybinding",
   *   hint: "A description of what will occur when the Keybinding is executed.",
   *   uneditable: [
   *     {
   *       key: "Digit1",
   *       modifiers: ["Control"]
   *     }
   *   ],
   *   editable: [
   *     {
   *       key: "F1"
   *     }
   *   ],
   *   onDown: () => { ui.notifications.info("Pressed!") },
   *   onUp: () => {},
   *   restricted: true,                         // Restrict this Keybinding to gamemaster only?
   *   reservedModifiers: ["Alt""],              // If the ALT modifier is pressed, the notification is permanent instead of temporary
   *   precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
   * }
   * ```
   * @throws if called after `this.bindings` has been initialized.
   */
  register(namespace: string, action: string, data: KeybindingActionConfig): void;

  /**
   * Get the current Bindings of a given namespace's Keybinding Action
   *
   * @param namespace - The namespace under which the setting is registered
   * @param action    - The keybind action to retrieve
   *
   * @example Retrieve the current Keybinding Action Bindings
   * ```typescript
   * game.keybindings.get("myModule", "showNotification");
   * ```
   */
  get(namespace: string, action: string): KeybindingActionBinding[];

  /**
   * Set the editable Bindings of a Keybinding Action for a certain namespace and Action
   *
   * @param namespace - The namespace under which the Keybinding is registered
   * @param action    - The Keybinding action to set
   * @param bindings  - The Bindings to assign to the Keybinding
   *
   * @example Update the current value of a keybinding
   * ```typescript
   * game.keybindings.set("myModule", "showNotification", [
   *     {
   *       key: "F2",
   *       modifiers: [ "CONTROL" ]
   *     }
   * ]);
   * ```
   * @remarks Passing `undefined` or nothing as `bindings` resets to the default.
   */
  set(namespace: string, action: string, bindings?: KeybindingActionBinding[] | undefined): Promise<void>;

  /** Reset all client keybindings back to their default configuration. */
  resetDefaults(): Promise<void>;

  /**
   * A helper method that, when given a value, ensures that the returned value is a standardized Binding array
   * @param values - An array of keybinding assignments to be validated
   * @returns An array of keybinding assignments confirmed as valid
   * @internal
   */
  protected static _validateBindings(values: Array<KeybindingActionBinding>): Array<Required<KeybindingActionBinding>>;

  /**
   * Validate that assigned modifiers are allowed
   * @param keys - An array of modifiers which may be valid
   * @returns An array of modifiers which are confirmed as valid
   * @internal
   */
  protected static _validateModifiers(keys: string[]): string[];

  /**
   * Compares two Keybinding Actions based on their Order
   * @param a - The first Keybinding Action
   * @param b - the second Keybinding Action
   * @internal
   */
  static _compareActions(a: KeybindingAction, b: KeybindingAction): number;

  /** Register core keybindings */
  protected _registerCoreKeybindings(): void;

  /**
   * Handle Select all action
   * @param event   - The originating keyboard event
   * @param context - The context data of the event
   * @internal
   */
  protected static _onSelectAllObjects(event?: KeyboardEvent, context?: KeyboardEventContext): boolean;

  /**
   * Handle Cycle View actions
   * @param context - The context data of the event
   * @internal
   */
  protected static _onCycleView(context: KeyboardEventContext): boolean;

  /**
   * Handle Dismiss actions
   * @param context - The context data of the event
   * @internal
   */
  protected static _onDismiss(context?: KeyboardEventContext): boolean;

  /**
   * Open Character sheet for current token or controlled actor
   * @param event   -
   * @param context - The context data of the event
   * @internal
   */
  protected static _onToggleCharacterSheet(event?: KeyboardEvent, context?: KeyboardEventContext): ActorSheet | null;

  /**
   * Handle action to target the currently hovered token.
   * @param context - The context data of the event
   * @internal
   */
  protected static _onTarget(context: KeyboardEventContext): boolean;

  /**
   * Handle DELETE Keypress Events
   * @param event   - The originating keyboard event
   * @param context - The context data of the event
   * @internal
   */
  protected static _onDelete(event: KeyboardEvent, context?: KeyboardEventContext): boolean;

  /**
   * Handle keyboard movement once a small delay has elapsed to allow for multiple simultaneous key-presses.
   * @param context - The context data of the event
   * @param layer   - The active InteractionLayer instance
   * @internal
   */
  protected _handleMovement(context: KeyboardEventContext, layer: InteractionLayer): void;

  /** Handle panning the canvas using CTRL + directional keys */
  protected _handleCanvasPan(): ReturnType<Canvas["animatePan"]>;

  /**
   * Handle Measured Ruler Movement Action
   * @param context - The context data of the event
   * @internal
   */
  protected static _onMeasuredRulerMovement(context?: KeyboardEventContext): boolean | void;

  /**
   * Handle Pause Action
   * @param context - The context data of the event
   * @internal
   */
  protected static _onPause(context?: KeyboardEventContext): true;

  /**
   * Handle Highlight action
   * @param context - The context data of the event
   * @internal
   */
  protected static _onHighlight(context?: KeyboardEventContext): boolean;

  /**
   * Handle Pan action
   * @param context            - The context data of the event
   * @param movementDirections - The Directions being panned in
   * @internal
   */
  protected _onPan(context: KeyboardEventContext, movementDirections: ClientKeybindings.MovementDirection[]): boolean;

  /**
   * Handle Macro executions
   * @param context - The context data of the event
   * @internal
   */
  protected static _onMacroExecute(
    context: KeyboardEventContext,
    number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0
  ): boolean;

  /**
   * Handle Macro page swaps
   * @param context - The context data of the event
   * @internal
   */
  protected static _onMacroPageSwap(context: KeyboardEventContext, page: number): true;

  /**
   * Handle action to copy data to clipboard
   * @param context - The context data of the event
   * @internal
   */
  protected static _onCopy(context?: KeyboardEventContext): boolean;

  /**
   * Handle Paste action
   * @param context - The context data of the event
   * @internal
   */
  protected static _onPaste(context: KeyboardEventContext): boolean;

  /**
   * Handle Undo action
   * @param context - The context data of the event
   * @internal
   */
  protected static _onUndo(context?: KeyboardEventContext): boolean;

  /**
   * Handle presses to keyboard zoom keys
   * @param context       - The context data of the event
   * @param zoomDirection - The direction to zoom
   * @internal
   */
  protected static _onZoom(
    context: KeyboardEventContext | unknown,
    zoomDirection: ClientKeybindings.ZoomDirection
  ): boolean;

  /**
   * Bring the chat window into view and focus the input
   * @param context - The context data of the event
   * @internal
   */
  static _onFocusChat(context: KeyboardEventContext): boolean;
}

declare namespace ClientKeybindings {
  type MovementDirections = {
    UP: "up";
    LEFT: "left";
    DOWN: "down";
    RIGHT: "right";
  };
  type MovementDirection = ValueOf<MovementDirections>;

  type ZoomDirections = {
    IN: "in";
    OUT: "out";
  };
  type ZoomDirection = ValueOf<ZoomDirections>;
}
