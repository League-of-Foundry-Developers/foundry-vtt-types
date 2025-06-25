import type { Brand, Identity, InexactPartial, IntentionalPartial } from "#utils";
import type KeyboardManager from "./keyboard-manager.d.mts";

/**
 * A class responsible for managing defined game keybinding.
 * Each keybinding is a string key/value pair belonging to a certain namespace and a certain store scope.
 *
 * When Foundry Virtual Tabletop is initialized, a singleton instance of this class is constructed within the global
 * Game object as as game.keybindings.
 *
 * @see {@linkcode foundry.Game.keybindings | Game#keybindings}
 * @see {@linkcode foundry.applications.sidebar.apps.ControlsConfig | ControlsConfig}
 */
declare class ClientKeybindings {
  constructor();

  /** Registered Keybinding actions */
  actions: Map<`${string}.${string}`, ClientKeybindings.StoredKeybindingActionConfig>;

  /** A mapping of a string key to possible Actions that might execute off it */
  activeKeys: Map<string, ClientKeybindings.KeybindingAction[]>;

  /**
   * A stored cache of Keybind Actions Ids to Bindings
   * @remarks This is only undefined before the "ready" hook.
   */
  bindings: Map<string, ClientKeybindings.StoredKeybindingActionBinding[]> | undefined;

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
   *   reservedModifiers: ["Alt"],              // If the ALT modifier is pressed, the notification is permanent instead of temporary
   *   precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
   * }
   * ```
   * @remarks
   * @throws if called after `this.bindings` has been initialized.
   */
  register(namespace: string, action: string, data: ClientKeybindings.KeybindingActionConfig): void;

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
  get(namespace: string, action: string): ClientKeybindings.StoredKeybindingActionBinding[];

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
  set(namespace: string, action: string, bindings?: ClientKeybindings.KeybindingActionBinding[]): Promise<void>;

  /** Reset all client keybindings back to their default configuration. */
  resetDefaults(): Promise<void>;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _validateBindings(values: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _validateModifiers(keys: never): never;

  /**
   * Compares two Keybinding Actions based on their Order
   * @param a - The first Keybinding Action
   * @param b - the second Keybinding Action
   * @internal
   */
  protected static _compareActions(
    a: ClientKeybindings.ActionComparison,
    b: ClientKeybindings.ActionComparison,
  ): number;

  /**
   * Register core keybindings.
   * @param view - The active game view
   */
  protected _registerCoreKeybindings(view: foundry.Game.View): void;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onSelectAllObjects(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onCycleView(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onDismiss(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onToggleCharacterSheet(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onTarget(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _handleMovement(context: never, layer: never): never;

  /** @deprecated Removed in v13 (this warning will be removed in v14) */
  protected static _onMeasuredRulerMovement(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onPause(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onHighlight(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _onPan(context: never, movementDirections: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onMacroExecute(context: never, number: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onMacroPageSwap(context: never, page: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onCopy(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onPaste(context: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onUndo(context: never): never;

  /** @deprecated Removed in v13 (this warning will be removed in v14) */
  protected static _onZoom(context: never, zoomDirection: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected static _onFocusChat(context: never): never;

  #ClientKeybindings: true;
}

declare namespace ClientKeybindings {
  interface Any extends AnyClientKeybindings {}
  interface AnyConstructor extends Identity<typeof AnyClientKeybindings> {}

  /**
   * @remarks The shape of stored ({@linkcode ClientKeybindings.actions | #actions}) action configs.
   * Any optional properties here are not provided defaults by {@link ClientKeybindings.register | #register}
   */
  interface StoredKeybindingActionConfig {
    /** The namespace within which the action was registered */
    namespace: string;

    /** The human readable name */
    name: string;

    /** An additional human readable hint */
    hint?: string;

    /**
     * The default bindings that can never be changed nor removed.
     * @defaultValue `[]`
     */
    uneditable: KeybindingActionBinding[];

    /**
     * The default bindings that can be changed by the user.
     * @defaultValue `[]`
     */
    editable: KeybindingActionBinding[];

    /** A function to execute when a key down event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onDown?: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onUp?: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /**
     * If True, allows Repeat events to execute the Action's onDown. Defaults to false.
     * @defaultValue `false`
     */
    repeat: boolean;

    /** If true, only a GM can edit and execute this Action */
    restricted?: boolean | undefined;

    /**
     * Modifiers such as [ "CONTROL" ] that can be also pressed when executing this Action. Prevents using one of these modifiers as a Binding.
     * @defaultValue `[]`
     */
    reservedModifiers: string[];

    /**
     * The preferred precedence of running this Keybinding Action
     * @defaultValue {@linkcode CONST.KEYBINDING_PRECEDENCE.NORMAL}
     */
    precedence: CONST.KEYBINDING_PRECEDENCE;

    /** The recorded registration order of the action */
    order: number;
  }

  /**
   * Omitted fields are overwritten by {@link ClientKeybindings.register | #register} regardless of passed values
   * @internal
   */
  type _PassableKeybindingActionConfig = Omit<StoredKeybindingActionConfig, "namespace" | "order">;

  /** @internal */
  type _KeybindingActionConfigInexactProps = "precedence" | "uneditable" | "editable" | "repeat" | "reservedModifiers";

  /**
   * The interface to be passed to {@link ClientKeybindings.register | #register}. `name` is always required,
   * and the properties enumerated in the `InexactPartial` have defaults provided
   * @internal
   */
  type _KeybindingActionConfig = Pick<_PassableKeybindingActionConfig, "name"> &
    InexactPartial<Pick<_PassableKeybindingActionConfig, _KeybindingActionConfigInexactProps>> &
    IntentionalPartial<Omit<_PassableKeybindingActionConfig, "name" | _KeybindingActionConfigInexactProps>>;

  /**
   * A Client Keybinding Action Configuration
   * @remarks Copied from `client/_types.mjs`
   */
  interface KeybindingActionConfig extends _KeybindingActionConfig {}

  interface StoredKeybindingActionBinding {
    /**
     * A numeric index which tracks this bindings position during form rendering
     * @remarks Appears to never exist on stored bindings in {@linkcode ClientKeybindings.bindings | ClientKeybindings#bindings},
     * only existing on values in the `ControlsConfig##pendingEdits` private Map during a binding setting operation in the UI
     */
    index?: number | undefined;

    /**
     * The KeyboardEvent#code value from {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values}
     * @remarks Registration will throw if one of {@linkcode KeyboardManager.PROTECTED_KEYS} is passed
     */
    key: string;

    /**
     * An array of modifiers keys from KeyboardManager.MODIFIER_KEYS which are required for this binding to be activated
     * @defaultValue `[]`
     * @remarks The `keyof ... ` (UPPERCASE values) part of this union has a "For backwards compatibility" comment attached by foundry; no deprecation warning or `until` provided
     */
    modifiers: (KeyboardManager.MODIFIER_KEYS | keyof KeyboardManager.ModifierKeys)[];
  }

  interface _PassableActionBinding extends Omit<StoredKeybindingActionBinding, "index"> {}

  /** @internal */
  type _KeybindingActionBinding = Pick<_PassableActionBinding, "key"> &
    InexactPartial<Omit<_PassableActionBinding, Exclude<keyof _PassableActionBinding, "key">>>;

  /**
   * A Client Keybinding Action Binding
   * @remarks Copied from `client/_types.mjs`
   */
  interface KeybindingActionBinding extends _KeybindingActionBinding {}

  /**
   * An action that can occur when a key is pressed
   * @remarks
   *
   * Copied from `client/_types.mjs`
   */
  interface KeybindingAction {
    /** The namespaced machine identifier of the Action */
    action: string;

    /** The Keyboard key */
    key: string;

    /** The human readable name */
    name: string;

    /** Required modifiers */
    requiredModifiers: KeyboardManager.MODIFIER_KEYS[];

    /** Optional (reserved) modifiers */
    optionalModifiers: KeyboardManager.MODIFIER_KEYS[];

    /** The handler that executes onDown */
    onDown: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** The handler that executes onUp */
    onUp: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** If True, allows Repeat events to execute this Action's onDown */
    repeat: boolean;

    /** If true, only a GM can execute this Action */
    restricted: boolean | undefined;

    /** The registration precedence */
    precedence: number;

    /** The registration order */
    order: number;
  }

  /**
   * @remarks The only two properties that {@linkcode ClientKeybindings._compareActions} care about.
   * Its JSDoc provides this type as an anonymous inline `Pick`, but in actual use it's always passed
   * full {@linkcode KeybindingAction}s, so it's somewhat redundant.
   */
  interface ActionComparison extends Pick<KeybindingAction, "precedence" | "order"> {}

  type MOVEMENT_DIRECTIONS = Brand<string, "ClientKeybindings.MOVEMENT_DIRECTIONS">;

  interface MovementDirections {
    UP: "up" & MOVEMENT_DIRECTIONS;
    LEFT: "left" & MOVEMENT_DIRECTIONS;
    DOWN: "down" & MOVEMENT_DIRECTIONS;
    RIGHT: "right" & MOVEMENT_DIRECTIONS;
    DESCEND: "descend" & MOVEMENT_DIRECTIONS;
    ASCEND: "ascend" & MOVEMENT_DIRECTIONS;
  }

  type ZOOM_DIRECTIONS = Brand<string, "ClientKeybindings.ZOOM_DIRECTIONS">;

  interface ZoomDirections {
    IN: "in" & ZOOM_DIRECTIONS;
    OUT: "out" & ZOOM_DIRECTIONS;
  }
}

export default ClientKeybindings;

declare abstract class AnyClientKeybindings extends ClientKeybindings {
  constructor(...args: never);
}
