import type { Brand, Identity } from "#utils";
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
  actions: Map<string, ClientKeybindings.KeybindingActionConfig>;

  /** A mapping of a string key to possible Actions that might execute off it */
  activeKeys: Map<string, ClientKeybindings.KeybindingAction[]>;

  /**
   * A stored cache of Keybind Actions Ids to Bindings
   * @remarks This is only undefined before the "ready" hook.
   */
  bindings: Map<string, ClientKeybindings.KeybindingActionBinding[]> | undefined;

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
  get(namespace: string, action: string): ClientKeybindings.KeybindingActionBinding[];

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

  /**
   * Compares two Keybinding Actions based on their Order
   * @param a - The first Keybinding Action
   * @param b - the second Keybinding Action
   * @internal
   */
  static _compareActions(a: ClientKeybindings.ActionComparison, b: ClientKeybindings.ActionComparison): number;

  /**
   * Register core keybindings.
   * @param view - The active game view
   */
  protected _registerCoreKeybindings(view: foundry.Game.View): void;

  #ClientKeybindings: true;
}

declare namespace ClientKeybindings {
  interface Any extends AnyClientKeybindings {}
  interface AnyConstructor extends Identity<typeof AnyClientKeybindings> {}

  /**
   * A Client Keybinding Action Configuration
   * @remarks Copied from `resources/app/common/types.mjs`
   */
  interface KeybindingActionConfig {
    /** The namespace within which the action was registered */
    namespace?: string;

    /** The human readable name */
    name: string;

    /** An additional human readable hint */
    hint?: string | undefined;

    /** The default bindings that can never be changed nor removed. */
    uneditable?: KeybindingActionBinding[] | undefined;

    /** The default bindings that can be changed by the user. */
    editable?: KeybindingActionBinding[] | undefined;

    /** A function to execute when a key down event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onDown?: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onUp?: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** If True, allows Repeat events to execute the Action's onDown. Defaults to false. */
    repeat?: boolean | undefined;

    /** If true, only a GM can edit and execute this Action */
    restricted?: boolean | undefined;

    /** Modifiers such as [ "CONTROL" ] that can be also pressed when executing this Action. Prevents using one of these modifiers as a Binding. */
    reservedModifiers?: string[] | undefined;

    /** The preferred precedence of running this Keybinding Action */
    precedence?: number | undefined; // TODO: KEYBINDING_PRECEDENCE?

    /** The recorded registration order of the action */
    order?: number | undefined;
  }

  /**
   * A Client Keybinding Action Binding
   * @remarks Copied from `resources/app/common/types.mjs`
   */
  interface KeybindingActionBinding {
    /** A numeric index which tracks this bindings position during form rendering */
    index?: number | undefined;

    /** The KeyboardEvent#code value from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values */
    key: string;

    /** An array of modifiers keys from KeyboardManager.MODIFIER_KEYS which are required for this binding to be activated */
    modifiers?: string[] | undefined;
  }

  /**
   * An action that can occur when a key is pressed
   * @remarks Copied from `client/_types.mjs`
   */
  interface KeybindingAction {
    /** The namespaced machine identifier of the Action */
    action: string;

    /** The Keyboard key */
    key: string;

    /** The human readable name */
    name: string;

    /** Required modifiers */
    requiredModifiers: string[];

    /** Optional (reserved) modifiers */
    optionalModifiers: string[];

    /** The handler that executes onDown */
    onDown?: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** The handler that executes onUp */
    onUp?: ((ctx: KeyboardManager.KeyboardEventContext) => boolean | void) | undefined;

    /** If True, allows Repeat events to execute this Action's onDown */
    repeat: boolean;

    /** If true, only a GM can execute this Action */
    restricted: boolean;

    /** The registration precedence */
    precedence: number;

    /** The registration order */
    order: number;
  }

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
