/**
 * A single point, expressed as an object \{x, y\}
 */
declare type Point = PIXI.Point | { x: number; y: number };

/**
 * A single point, expressed as an array \[x,y\]
 */
declare type PointArray = [x: number, y: number];

/**
 * A standard rectangle interface.
 */
declare type Rectangle =
  | PIXI.Rectangle
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    };

/** A Client Keybinding Action Configuration */
declare interface KeybindingActionConfig {
  /** The namespace within which the action was registered */
  namespace?: string;

  /** The human readable name */
  name: string;

  /** An additional human readable hint */
  hint?: string;

  /** The default bindings that can never be changed nor removed. */
  uneditable?: KeybindingActionBinding[];

  /** The default bindings that can be changed by the user. */
  editable?: KeybindingActionBinding[];

  /** A function to execute when a key down event occurs. If True is returned, the event is consumed and no further keybinds execute. */
  onDown?: () => boolean | void;

  /** A function to execute when a key up event occurs. If True is returned, the event is consumed and no further keybinds execute. */
  onUp?: () => boolean | void;

  /** If True, allows Repeat events to execute the Action's onDown. Defaults to false. */
  repeat?: boolean;

  /** If true, only a GM can edit and execute this Action */
  restricted?: boolean;

  /** Modifiers such as [ "CONTROL" ] that can be also pressed when executing this Action. Prevents using one of these modifiers as a Binding. */
  reservedModifiers?: string[];

  /** The preferred precedence of running this Keybinding Action */
  precedence?: number; // TODO: KEYBINDING_PRECEDENCE?

  /** The recorded registration order of the action */
  order?: number;
}

/** A Client Keybinding Action Binding */
declare interface KeybindingActionBinding {
  /** The Keyboard key that matches this binding */
  key: string;

  /** A list of string modifiers required to match this binding, such as [ "CONTROL" ] */
  modifiers?: string[];
}

declare interface KeybindingAction {
  action: string;
  key: string;
  name: string;
  requiredModifiers: string[];
  optionalModifiers: string[];
  onDown: Function;
  onUp: Function;
  repeat: boolean;
  restricted: boolean;
  precedence: number;
  order: number;
}

/** Keyboard event context */
declare interface KeyboardEventContext {
  /** The normalized string key, such as "A" */
  key: string;

  /** The executing Keybinding Action */
  action: string;

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
}

type RequestData = object | object[] | string | string[];

interface SocketRequest {
  /**
   * The server-side action being requested
   */
  action?: string;

  /**
   * The type of object being modified
   */
  type?: string;

  /**
   * Data applied to the operation
   */
  data?: RequestData;

  /**
   * A Compendium pack name
   */
  pack?: string;

  /**
   * The type of parent document
   */
  parentType?: string;

  /**
   * The ID of a parent document
   */
  parentId?: string;

  /**
   * Additional options applied to the request
   */
  options?: object;
}

interface SocketResponse {
  /**
   * The initial request
   */
  request: SocketRequest;

  /**
   * An error, if one occurred
   */
  error?: Error;

  /**
   * The status of the request
   */
  status?: string;

  /**
   * The ID of the requesting User
   */
  userId?: string;

  /**
   * Data returned as a result of the request
   */
  data?: RequestData;

  /**
   * An Array of created data objects
   */
  result?: object[];
}
