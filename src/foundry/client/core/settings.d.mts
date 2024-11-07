import type { ConformRecord } from "../../../types/helperTypes.d.mts";
import type { AnyArray, AnyObject, DeepPartial, InexactPartial } from "../../../types/utils.d.mts";
import type ApplicationV2 from "../../client-esm/applications/api/application.d.mts";
import type { CustomFormInput } from "../../client-esm/applications/forms/fields.d.mts";
import type DataModel from "../../common/abstract/data.d.mts";
import type Document from "../../common/abstract/document.d.mts";
import type { DataField } from "../../common/data/fields.d.mts";

declare global {
  /**
   * A class responsible for managing defined game settings or settings menus.
   * Each setting is a string key/value pair belonging to a certain package and a certain store scope.
   *
   * When Foundry Virtual Tabletop is initialized, a singleton instance of this class is constructed within the global
   * Game object as as game.settings.
   *
   * @see {@link Game#settings}
   * @see {@link Settings}
   * @see {@link SettingsConfig}
   */
  class ClientSettings {
    constructor(worldSettings?: Setting["_source"][]);

    /**
     * A object of registered game settings for this scope
     */
    settings: Map<string, SettingConfig>;

    /**
     * Registered settings menus which trigger secondary applications
     */
    menus: Map<string, ClientSettings.SettingSubmenuConfig>;

    /**
     * The storage interfaces used for persisting settings
     * Each storage interface shares the same API as window.localStorage
     * @remarks This is a lie, it doesn't actually have the same interface...
     */
    storage: Map<string, Storage | WorldSettings>;

    /**
     * Return a singleton instance of the Game Settings Configuration app
     */
    get sheet(): SettingsConfig;

    /**
     * Register a new game setting under this setting scope
     *
     * @param namespace - The namespace under which the setting is registered
     * @param key       - The key name for the setting under the namespace
     * @param data      - Configuration for setting data
     *
     * @example Register a client setting
     * ```js
     * game.settings.register("myModule", "myClientSetting", {
     *   name: "Register a Module Setting with Choices",
     *   hint: "A description of the registered setting and its behavior.",
     *   scope: "client",     // This specifies a client-stored setting
     *   config: true,        // This specifies that the setting appears in the configuration view
     *   requiresReload: true // This will prompt the user to reload the application for the setting to take effect.
     *   type: String,
     *   choices: {           // If choices are defined, the resulting setting will be a select menu
     *     "a": "Option A",
     *     "b": "Option B"
     *   },
     *   default: "a",        // The default value for the setting
     *   onChange: value => { // A callback function which triggers when the setting is changed
     *     console.log(value)
     *   }
     * });
     * ```
     *
     * @example Register a world setting
     * ```js
     * game.settings.register("myModule", "myWorldSetting", {
     *   name: "Register a Module Setting with a Range slider",
     *   hint: "A description of the registered setting and its behavior.",
     *   scope: "world",      // This specifies a world-level setting
     *   config: true,        // This specifies that the setting appears in the configuration view
     *   requiresReload: true // This will prompt the GM to have all clients reload the application for the setting to
     *                        // take effect.
     *   type: new foundry.fields.NumberField({nullable: false, min: 0, max: 100, step: 10}),
     *   default: 50,         // The default value for the setting
     *   onChange: value => { // A callback function which triggers when the setting is changed
     *     console.log(value)
     *   }
     * });
     * ```
     */
    register<N extends ClientSettings.Namespace, K extends ClientSettings.Key, T extends ClientSettings.Type>(
      namespace: N,
      key: K,
      data: ClientSettings.Type extends T
        ? ClientSettings.RegisterOptions<_SettingConfig[`${N}.${K}`]>
        : ClientSettings.RegisterOptions<NoInfer<T>>,
    ): void;

    /**
     * Register a new sub-settings menu
     *
     * @param namespace - The namespace under which the menu is registered
     * @param key       - The key name for the setting under the namespace module
     * @param data      - Configuration for setting data
     * @typeParam N     - The namespace under which the menu is registered, as a type
     * @typeParam K     - The key name for the setting under the namespace module, as a type
     *
     * @example Define a settings submenu which handles advanced configuration needs
     * ```typescript
     * game.settings.registerMenu("myModule", "mySettingsMenu", {
     *   name: "My Settings Submenu",
     *   label: "Settings Menu Label",      // The text label used in the button
     *   hint: "A description of what will occur in the submenu dialog.",
     *   icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
     *   type: MySubmenuApplicationClass,   // A FormApplication subclass which should be created
     *   restricted: true                   // Restrict this submenu to gamemaster only?
     * });
     * ```
     */
    registerMenu<N extends string, K extends string>(namespace: N, key: K, data: ClientSettings.RegisterSubmenu): void;

    /**
     * Get the value of a game setting for a certain namespace and setting key
     *
     * @param namespace - The namespace under which the setting is registered
     * @param key       - The setting key to retrieve
     * @typeParam N     - The namespace under which the setting is registered, as a type
     * @typeParam K     - The setting key to retrieve, as a type
     *
     * @example Retrieve the current setting value
     * ```typescript
     * game.settings.get("myModule", "myClientSetting");
     * ```
     */
    get<N extends ClientSettings.Namespace, K extends ClientSettings.Key>(
      namespace: N,
      key: K,
    ): ClientSettings.SettingInitializedType<N, K>;

    /**
     * Set the value of a game setting for a certain namespace and setting key
     *
     * @param namespace - The namespace under which the setting is registered
     * @param key       - The setting key to retrieve
     * @param value     - The data to assign to the setting key
     * @param options   - Additional options passed to the server when updating world-scope settings
     * @typeParam N     - The namespace under which the setting is registered, as a type
     * @typeParam K     - The setting key to retrieve, as a type
     * @typeParam V     - The type of the value being set
     * @returns         - The assigned setting value
     *
     * @example
     * ```typescript
     * // Update the current value of a setting
     * game.settings.set("myModule", "myClientSetting", "b");
     * ```
     */
    set<N extends ClientSettings.Namespace, K extends ClientSettings.Key>(
      namespace: N,
      key: K,
      value: ClientSettings.SettingAssignmentType<N, K>,
      options?: Document.OnUpsertOptions<"Setting">,
    ): Promise<ClientSettings.SettingInitializedType<N, K>>;
  }

  namespace ClientSettings {
    type Namespace = GetNamespaces<keyof _SettingConfig>;
    type Key = GetKeys<keyof _SettingConfig>;

    /**
     * A compile type is a type for a setting that only exists at compile time.
     * For example `string` does not correspond to a real runtime value like `String` does.
     */
    type TypeScriptType = string | number | boolean | symbol | bigint | AnyArray | AnyObject;

    // The type `typeof DataModel<any, any>` is used because Foundry actually constructs with its regular constructor parameters in this case.
    type RuntimeType = DataField.Any | typeof DataModel<any, any> | SettingFunction | SettingConstructor;

    type Type = TypeScriptType | RuntimeType;

    type ToRuntimeType<T extends Type> =
      | (T extends RuntimeType ? T : never)
      | (T extends string ? typeof String : never)
      | (T extends number ? typeof Number : never)
      | (T extends boolean ? typeof Boolean : never)
      | (T extends symbol ? typeof Symbol : never)
      | (T extends bigint ? typeof BigInt : never)
      | (T extends readonly (infer V)[] ? typeof Array<V> : never)
      | (T extends AnyObject ? typeof Object : never);

    type SettingAssignmentType<N extends Namespace, K extends Key> = ToSettingAssignmentType<ConfiguredType<N, K>>;
    type ToSettingAssignmentType<T extends Type> = ReplaceUndefinedWithNull<
      | SettingType<T>
      // TODO(LukeAbby): The `fromSource` function is called with `strict` which changes how fallback behaviour works. See `ClientSettings#set`
      | (T extends DataModel.AnyConstructor ? DataModel.ConstructorDataFor<InstanceType<T>> : never)
    >;

    type SettingInitializedType<N extends Namespace, K extends Key> = ToSettingInitializedType<ConfiguredType<N, K>>;
    type ToSettingInitializedType<T extends Type> = ReplaceUndefinedWithNull<
      SettingType<T> | (T extends DataModel.Any ? T : never)
    >;

    // This type is named `SettingConfig` in FoundryVTT but that name is confusing within fvtt-types because of the `Config` nomenclature meaning declaration merging.
    interface _SettingOptions<RuntimeType extends ClientSettings.RuntimeType, AssignmentType> {
      /** A unique machine-readable id for the setting */
      key: string;

      /** The namespace the setting belongs to */
      namespace: string;

      /** The human readable name */
      name?: string | undefined;

      /** An additional human readable hint */
      hint?: string | undefined;

      /**
       * The scope the Setting is stored in, either World or Client
       * @defaultValue `"client"`
       */
      scope: "world" | "client";

      /** Indicates if this Setting should render in the Config application */
      config?: boolean | undefined;

      /** The JS Type that the Setting is storing */
      type?: RuntimeType;

      /** For string Types, defines the allowable values */
      choices?: AssignmentType extends string
        ? {
            readonly [K in AssignmentType]?: string;
          }
        : never;

      /** For numeric Types, defines the allowable range */
      range?: AssignmentType extends number
        ? {
            max: number;
            min: number;
            step: number;
          }
        : never;

      /** The default value */
      default: AssignmentType;

      /** Whether setting requires Foundry to be reloaded on change  */
      requiresReload?: boolean;

      /** Executes when the value of this Setting changes */
      onChange?: (value: AssignmentType) => void;

      /**
       * A custom form field input used in conjunction with a DataField type
       */
      input?: CustomFormInput | undefined;
    }

    /** A Client Setting */
    interface SettingOptions<T extends Type = (value: unknown) => unknown>
      extends _SettingOptions<ToRuntimeType<T>, ToSettingAssignmentType<T>> {}

    interface RegisterOptions<T extends Type> extends InexactPartial<Omit<SettingOptions<T>, "key" | "namespace">> {}

    /**
     * A Client Setting Submenu
     */
    interface SettingSubmenuConfig {
      key: string;

      namespace: string;

      /** The human-readable name */
      name?: string | undefined;

      /** An additional human-readable hint */
      label?: string | undefined;

      /** An additional human readable hint */
      hint?: string | undefined;

      /** The classname of an Icon to render */
      icon?: string | undefined;

      /** The FormApplication or ApplicationV2 to render */
      type:
        | (new () => FormApplication.Any)
        | (new (options?: DeepPartial<ApplicationV2.Configuration>) => ApplicationV2.Any);

      /** If true, only a GM can edit this Setting */
      restricted?: boolean | undefined;
    }

    type RegisterSubmenu = Omit<SettingSubmenuConfig, "key" | "namespace">;

    /**
     * @deprecated - {@link SettingConfig | `SettingConfig`}
     */
    interface Values extends SettingConfig {}
  }
}

