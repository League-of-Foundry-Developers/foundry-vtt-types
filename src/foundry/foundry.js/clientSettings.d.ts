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
declare class ClientSettings {
  constructor(worldSettings?: Setting['data']['_source'][]);

  /**
   * A object of registered game settings for this scope
   */
  settings: Map<string, ClientSettings.CompleteSetting>;

  /**
   * Registered settings menus which trigger secondary applications
   */
  menus: Map<string, ClientSettings.CompleteMenuSetting>;

  /**
   * The storage interfaces used for persisting settings
   * Each storage interface shares the same API as window.localStorage
   * @remarks This is a lie, it doesn't actually have the same interface...
   */
  storage: Map<string, Storage | WorldSettings>;

  /**
   * The types of settings which should be constructed as a primitive type
   */
  protected static PRIMITIVE_TYPES: [typeof String, typeof Number, typeof Boolean, typeof Array];

  /**
   * Return a singleton instance of the Game Settings Configuration app
   */
  get sheet(): SettingsConfig;

  /**
   * Register a new game setting under this setting scope
   *
   * @param module - The namespace under which the setting is registered
   * @param key    - The key name for the setting under the namespace module
   * @param data   - Configuration for setting data
   * @typeParam M  - The module name to register the setting for
   * @typeParam K  - The key to register the setting for
   * @typeParam T  - The type of the setting value
   *
   * @example
   * ```typescript
   * // Register a client setting
   * game.settings.register("myModule", "myClientSetting", {
   *   name: "Register a Module Setting with Choices",
   *   hint: "A description of the registered setting and its behavior.",
   *   scope: "client",     // This specifies a client-stored setting
   *   config: true,        // This specifies that the setting appears in the configuration view
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
   * @example
   * ```typescript
   * // Register a world setting
   * game.settings.register("myModule", "myWorldSetting", {
   *   name: "Register a Module Setting with a Range slider",
   *   hint: "A description of the registered setting and its behavior.",
   *   scope: "world",      // This specifies a world-level setting
   *   config: true,        // This specifies that the setting appears in the configuration view
   *   type: Number,
   *   range: {             // If range is specified, the resulting setting will be a range slider
   *     min: 0,
   *     max: 100,
   *     step: 10
   *   }
   *   default: 50,         // The default value for the setting
   *   onChange: value => { // A callback function which triggers when the setting is changed
   *     console.log(value)
   *   }
   * });
   * ```
   */
  register<M extends string, K extends string, T>(
    module: M,
    key: K,
    data: ClientSettings.Values[`${M}.${K}`] extends boolean | number | bigint | string | symbol | object
      ? ClientSettings.PartialSetting<ClientSettings.Values[`${M}.${K}`]>
      : ClientSettings.PartialSetting<T>
  ): void;

  /**
   * Register a new sub-settings menu
   *
   * @param module - The namespace under which the menu is registered
   * @param key    - The key name for the setting under the namespace module
   * @param data   - Configuration for setting data
   * @typeParam M  - The module name to register the menu setting for
   * @typeParam K  - The key to register the menu setting for
   *
   * @example
   * ```typescript
   * // Define a settings submenu which handles advanced configuration needs
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
  registerMenu<M extends string, K extends string>(
    module: M,
    key: K,
    data: ClientSettings.RegisteredMenuSettings[`${M}.${K}`]
  ): void;

  /**
   * Get the value of a game setting for a certain module and setting key
   *
   * @param module - The module namespace under which the setting is registered
   * @param key    - The setting key to retrieve
   * @typeParam M  - The module name to register the get for
   * @typeParam K  - The key to get the setting for
   *
   * @example
   * ```typescript
   * // Retrieve the current setting value
   * game.settings.get("myModule", "myClientSetting");
   * ```
   */
  get<M extends string, K extends string>(module: M, key: K): ClientSettings.Values[`${M}.${K}`];

  /**
   * Set the value of a game setting for a certain module and setting key
   *
   * @param module - The module namespace under which the setting is registered
   * @param key    - The setting key to retrieve
   * @param value  - The data to assign to the setting key
   * @typeParam M  - The module name to register the get for
   * @typeParam K  - The key to get the setting for
   * @typeParam V  - The value type to get the value for
   *
   * @example
   * ```typescript
   * // Update the current value of a setting
   * game.settings.set("myModule", "myClientSetting", "b");
   * ```
   */
  set<M extends string, K extends string, V extends ClientSettings.Values[`${M}.${K}`]>(
    module: M,
    key: K,
    value: V
  ): Promise<V>;
}

declare namespace ClientSettings {
  interface CompleteSetting<T = unknown> extends PartialSetting<T> {
    key: string;
    module: string;
  }

  interface CompleteMenuSetting extends PartialMenuSetting {
    key: string;
    module: string;
  }

  interface PartialSetting<T = unknown> {
    choices?: Record<string, string>;
    config?: boolean;
    default?: T;
    hint?: string;
    name?: string;
    onChange?: (value: T) => void;
    range?: T extends number
      ? {
          max: number;
          min: number;
          step: number;
        }
      : undefined;
    filePicker?: T extends string ? true | 'audio' | 'image' | 'video' | 'imagevideo' | 'folder' : undefined;
    scope: string;
    type?: T extends boolean
      ? typeof Boolean
      : T extends number
      ? typeof Number
      : T extends bigint
      ? typeof BigInt
      : T extends string
      ? typeof String
      : T extends symbol
      ? typeof Symbol
      : ConstructorOf<T>;
  }

  interface PartialMenuSetting {
    hint?: string;
    icon?: string;
    label?: string;
    name?: string;
    restricted: boolean;
    type: ConstructorOf<FormApplication<FormApplication.Options, object>>;
  }

  interface RegisteredMenuSettings {
    [key: string]: PartialMenuSetting;
  }

  interface Values {
    'core.combatTrackerConfig': { resource: string; skipDefeated: boolean } | {};
    'core.compendiumConfiguration': Partial<Record<string, CompendiumCollection.Configuration>>;
    'core.rollMode': foundry.CONST.DiceRollMode;
    'core.animateRollTable': boolean;
    'core.permissions': Game.Permissions;
    'core.defaultDrawingConfig': foundry.data.DrawingData['_source'] | {};
    'core.time': number;
    'core.globalPlaylistVolume': number;
    'core.globalAmbientVolume': number;
    'core.globalInterfaceVolume': number;
    'core.moduleConfiguration': Record<string, boolean>;
    [key: string]: unknown;
  }
}
