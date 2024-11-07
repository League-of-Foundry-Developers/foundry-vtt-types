import type { AnyConstructor, AnyFunction } from "../../types/utils.d.mts";
import type { Document } from "./abstract/module.d.mts";

// Types that are still needed

declare global {
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
  type DeepReadonly<T> = Readonly<{
    [K in keyof T]: T[K] extends
      | undefined
      | null
      | boolean
      | number
      | string
      | symbol
      | bigint
      | AnyFunction
      | AnyConstructor
      ? T[K]
      : T[K] extends Array<infer V>
        ? ReadonlyArray<DeepReadonly<V>>
        : T[K] extends Map<infer K, infer V>
          ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
          : T[K] extends Set<infer V>
            ? ReadonlySet<DeepReadonly<V>>
            : DeepReadonly<T[K]>;
  }>;

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

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names.

type DocumentConstructionContext = Document.ConstructionContext<Document.Any | null>;

type SettingConfig = ClientSettings.SettingOptions;

type SettingSubmenuConfig = ClientSettings.SettingSubmenuConfig;

type KeyBindingActionConfig = ClientKeybindings.KeybindingActionConfig;

type KeybindingActionBinding = ClientKeybindings.KeybindingActionBinding;

type KeybindingAction = ClientKeybindings.KeybindingAction;

type KeyboardEventContext = KeyboardManager.KeyboardEventContext;

type ConnectedGamepad = GamepadManager.ConnectedGamepad;
