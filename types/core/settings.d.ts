/**
 * An abstract interface for defining setting storage patterns
 * Each setting is a key/value pair
 */
declare class ClientSettings {
  /** An object of registered game settings for this scope */
  settings: any;

  /**
   * The storage interfaces used for persisting settings
   * Each storage interface shares the same API as window.localStorage
   */
  storage: any;

  constructor(worldSettings: any);

  /**
   * Return a singleton instance of the Game Settings Configuration app
   */
  get sheet(): SettingsConfig;

  /**
   * Register a new game setting under this setting scope
   * @param module	The module namespace under which the setting is registered
   * @param key		The key name for the setting under the namespace module
   * @param data		Configuration for setting data
   */
  register(module: string, key: string, data: any): void;

  /**
   * Register a new sub-settings menu
   *
   * @param {string} module   The namespace under which the menu is registered
   * @param {string} key      The key name for the setting under the namespace module
   * @param {Object} data     Configuration for setting data
   *
   * @example
   * // Define a settings submenu which handles advanced configuration needs
   * game.settings.registerMenu("myModule", "mySettingsMenu", {
   *   name: "My Settings Submenu",
   *   label: "Settings Menu Label",      // The text label used in the button
   *   hint: "A description of what will occur in the submenu dialog.",
   *   icon: "fas fa-bars",               // A Font Awesome icon used in the submenu button
   *   type: MySubmenuApplicationClass,   // A FormApplication subclass which should be created
   *   restricted: true                   // Restrict this submenu to gamemaster only?
   * });
   */
  registerMenu(module: string, key: string, data: any): void;

  /**
   * Get the value of a game setting for a certain module and setting key
   * @param module	The module namespace under which the setting is registered
   * @param key 		The setting key to retrieve
   */
  get(module: string, key: string): any;

  /**
   * Get the value of a game setting for a certain module and setting key
   * @param module	The module namespace under which the setting is registered
   * @param key	The setting key to retrieve
   * @param value	The data to assign to the setting key
   */
  set(module: string, key: string, value: any): Promise<any>;

  /**
   * Update the setting storage with a new value
   * @param key
   * @param value
   */
  update(key: string, value: any): Promise<any>;
}

/**
 * A simple interface for World settings storage which imitates the API provided by localStorage
 */
declare class WorldSettings {
  constructor(settings: object);

  getItem(key: string): any;

  setItem(key: string, value: any): void;
}
