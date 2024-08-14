import type ApplicationV2 from "../client-esm/applications/api/application.mts";
import type { CustomFormInput } from "../client-esm/applications/forms/fields.mts";
import type { DataModel } from "./abstract/module.d.mts";
import type { DataField } from "./data/fields.d.mts";

declare global {
  interface DocumentConstructionContext {
    /**
     * The parent Document of this one, if this one is embedded
     * @defaultValue `null`
     */
    parent?: foundry.abstract.Document.Any | null | undefined;

    /**
     * The compendium collection ID which contains this Document, if any
     * @defaultValue `null`
     */
    pack?: string | null | undefined;

    /**
     * Whether to validate initial data strictly?
     * @defaultValue `true`
     */
    strict?: boolean | undefined;
  }

  // TODO: deprecated in V12, will be removed in V14
  // note: this was removed from this file in V12, but there are still (deprecated) methods
  //    in Document that use it, so we should retain it until V14 when those
  //    methods are removed
  /** @deprecated since v12 */
  interface DocumentModificationContext {
    /**
     * A parent Document within which these Documents should be embedded
     */
    parent?: foundry.abstract.Document.Any | undefined;

    /**
     * A Compendium pack identifier within which the Documents should be modified
     */
    pack?: string | undefined;

    /**
     * Block the dispatch of preCreate hooks for this operation
     * @defaultValue `false`
     */
    noHook?: boolean | undefined;

    /**
     * Return an index of the Document collection, used only during a get operation.
     * @defaultValue `false`
     */
    index?: boolean | undefined;

    /**
     * An array of fields to retrieve when indexing the collection
     */
    indexFields?: string[] | undefined;

    /**
     * When performing a creation operation, keep the provided _id instead of clearing it.
     * @defaultValue `false`
     */
    keepId?: boolean | undefined;

    /**
     * When performing a creation operation, keep existing _id values of documents embedded within the one being
     * created instead of generating new ones.
     * @defaultValue `true`
     */
    keepEmbeddedIds?: boolean | undefined;

    /**
     * Create a temporary document which is not saved to the database. Only used during creation.
     * @defaultValue `false`
     */
    temporary?: boolean | undefined;

    /**
     * Automatically re-render existing applications associated with the document.
     * @defaultValue `true`
     */
    render?: boolean | undefined;

    /**
     * Automatically create and render the Document sheet when the Document is first created.
     * @defaultValue `false`
     */
    renderSheet?: boolean | undefined;

    /**
     * Difference each update object against current Document data to reduce the size of the transferred data. Only
     * used during update.
     * @defaultValue `true`
     */
    diff?: boolean | undefined;

    /**
     * Merge objects recursively. If false, inner objects will be replaced explicitly. Use with caution!
     * @defaultValue `true`
     */
    recursive?: boolean | undefined;

    /**
     * Is the operation undoing a previous operation, only used by embedded Documents within a Scene
     */
    isUndo?: boolean | undefined;

    /**
     * Whether to delete all documents of a given type, regardless of the array of ids provided. Only used during a
     * delete operation.
     */
    deleteAll?: boolean | undefined;
  }

  /**
   * A single point, expressed as an object \{x, y\}
   */
  type Point = PIXI.Point | { x: number; y: number };

  /**
   * A single point, expressed as an array \[x,y\]
   */
  type PointArray = [x: number, y: number];

  /**
   * Make all properties in T recursively readonly.
   */
  /* eslint-disable prettier/prettier */   // prettier is breaking this code
  type DeepReadonly<T> = Readonly<{
    [K in keyof T]:
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-function-type */
       T[K] extends (undefined | null | boolean | number | string | symbol | bigint | Function) ? T[K] :
       T[K] extends Array<infer V> ? ReadonlyArray<DeepReadonly<V>> :
       T[K] extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> :
       T[K] extends Set<infer V> ? ReadonlySet<DeepReadonly<V>> : DeepReadonly<T[K]>
   }>
  /* eslint-enable prettier/prettier */

  /**
   * A class constructor.
   * Used for functions with generic class constructor parameters.
   */
  type Constructor = new (...args: any[]) => any;

  /**
   * A standard rectangle interface.
   */
  interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  type BuiltInTypes = typeof Number | typeof String | typeof Boolean;

  type RGBColorVector = [r: number, g: number, b: number];
  type HSVColorVector = [h: number, s: number, v: number];
  type HSLColorVector = [h: number, s: number, l: number];

  type ColorSource = number | RGBColorVector | string | Color;

  /** A Client Setting */
  interface SettingConfig<T = unknown> {
    /** A unique machine-readable id for the setting */
    key: string;

    /** The namespace the setting belongs to */
    namespace: string;

    /** The human-readable name */
    name?: string | undefined;

    /** An additional human-readable hint */
    hint?: string | undefined;

    /**
     * The scope the Setting is stored in, either World or Client
     * @defaultValue `"client"`
     */
    scope: "world" | "client";

    /** Indicates if this Setting should render in the Config application */
    config?: boolean | undefined;

    /** The type of data stored by this Setting */
    type: BuiltInTypes | DataField | DataModel<any, any>;

    /** For string Types, defines the allowable values */
    choices?: (T extends number | string ? Record<T, string> : never) | undefined;

    /** For numeric Types, defines the allowable range */
    range?:
      | (T extends number
          ? {
              max: number;
              min: number;
              step: number;
            }
          : never)
      | undefined;

    /** The default value */
    default?: T | undefined;

    /** Whether setting requires Foundry to be reloaded on change  */
    requiresReload?: boolean | undefined;

    /** Executes when the value of this Setting changes */
    onChange?: ((value: T) => void) | undefined;

    /**
     * A custom form field input used in conjunction with a DataField type
     */
    input?: CustomFormInput | undefined;
  }

  /**
   * A Client Setting Submenu
   */
  interface SettingSubmenuConfig {
    key: string;

    namespace: string;

    /** The human readable name */
    name?: string | undefined;

    /** The human readable label */
    label?: string | undefined;

    /** An additional human readable hint */
    hint?: string | undefined;

    /** The classname of an Icon to render */
    icon?: string | undefined;

    /** The FormApplication or ApplicationV2 to render */
    type:
      | (new () => FormApplication<any, any>)
      | (new (options?: DeepPartial<ApplicationV2.Configuration>) => ApplicationV2.Any);

    /** If true, only a GM can edit this Setting */
    restricted?: boolean | undefined;
  }

  /** A Client Keybinding Action Configuration */
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
    onDown?: ((ctx: KeyboardEventContext) => boolean | void) | undefined;

    /** A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute. */
    onUp?: ((ctx: KeyboardEventContext) => boolean | void) | undefined;

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

  /** A Client Keybinding Action Binding */
  interface KeybindingActionBinding {
    /** A numeric index which tracks this bindings position during form rendering */
    index?: number | undefined;

    /** The KeyboardEvent#code value from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values */
    key: string;

    /** An array of modifiers keys from KeyboardManager.MODIFIER_KEYS which are required for this binding to be activated */
    modifiers?: string[] | undefined;
  }

  /** An action that can occur when a key is pressed */
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
    onDown?: ((ctx: KeyboardEventContext) => boolean | void) | undefined;

    /** The handler that executes onUp */
    onUp?: ((ctx: KeyboardEventContext) => boolean | void) | undefined;

    /** If True, allows Repeat events to execute this Action's onDown */
    repeat: boolean;

    /** If true, only a GM can execute this Action */
    restricted: boolean;

    /** The registration precedence */
    precedence: number;

    /** The registration order */
    order: number;
  }

  /** Keyboard event context */
  interface KeyboardEventContext {
    /** The normalized string key, such as "A" */
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

    /** A list of string modifiers applied to this context, such as [ "CONTROL" ] */
    modifiers: string[];

    /** True if the Key is Up, else False if down */
    up: boolean;

    /** True if the given key is being held down such that it is automatically repeating. */
    repeat: boolean;

    /** The executing Keybinding Action. May be undefined until the action is known. */
    action?: string | undefined;
  }

  /** Connected Gamepad info */
  interface ConnectedGamepad {
    /** A map of axes values */
    axes: Map<string, number>;

    /** The Set of pressed Buttons */
    activeButtons: Set<string>;
  }

  type RequestData = Record<string, unknown> | Record<string, unknown>[] | string | string[];

  interface SocketRequest {
    /** Additional options applied to the request */
    options?: Record<string, unknown> | undefined;
    broadcast?: boolean | undefined;
  }

  interface SocketResponse {
    /**
     * The initial request
     */
    request: SocketRequest;

    /**
     * An error, if one occurred
     */
    error?: Error | undefined;

    /**
     * The status of the request
     */
    status?: string | undefined;

    /**
     * The ID of the requesting User
     */
    userId?: string | undefined;

    /**
     * Data returned as a result of the request
     */
    data?: RequestData | undefined;

    /**
     * An Array of created data objects
     */
    result?: Record<string, unknown>[] | string[] | undefined;
  }
}
