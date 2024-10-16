import type { AnyArray, AnyObject, InexactPartial } from "../../../types/utils.d.mts";
import type Document from "../../common/abstract/document.d.mts";

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
    menus: Map<string, SettingSubmenuConfig>;

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
     * @param key       - The key name for the setting under the namespace module
     * @param data      - Configuration for setting data
     * @typeParam N     - The namespace under which the setting is registered, as a type
     * @typeParam K     - The key name for the setting under the namespace module, as a type
     * @typeParam T     - The type of the setting value
     *
     * @example Register a client setting
     * ```typescript
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
     * @example Register a world setting
     * ```typescript
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
    register<N extends SettingsConfig.Namespace, K extends SettingsConfig.Key, T>(
      namespace: N,
      key: K,
      data: SettingsConfig[`${N}.${K}`] extends string | number | boolean | AnyArray | AnyObject | null
        ? ClientSettings.RegisterSetting<SettingsConfig[`${N}.${K}`]>
        : ClientSettings.RegisterSetting<T>,
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
    get<N extends SettingsConfig.Namespace, K extends SettingsConfig.Key>(
      namespace: N,
      key: K,
    ): SettingsConfig[`${N}.${K}`];

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
    set<N extends SettingsConfig.Namespace, K extends SettingsConfig.Key>(
      namespace: N,
      key: K,
      value: SettingsConfig[`${N}.${K}`],
      options?: Document.ModificationContext<Document.Any | null>,
    ): Promise<SettingsConfig[`${N}.${K}`]>;
  }

  namespace ClientSettings {
    type RegisterSetting<T = unknown> = InexactPartial<Omit<SettingConfig<T>, "key" | "namespace">>;

    type RegisterSubmenu = Omit<SettingSubmenuConfig, "key" | "namespace">;

    /**
     * @deprecated - {@link SettingsConfig | `SettingsConfig`}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Values extends SettingsConfig {}
  }
}
