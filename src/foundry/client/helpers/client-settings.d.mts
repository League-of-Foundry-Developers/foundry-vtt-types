import type { AnyArray, AnyObject, InexactPartial, FixedInstanceType, Identity } from "#utils";
import type FormApplication from "#client/appv1/api/form-application-v1.mjs";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type { DataField, SchemaField } from "#common/data/fields.d.mts";

/**
 * A class responsible for managing defined game settings or settings menus.
 * Each setting is a string key/value pair belonging to a certain package and a certain store scope.
 *
 * When Foundry Virtual Tabletop is initialized, a singleton instance of this class is constructed within the global
 * Game object as as game.settings.
 *
 * @see {@linkcode foundry.Game.settings | Game#settings}
 * @see {@linkcode foundry.applications.sidebar.tabs.Settings | Settings}
 * @see {@linkcode foundry.applications.settings.SettingsConfig | SettingsConfig}
 */
declare class ClientSettings {
  /**
   * @remarks
   * @throws If {@linkcode game.settings} has already been initialized
   */
  constructor(worldSettings?: Setting.Implementation["_source"][]);

  /**
   * A object of registered game settings for this scope
   */
  settings: ClientSettings.SettingsMap;

  /**
   * Registered settings menus which trigger secondary applications
   */
  menus: Map<string, ClientSettings.SettingSubmenuConfig>;

  /**
   * The storage interfaces used for persisting settings
   * Each storage interface shares the same API as window.localStorage
   * @remarks The above claim is only true in as much as the `getItem` signatures are compatible;
   * {@linkcode foundry.documents.collections.WorldSettings | WorldSettings} lacks `key`, `setItem`,
   * and `removeItem` methods
   */
  storage: Map<string, Storage | foundry.documents.collections.WorldSettings.Implementation>;

  /**
   * Return a singleton instance of the Game Settings Configuration app
   */
  get sheet(): foundry.applications.settings.SettingsConfig;

  /**
   * Register a new namespaced game setting. The setting's scope determines where the setting is saved.
   * World - World settings are applied to everyone in the World. Use this for settings like system rule variants that
   * everyone must abide by.
   * User - User settings are applied to an individual user. Use this for settings that are a player's personal
   * preference, like 3D dice skins.
   * Client - Client settings are applied to the browser or client used to access the World. Use this for settings that
   * are affected by the client itself, such as screen dimensions, resolution, or performance.
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
   *
   *  @example Register a user setting
   * ```js
   * game.settings.register("myModule", "myUserSetting", {
   *   name: "Register a Module Setting with a checkbox",
   *   hint: "A description of the registered setting and its behavior.",
   *   scope: "user",       // This specifies a user-level setting
   *   config: true,        // This specifies that the setting appears in the configuration view
   *   type: new foundry.fields.BooleanField(),
   *   default: false
   * });
   * ```
   */
  register<
    T extends ClientSettings.Type,
    N extends ClientSettings.Namespace = ClientSettings.Namespace,
    K extends ClientSettings.KeyFor<N> = ClientSettings.KeyFor<N>,
  >(namespace: N, key: K, data: ClientSettings.RegisterData<T, N, K>): void;

  /**
   * Register a new sub-settings menu
   *
   * @param namespace - The namespace under which the menu is registered
   * @param key       - The key name for the setting under the namespace module
   * @param data      - Configuration for setting data
   * @template N     - The namespace under which the menu is registered, as a type
   * @template K     - The key name for the setting under the namespace module, as a type
   *
   * @example Define a settings submenu which handles advanced configuration needs
   * ```typescript
   * game.settings.registerMenu("myModule", "mySettingsMenu", {
   *   name: "My Settings Submenu",
   *   label: "Settings Menu Label",      // The text label used in the button
   *   hint: "A description of what will occur in the submenu dialog.",
   *   icon: "fa-solid fa-bars",               // A Font Awesome icon used in the submenu button
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
   * @template N     - The namespace under which the setting is registered, as a type
   * @template K     - The setting key to retrieve, as a type
   *
   * @example Retrieve the current setting value
   * ```typescript
   * game.settings.get("myModule", "myClientSetting");
   * ```
   */
  get<
    N extends ClientSettings.Namespace,
    K extends ClientSettings.KeyFor<N>,
    Doc extends boolean | undefined = undefined,
  >(namespace: N, key: K, options?: ClientSettings.GetOptions<Doc>): ClientSettings.Get<N, K, Doc>;