type SettingFunction = (value: never) => unknown;
type SettingConstructor = new (value: never) => unknown;

// Matches what's in `Setting#PRIMITIVE_TYPES`.
// Foundry itself uses this nomenclature despite the fact that it's a misnomer.
type PRIMITIVE_TYPES = readonly [
  typeof String,
  typeof Number,
  typeof Boolean,
  typeof Array,
  typeof Symbol,
  typeof BigInt,
];

// A type can be both a constructor and a function at once.
// Foundry prioritizes the constructor over the function unless it's in `Setting#PRIMITIVE_TYPES`.
type ConstructorToSettingType<T extends SettingConstructor> = T extends PRIMITIVE_TYPES[number]
  ? PrimitiveConstructorToSettingType<T>
  : InstanceType<T>;

// In theory this is just the `ReturnType<T>`.
// However the function end of `Array` returns `any[]` while `Object` returns `any`.
// To increase safety they're special cased here.
type PrimitiveConstructorToSettingType<T extends PRIMITIVE_TYPES[number]> = T extends typeof Array
  ? AnyArray
  : T extends typeof Object
    ? AnyObject
    : ReturnType<T>;

type ConfiguredType<N extends ClientSettings.Namespace, K extends ClientSettings.Key> = _SettingConfig[`${N}.${K}`];

type SettingType<T extends ClientSettings.Type> =
  // Note(LukeAbby): This isn't written as `T extends ClientSettings.TypeScriptType ? T : never` because then types like `DataField.Any` would be matched.
  | (T extends ClientSettings.RuntimeType ? never : T)
  // TODO(LukeAbby): The `validate` function is called with `strict` which changes how fallback behaviour works. See `ClientSettings#set`
  | (T extends DataField.Any ? DataField.AssignmentTypeFor<T> : never)
  | (T extends SettingConstructor ? ConstructorToSettingType<T> : T extends SettingFunction ? ReturnType<T> : never);

// TODO(LukeAbby): The exact semantics for when `undefined` is replaced with `null` are unclear.
type ReplaceUndefinedWithNull<T> = T extends undefined ? null : T;

type GetNamespaces<SettingPath extends PropertyKey> = SettingPath extends `${infer Scope}.${string}` ? Scope : never;
type GetKeys<SettingPath extends PropertyKey> = SettingPath extends `${string}.${infer Name}` ? Name : never;

type _SettingConfig = ConformRecord<
  // Refers to the deprecated interface so that merging works both ways.
  ClientSettings.Values,
  ClientSettings.Type
>;
