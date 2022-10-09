import type { DocumentSubTypes, DocumentType } from "../../../types/helperTypes";

import type { TokenDataSource } from "../../common/data/data.mjs/tokenData";

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
    constructor(worldSettings?: Setting["data"]["_source"][]);

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
     * The types of settings which should be constructed as a function call rather than as a class constructor.
     * @internal
     */
    protected static PRIMITIVE_TYPES: [
      typeof String,
      typeof Number,
      typeof Boolean,
      typeof Array,
      typeof Symbol,
      typeof BigInt
    ];

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
    register<N extends string, K extends string, T>(
      namespace: N,
      key: K,
      data: ClientSettings.Values[`${N}.${K}`] extends string | number | boolean | Array<any> | object | null
        ? ClientSettings.PartialSettingConfig<ClientSettings.Values[`${N}.${K}`]>
        : ClientSettings.PartialSettingConfig<T>
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
    registerMenu<N extends string, K extends string>(
      namespace: N,
      key: K,
      data: ClientSettings.PartialSettingSubmenuConfig
    ): void;

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
    get<N extends string, K extends string>(namespace: N, key: K): ClientSettings.Values[`${N}.${K}`];

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
     *
     * @example
     * ```typescript
     * // Update the current value of a setting
     * game.settings.set("myModule", "myClientSetting", "b");
     * ```
     */
    set<N extends string, K extends string, V extends ClientSettings.Values[`${N}.${K}`]>(
      namespace: N,
      key: K,
      value: V,
      options?: DocumentModificationContext
    ): Promise<V>;
  }

  namespace ClientSettings {
    type PartialSettingConfig<T = unknown> = InexactPartial<Omit<SettingConfig<T>, "key" | "namespace">>;

    type PartialSettingSubmenuConfig = Omit<SettingSubmenuConfig, "key" | "namespace">;

    interface Values {
      "core.animateRollTable": boolean;
      "core.chatBubbles": boolean;
      "core.chatBubblesPan": boolean;
      "core.combatTrackerConfig": { resource: string; skipDefeated: boolean } | {};
      "core.compendiumConfiguration": Partial<Record<string, CompendiumCollection.Configuration>>;
      "core.coneTemplateType": "round" | "flat";
      "core.defaultDrawingConfig": foundry.data.DrawingData["_source"] | {};
      "core.defaultToken": DeepPartial<TokenDataSource>;
      "core.disableResolutionScaling": boolean;
      "core.fontSize": number;
      "core.fpsMeter": boolean;
      "core.globalAmbientVolume": number;
      "core.globalInterfaceVolume": number;
      "core.globalPlaylistVolume": number;
      "core.keybindings": Record<string, KeybindingActionBinding[]>;
      "core.language": string;
      "core.leftClickRelease": boolean;
      "core.lightAnimation": boolean;
      "core.maxFPS": number;
      "core.mipmap": boolean;
      "core.moduleConfiguration": Record<string, boolean>;
      "core.noCanvas": boolean;
      "core.notesDisplayToggle": boolean;
      "core.nue.shownTips": boolean;
      "core.performanceMode": boolean;
      "core.permissions": Game.Permissions;
      "core.playlist.playingLocation": "top" | "bottom";
      "core.rollMode": keyof CONFIG.Dice.RollModes;
      "core.rtcClientSettings": typeof AVSettings.DEFAULT_CLIENT_SETTINGS;
      "core.rtcWorldSettings": typeof AVSettings.DEFAULT_WORLD_SETTINGS;
      "core.scrollingStatusText": boolean;
      "core.sheetClasses": {
        [Key in DocumentType as DocumentSubTypes<Key> extends string ? Key : never]?: Record<
          DocumentSubTypes<Key> & string,
          string
        >;
      };
      "core.time": number;
      "core.tokenDragPreview": boolean;
      "core.visionAnimation": boolean;
      [key: string]: unknown;
    }
  }
}
