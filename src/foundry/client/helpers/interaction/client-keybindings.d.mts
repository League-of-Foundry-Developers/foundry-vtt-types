import type { Brand, Identity, InexactPartial } from "#utils";
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

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _registered: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _moveTime: never;

  static MOVEMENT_DIRECTIONS: ClientKeybindings.MovementDirections;

  static ZOOM_DIRECTIONS: ClientKeybindings.ZoomDirections;

  /**
   * An alias of the movement key set tracked by the keyboard
   */
  get moveKeys(): Set<string>;

  /**
   * Initializes the keybinding values for all registered actions
   * @remarks Called just after the `setup` hook, and every time the `core.keybindings` setting changes
   */
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
   * @remarks Passing `undefined` or nothing as `bindings` deletes stored values for this key, effectively resetting to the values provided at registration
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
   * Properties of {@linkcode StoredKeybindActionConfig} that are neither computed nor provided defaults by {@linkcode ClientKeybindings.register | #register}
   * @internal
   */
  type _KeybindActionConfigOptional = InexactPartial<{
    /** An additional human readable hint */
    hint: string;

    /**
     * A function to execute when a key down event occurs. If True is returned, the event is consumed and no further keybinds execute.
     * @remarks Not passing at least one of `onUp` or `onDown` will lead to a fairly useless keybinding
     */
    onDown: (ctx: KeyboardManager.KeyboardEventContext) => boolean | void;

    /**
     * A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute.
     * @remarks Not passing at least one of `onUp` or `onDown` will lead to a fairly useless keybinding
     */
    onUp: (ctx: KeyboardManager.KeyboardEventContext) => boolean | void;

    /** If true, only a GM can edit and execute this Action */
    restricted: boolean;
  }>;

  /**
   * A Client Keybinding Action Configuration
   * @remarks The shape of stored ({@linkcode ClientKeybindings.actions | #actions}) action configs, after defaults provided by
   * {@linkcode ClientKeybindings.register | #register} are applied.
   */
  interface StoredKeybindingActionConfig extends _KeybindActionConfigOptional {
    /**
     * The namespace within which the action was registered
     * @remarks e.g `"core"`, `"my-package"`
     *
     * Not included in {@linkcode KeybindActionConfig}, as it's separated out into the first argument of {@linkcode ClientKeybindings.register | #register}
     */
    namespace: string;

    /** The human readable name */
    name: string;

    /**
     * The default bindings that can never be changed nor removed.
     * @defaultValue `[]`
     * @remarks The output of `ClientSettings##validateBindings`, run on either the value provided to {@linkcode ClientKeybindings.register | #register},
     * or `[]` if none
     */
    uneditable: KeybindingActionBinding[];

    /**
     * The default bindings that can be changed by the user.
     * @defaultValue `[]`
     * @remarks The output of `ClientSettings##validateBindings`, run on either the value provided to {@linkcode ClientKeybindings.register | #register},
     * or `[]` if none
     */
    editable: KeybindingActionBinding[];

    /**
     * If True, allows Repeat events to execute the Action's onDown. Defaults to false.
     * @defaultValue `false`
     */
    repeat: boolean;

    /**
     * Modifiers such as [ "CONTROL" ] that can be also pressed when executing this Action. Prevents using one of these modifiers as a Binding.
     * @defaultValue `[]`
     * @remarks The output of `ClientSettings##validateModifiers`, run on either the value provided to {@linkcode ClientKeybindings.register | #register},
     * or `[]` if none
     */
    reservedModifiers: string[];

    /**
     * The preferred precedence of running this Keybinding Action
     * @defaultValue {@linkcode CONST.KEYBINDING_PRECEDENCE.NORMAL}
     */
    precedence: CONST.KEYBINDING_PRECEDENCE;

    /**
     * The recorded registration order of the action
     * @remarks Always computed by {@linkcode ClientKeybindings.register | #register}; not included in {@linkcode KeybindActionConfig}
     */
    order: number;
  }

  /**
   * Omitted fields are overwritten by {@link ClientKeybindings.register | #register} regardless of passed values
   * @internal
   */
  type _PassableKeybindingActionConfig = Omit<StoredKeybindingActionConfig, "namespace" | "order">;

  /**
   * The interface to be passed to {@link ClientKeybindings.register | #register}. `name` is always required.
   * @internal
   */
  type _KeybindingActionConfig = Pick<_PassableKeybindingActionConfig, "name"> &
    InexactPartial<Pick<_PassableKeybindingActionConfig, Exclude<keyof _PassableKeybindingActionConfig, "name">>>;

  /**
   *
   */
  interface KeybindingActionConfig extends _KeybindingActionConfig {}

  /** @internal */
  type _StoredKeybindingActionBindingComputed = InexactPartial<{
    /**
     * A numeric index which tracks this bindings position during form rendering
     * @remarks Appears to never exist on stored bindings in {@linkcode ClientKeybindings.bindings | ClientKeybindings#bindings},
     * only existing on values in the `ControlsConfig##pendingEdits` private Map during a binding setting operation in the UI
     */
    index: number;
  }>;

  interface StoredKeybindingActionBinding extends _StoredKeybindingActionBindingComputed {
    /**
     * The {@linkcode KeyboardEvent.code | KeyboardEvent#code} value from {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values}
     * @remarks Registration will throw if one of {@linkcode KeyboardManager.PROTECTED_KEYS} is passed
     */
    key: string;

    /**
     * The Keyboard logical code if universal mode is enable (it is code otherwise)
     */
    logicalKey: string;

    /**
     * An array of modifiers keys from {@linkcode KeyboardManager.MODIFIER_KEYS} which are required for this binding to be activated
     * @defaultValue `[]`
     * @remarks Always provided by `ClientKeybindings##validateBindings`, which calls `##validateModifiers` with an `?? []` default
     *
     * The `keyof ... ` (UPPERCASE values) part of this union has a "For backwards compatibility" comment attached by foundry; no deprecation warning or `until` provided
     */
    modifiers: (KeyboardManager.MODIFIER_KEYS | keyof KeyboardManager.ModifierKeys)[];
  }

  /**
   * See {@linkcode _StoredKeybindingActionBindingComputed.index}
   * @internal
   */
  interface _PassableActionBinding extends Omit<StoredKeybindingActionBinding, "index"> {}

  /**
   * `modifiers` is optional because `##validateModifiers` is always called with a `?? []` default
   * @internal
   */
  type _KeybindingActionBinding = Pick<_PassableActionBinding, "key" | "logicalKey"> &
    InexactPartial<Pick<_PassableActionBinding, Exclude<keyof _PassableActionBinding, "key" | "logicalKey">>>;

  /**
   * A Client Keybinding Action Binding
   * @remarks The type passed to {@linkcode ClientKeybindings.set | ClientKeybindings#set}. All properties are optional except for `key`
   */
  interface KeybindingActionBinding extends _KeybindingActionBinding {}

  /**
   * An action that can occur when a key is pressed
   * @remarks The type generated by {@linkcode ClientKeybindings.initialize | ClientKeybindings#initialize} from registered {@linkcode ClientKeybindings.actions | actions},
   * and put into the {@linkcode ClientKeybindings.activeKeys | ClientKeybindings#activeKeys} array for its `key`.
   *
   * All keys are required because they are all provided by `#initialize`, but keys that are neither computed there nor provided defaults by
   * {@linkcode ClientKeybindings.register | ClientKeybindings#register} are `| undefined`
   */
  interface KeybindingAction {
    /**
     * The namespaced machine identifier of the Action
     * @remarks e.g `"core.target"`, `"my-package.my-action"`
     */
    action: string;

    /**
     * The Keyboard key
     * @remarks e.g `"KeyA"`, `"CapsLock"`
     */
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
