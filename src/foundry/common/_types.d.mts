import type { AnyConcreteConstructor, AnyConstructor, AnyFunction } from "fvtt-types/utils";
import type { Document } from "./abstract/_module.d.mts";

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

type DocumentConstructionContext = Document.ConstructionContext<Document.Any | null>;

/**
 * Make all properties in T recursively readonly.
 * @privateRemarks We have better tools & this is only used in a private method
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
    | AnyConcreteConstructor
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
 * @privateRemarks We have better tools like {@link AnyConcreteConstructor | `AnyConcreteConstructor`} and {@link AnyConstructor | `AnyConstructor`}
 */
type Constructor = new (...args: any[]) => any;

type Point = Canvas.Point;

type PointArray = Canvas.PointTuple;

type Rectangle = Canvas.Rectangle;

type BuiltinTypes = typeof Number | typeof String | typeof Boolean;

type ColorSource = foundry.utils.Color.Source;

type SettingConfig = ClientSettings.SettingConfig;

type SettingSubmenuConfig = ClientSettings.SettingSubmenuConfig;

type KeyBindingActionConfig = ClientKeybindings.KeybindingActionConfig;

type KeybindingActionBinding = ClientKeybindings.KeybindingActionBinding;

type KeybindingAction = ClientKeybindings.KeybindingAction;

type KeyboardEventContext = KeyboardManager.KeyboardEventContext;

type ConnectedGamepad = GamepadManager.ConnectedGamepad;

type RequestData = SocketInterface.RequestData;

type SocketRequest = SocketInterface.SocketRequest;

type SocketResponse = SocketInterface.SocketResponse;