  /**
   * Set the value of a game setting for a certain namespace and setting key
   *
   * @param namespace - The namespace under which the setting is registered
   * @param key       - The setting key to retrieve
   * @param value     - The data to assign to the setting key
   * @param options   - Additional options passed to the server when updating world-scope settings
   * @template N     - The namespace under which the setting is registered, as a type
   * @template K     - The setting key to retrieve, as a type
   * @template V     - The type of the value being set
   * @returns         - The assigned setting value
   *
   * @example
   * ```typescript
   * // Update the current value of a setting
   * game.settings.set("myModule", "myClientSetting", "b");
   * ```
   */
  set<
    N extends ClientSettings.Namespace,
    K extends ClientSettings.KeyFor<N>,
    Doc extends boolean | undefined = undefined,
  >(
    namespace: N,
    key: K,
    value: ClientSettings.SettingCreateData<N, K>,
    options?: ClientSettings.SetOptions<Doc>,
  ): Promise<ClientSettings.Get<N, K, Doc>>;
}

declare namespace ClientSettings {
  interface Any extends AnyClientSettings {}
  interface AnyConstructor extends Identity<typeof AnyClientSettings> {}

  type Namespace = GetNamespaces<keyof globalThis.SettingConfig>;
  type KeyFor<N extends Namespace> = GetKeys<N, keyof globalThis.SettingConfig>;

  type SettingsMap = Map<keyof globalThis.SettingConfig & (string & {}), ClientSettings.SettingConfig>;

  interface RegisterData<
    T extends ClientSettings.Type,
    N extends ClientSettings.Namespace,
    K extends ClientSettings.KeyFor<N>,
  > extends _RegisterData<_RegisterType<T, N, K>> {}

  /**
   * @internal
   */
  type _RegisterType<
    T extends ClientSettings.Type,
    N extends ClientSettings.Namespace,
    K extends ClientSettings.KeyFor<N>,
  > = ClientSettings.Type extends T ? ConfiguredType<N, K> : NoInfer<T>;

  /**
   * @internal
   */
  type _RegisterData<T extends ClientSettings.Type> = InexactPartial<Omit<SettingConfig<T>, "key" | "namespace">>;

  /**
   * A TypeScript type is a type for a setting that only exists at compile time.
   * For example `string` does not correspond to a real runtime value like `String` does.
   */
  type TypeScriptType = string | number | boolean | symbol | bigint | AnyArray | AnyObject;

  // TODO(LukeAbby): Look into why switching to `DataModel.AnyConstructor` causes a circularity.
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
    | (T extends AnyObject ? typeof Object : never)
    // TODO(LukeAbby): If `DataModel.AnyConstructor` can be used in `RuntimeType` this can be switched to `...args: never`
    | (T extends DataModel.Any ? new (...args: any[]) => T : never);

  type SettingCreateData<N extends Namespace, K extends KeyFor<N>> = ToSettingCreateData<ConfiguredType<N, K>>;

  type ToSettingCreateData<T extends Type> = ReplaceUndefinedWithNull<
    | SettingType<T, " __fvtt_types_internal_assignment_data">
    // TODO(LukeAbby): The `fromSource` function is called with `strict` which changes how fallback behaviour works. See `ClientSettings#set`
    | (T extends (abstract new (...args: infer _1) => infer Instance extends DataModel.Any)
        ? SchemaField.CreateData<DataModel.SchemaOf<Instance>>
        : never)
  >;

  type SettingInitializedType<N extends Namespace, K extends KeyFor<N>> = ToSettingInitializedType<
    ConfiguredType<N, K>
  >;

  type ToSettingInitializedType<T extends Type> = ReplaceUndefinedWithNull<
    SettingType<T, " __fvtt_types_internal_initialized_data"> | (T extends DataModel.Any ? T : never)
  >;

  type Get<N extends Namespace, K extends KeyFor<N>, Doc extends boolean | undefined> = Doc extends true
    ? Setting.Implementation
    : SettingInitializedType<N, K>;

  type Scope = "world" | "client" | "user";

  /**
   * @internal
   */
  interface _SettingConfig<RuntimeType extends ClientSettings.RuntimeType, CreateData, InitializedData> {
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
    scope: Scope;

    /** Indicates if this Setting should render in the Config application */
    config?: boolean | undefined;

    /** The JS Type that the Setting is storing */
    type?: RuntimeType;

    /** For string Types, defines the allowable values */
    choices?: CreateData extends string
      ? {
          readonly [K in CreateData]?: string;
        }
      : never;

    /** For numeric Types, defines the allowable range */
    range?: CreateData extends number
      ? {
          max: number;
          min: number;
          step: number;
        }
      : never;

    /** The default value */
    default: CreateData;

    /** Whether setting requires Foundry to be reloaded on change  */
    requiresReload?: boolean;

    /** Executes when the value of this Setting changes */
    onChange?: (value: InitializedData, options?: Omit<SetOptions, "document">) => void;

    /**
     * A custom form field input used in conjunction with a DataField type
     * @deprecated As of v13, the new, AppV2 {@linkcode foundry.applications.settings.SettingsConfig | SettingsConfig}'s template no longer
     * passes this to the relevant `{{formGroup}}` helper, so this is currently non-functional:
     * {@link https://github.com/foundryvtt/foundryvtt/issues/13670}
     */
    input?: DataField.CustomFormInput | undefined;
  }

