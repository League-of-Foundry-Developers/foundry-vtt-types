/**
 * An abstract interface for managing defined game settings or settings menus
 * for different packages.
 * Each setting is a string key/value pair belonging to a certain package and a
 * certain store scope.
 * When Foundry Virtual Tabletop is initialized, a singleton instance of this
 * class is constructed within the global Game object as as game.settings.
 * @see {@link Game#settings}
 * @see {@link Settings}
 * @see {@link SettingsConfig}
 */
declare class ClientSettings {
  /**
   * Registered settings menus which trigger secondary applications
   */
  menus: Map<string, ClientSettings.CompleteMenuSettings>

  /**
   * A object of registered game settings for this scope
   */
  settings: Map<string, ClientSettings.CompleteData<any>>

  /**
   * The storage interfaces used for persisting settings
   * Each storage interface shares the same API as window.localStorage
   */
  storage: Map<string, Storage>

  constructor (worldSettings: any)

  /**
   * Handle changes to a Setting document to apply them to the world setting
   * storage
   */
  static socketListeners (socket: WebSocket): void

  /**
   * Return a singleton instance of the Game Settings Configuration app
   */
  get sheet (): SettingsConfig

  /**
   * Locally update a setting given a provided key and value
   */
  _update<T> (
    setting: ClientSettings.UpdateableData<T>,
    key: string,
    value: T
  ): T

  /**
   * Get the value of a game setting for a certain module and setting key
   * @param module - The module namespace under which the setting is registered
   * @param key - The setting key to retrieve
   * @example
   * ```javascript
   * // Retrieve the current setting value
   * game.settings.get("myModule", "myClientSetting");
   * ```
   */
  get (module: string, key: string): any

  /**
   * Register a new game setting under this setting scope
   * @param module - The namespace under which the setting is registered
   * @param key - The key name for the setting under the namespace module
   * @param data - Configuration for setting data
   * @example
   * ```javascript
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
   * @example
   * ```javascript
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
  register<T> (
    module: string,
    key: string,
    data: ClientSettings.PartialData<T>
  ): void

  /**
   * Register a new sub-settings menu
   * @param module - The namespace under which the menu is registered
   * @param key - The key name for the setting under the namespace module
   * @param data - Configuration for setting data
   * @example
   * ```javascript
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
  registerMenu (
    module: string,
    key: string,
    data: ClientSettings.PartialMenuSettings
  ): void

  /**
   * Set the value of a game setting for a certain module and setting key
   * @param module - The module namespace under which the setting is registered
   * @param key - The setting key to retrieve
   * @param value - The data to assign to the setting key
   * @example
   * ```javascript
   * // Update the current value of a setting
   * game.settings.set("myModule", "myClientSetting", "b");
   * ```
   */
  set<T> (module: string, key: string, value: T): Promise<T>
}

declare namespace ClientSettings {
  interface PartialData<T> {
    choices?: Record<string, string>
    config?: boolean
    default?: T
    hint?: string
    name?: string
    onChange?: (value: T) => void
    range?: {
      max: number
      min: number
      step: number
    }
    type?: new (...args: any) => T
  }

  interface UpdateableData<T> extends PartialData<T> {
    scope: string
  }

  interface CompleteData<T> extends UpdateableData<T> {
    key: string
    module: string
  }

  interface PartialMenuSettings
  <F extends FormApplication = FormApplication> {
    hint?: string
    icon?: string
    label?: string
    name?: string
    restricted: boolean
    type: new (...args: any) => F
  }

  interface CompleteMenuSettings
  <F extends FormApplication = FormApplication> extends PartialMenuSettings<F> {
    key: string
    module: string
  }
}