  /**
   * A Client Setting
   * @remarks Not to be confused with {@linkcode globalThis.SettingConfig} which is how you register setting types in this project
   */
  interface SettingConfig<T extends Type = (value: unknown) => unknown> extends _SettingConfig<
    ToRuntimeType<T>,
    ToSettingInitializedType<T>,
    ToSettingCreateData<T>
  > {}

  /**
   * A Client Setting Submenu
   * @remarks Copied from `resources/app/common/types.mjs`
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
    // In SettingsConfig#_onClickSubmenu this type is constructed and not given any options.
    type: (new () => FormApplication.Any) | (new () => ApplicationV2.Any);

    /** If true, only a GM can edit this Setting */
    restricted?: boolean | undefined;
  }

  interface RegisterSubmenu {
    /** The human readable name */
    name: string;

    /** The human readable label */
    label: string;

    /** An additional human readable hint */
    hint: string;

    /** The classname of an Icon to render */
    icon: string;

    /**
     * The FormApplication class to render
     *
     * @privateRemarks The phrase "TODO better typing" in the original documentation was stripped.
     */
    type: (new () => FormApplication.Any) | (new () => ApplicationV2.Any);

    /** If true, only a GM can edit this Setting */
    restricted: boolean;
  }

  /** @internal */
  type _GetOptions<Doc extends boolean | undefined> = InexactPartial<{
    /**
     * Retrieve the full Setting document instance instead of just its value
     * @defaultValue `false`
     */
    document: Doc;
  }>;

  interface GetOptions<Doc extends boolean | undefined = undefined> extends _GetOptions<Doc> {}

  /** @internal */
  type _SetOptions<Doc extends boolean | undefined> = InexactPartial<{
    /**
     * Return the updated Setting document instead of just its value
     * @defaultValue `false`
     */
    document: Doc;
  }>;

  /** @internal */
  interface _SetOptionsCreate<Doc extends boolean | undefined>
    extends _SetOptions<Doc>, Setting.Database.CreateOperation<undefined | false> {}

  /** @internal */
  interface _SetOptionsUpdate<Doc extends boolean | undefined>
    extends _SetOptions<Doc>, Setting.Database.UpdateOperation {}

  type SetOptions<Doc extends boolean | undefined = undefined> = _SetOptionsCreate<Doc> | _SetOptionsUpdate<Doc>;

  /**
   * @deprecated Replaced with {@linkcode ClientSettings.SettingInitializedType}.
   */
  export import SettingAssignmentType = ClientSettings.SettingInitializedType;

  /**
   * @deprecated Replaced with {@linkcode ClientSettings.ToSettingInitializedType}.
   */
  export import ToSettingAssignmentType = ClientSettings.ToSettingInitializedType;
}

export default ClientSettings;

declare abstract class AnyClientSettings extends ClientSettings {
  constructor(...args: never);
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
  : FixedInstanceType<T>;

// In theory this is just the `ReturnType<T>`.
// However the function end of `Array` returns `any[]` while `Object` returns `any`.
// To increase safety they're special cased here.
type PrimitiveConstructorToSettingType<T extends PRIMITIVE_TYPES[number]> = T extends typeof Array
  ? AnyArray
  : T extends typeof Object
    ? AnyObject
    : ReturnType<T>;

// The `& keyof SettingConfig` is necessary because otherwise the fact that `K` depends on `N`
// will confuse TypeScript and make it think that `${N}.${K}` can be invalid keys like
// "core.moduleSetting" but in reality that would be disallowed by the dependent constraint of `K`.
type ConfiguredType<
  N extends ClientSettings.Namespace,
  K extends ClientSettings.KeyFor<N>,
> = globalThis.SettingConfig[`${N}.${K}` & keyof globalThis.SettingConfig];

type SettingType<T extends ClientSettings.Type, K extends keyof DataField.Any> =
  // Note(LukeAbby): This isn't written as `T extends ClientSettings.TypeScriptType ? T : never` because then types like `DataField.Any` would be matched.
  | (T extends ClientSettings.RuntimeType ? never : T)
  // TODO(LukeAbby): The `validate` function is called with `strict` which changes how fallback behavior works. See `ClientSettings#set`
  | (T extends DataField.Any ? T[K] : never)
  | (T extends SettingConstructor ? ConstructorToSettingType<T> : T extends SettingFunction ? ReturnType<T> : never);

// TODO(LukeAbby): The exact semantics for when `undefined` is replaced with `null` are unclear.
type ReplaceUndefinedWithNull<T> = T extends undefined ? null : T;

type GetNamespaces<SettingPath extends PropertyKey> = SettingPath extends `${infer Scope}.${string}` ? Scope : never;
type GetKeys<N extends string, SettingPath extends PropertyKey> = SettingPath extends `${N}.${infer Name}`
  ? Name
  : never;
