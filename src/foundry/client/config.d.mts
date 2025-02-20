import type * as CONST from "../common/constants.d.mts";
import type { DataModel, Document } from "../common/abstract/module.d.mts";
import type { GetKey, AnyObject, HandleEmptyObject, MaybePromise } from "fvtt-types/utils";
import type BaseLightSource from "../client-esm/canvas/sources/base-light-source.d.mts";

declare global {
  namespace CONFIG {
    namespace Dice {
      interface FulfillmentConfiguration {
        /** The die denominations available for configuration. */
        dice: Record<string, FulfillmentDenomination>;

        /** The methods available for fulfillment. */
        methods: Record<string, FulfillmentMethod>;

        /**
         * Designate one of the methods to be used by default
         * for dice fulfillment, if the user hasn't specified
         * otherwise. Leave this blank to use the configured
         * randomUniform to generate die rolls.
         * @defaultValue `""`
         */
        defaultMethod: string;
      }

      interface FulfillmentDenomination {
        /** The human-readable label for the die. */
        label: string;

        /** An icon to display on the configuration sheet. */
        icon: string;
      }

      interface FulfillmentMethod {
        /** The human-readable label for the fulfillment method. */
        label: string;

        /** An icon to represent the fulfillment method. */
        icon?: string | undefined | null;

        /** Whether this method requires input from the user or if it is fulfilled entirely programmatically. */
        interactive?: boolean | undefined | null;

        /** A function to invoke to programmatically fulfil a given term for non-interactive fulfillment methods. */
        handler?: FulfillmentHandler | undefined | null;

        /**
         * A custom RollResolver implementation. If the only interactive methods
         * the user has configured are this method and manual, this resolver
         * will be used to resolve interactive rolls, instead of the default
         * resolver. This resolver must therefore be capable of handling manual
         * rolls.
         */
        resolver: foundry.applications.dice.RollResolver.AnyConstructor;
      }

      /**
       * Only used for non-interactive fulfillment methods. If a die configured to use this fulfillment method is rolled,
       * this handler is called and awaited in order to produce the die roll result.
       * @returns The fulfilled value, or undefined if it could not be fulfilled.
       */
      type FulfillmentHandler = (
        /** The term being fulfilled. */
        term: foundry.dice.terms.DiceTerm,
        /** Additional options to configure fulfillment. */
        options?: AnyObject,
      ) => Promise<number | void>;

      type RollFunction = (arg0: never, ...args: never[]) => MaybePromise<number>;

      type DTermDiceStrings = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";
    }

    interface Dice {
      /**
       * The Dice types which are supported.
       * @defaultValue `[foundry.dice.terms.Die, foundry.dice.terms.FateDie]`
       */
      types: Array<foundry.dice.terms.DiceTerm.AnyConstructor>;

      rollModes: CONFIG.Dice.RollModes;

      /**
       * Configured Roll class definitions
       * @defaultValue `[Roll]`
       */
      rolls: Array<foundry.dice.Roll.AnyConstructor>;

      /**
       * Configured DiceTerm class definitions
       * @defaultValue
       * ```typescript
       * {
       *   DiceTerm: typeof foundry.dice.terms.DiceTerm,
       *   MathTerm: typeof foundry.dice.terms.MathTerm,
       *   NumericTerm: typeof foundry.dice.terms.NumericTerm,
       *   OperatorTerm: typeof foundry.dice.terms.OperatorTerm,
       *   ParentheticalTerm: typeof foundry.dice.terms.ParentheticalTerm,
       *   PoolTerm: typeof foundry.dice.terms.PoolTerm,
       *   StringTerm: typeof foundry.dice.terms.StringTerm
       * }
       * ```
       */
      termTypes: Record<string, foundry.dice.terms.RollTerm.AnyConstructor>;

      /** Configured roll terms and the classes they map to. */
      terms: {
        c: foundry.dice.terms.Coin.AnyConstructor;
        d: foundry.dice.terms.Die.AnyConstructor;
        f: foundry.dice.terms.FateDie.AnyConstructor;
      } & Record<string, foundry.dice.terms.DiceTerm.AnyConstructor>;

      /**
       * A function used to provide random uniform values.
       * @defaultValue `foundry.dice.MersenneTwister.random`
       */
      randomUniform: () => number;

      /** A parser implementation for parsing Roll expressions. */
      parser: foundry.dice.RollParser.AnyConstructor;

      /** A collection of custom functions that can be included in roll expressions.*/
      functions: Record<string, CONFIG.Dice.RollFunction>;

      /**
       * Dice roll fulfillment configuration
       */
      fulfillment: CONFIG.Dice.FulfillmentConfiguration;
    }

    /**
     * Configured status effects which are recognized by the game system
     */
    type StatusEffect = foundry.documents.BaseActiveEffect.ConstructorData & {
      /**
       * A string identifier for the effect
       */
      id: string;

      /**
       * Alias for ActiveEffectData#name
       * @deprecated since v11, will be removed in v13
       */
      label?: string | undefined | null;

      /**
       * Alias for ActiveEffectData#img
       * @deprecated since v12, will be removed in v14
       */
      icon?: string | undefined | null;

      /**
       * Should this effect be selectable in the Token HUD?
       * This effect is only selectable in the Token HUD if the Token's Actor sub-type is one of the configured ones.
       * @defaultValue `true`
       */
      hud?: boolean | { actorTypes: string[] } | undefined | null;
    };
  }

  /**
   * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
   * aspects of the software behaves.
   *
   * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
   * session or modified by system and module developers to adjust how the application behaves.
   */
  interface CONFIG {
    /**
     * Configure debugging flags to display additional information
     */
    debug: {
      /** @defaultValue `false` */
      applications: boolean;

      /** @defaultValue `false` */
      audio: boolean;

      /** @defaultValue `false` */
      dice: boolean;

      /** @defaultValue `false` */
      documents: boolean;

      fog: {
        /** @defaultValue `false` */
        extractor: boolean;

        /** @defaultValue `false` */
        manager: boolean;
      };

      /** @defaultValue `false` */
      hooks: boolean;

      /** @defaultValue `false` */
      av: boolean;

      /** @defaultValue `false` */
      avclient: boolean;

      /** @defaultValue `false` */
      mouseInteraction: boolean;

      /** @defaultValue `false` */
      time: boolean;

      /** @defaultValue `false` */
      keybindings: boolean;

      /** @defaultValue `false` */
      polygons: boolean;

      /** @defaultValue `false` */
      gamepad: boolean;

      canvas: {
        primary: {
          /** @defaultValue `false` */
          bounds: boolean;
        };
      };

      /** @defaultValue `false` */
      rollParsing: boolean;
    };

    /**
     * Configure the verbosity of compatibility warnings generated throughout the software.
     * The compatibility mode defines the logging level of any displayed warnings.
     * The includePatterns and excludePatterns arrays provide a set of regular expressions which can either only
     * include or specifically exclude certain file paths or warning messages.
     * Exclusion rules take precedence over inclusion rules.
     *
     * @see {@link CONST.COMPATIBILITY_MODES}
     *
     * @example Include Specific Errors
     * ```js
     * const includeRgx = new RegExp("/systems/dnd5e/module/documents/active-effect.mjs");
     * CONFIG.compatibility.includePatterns.push(includeRgx);
     * ```
     *
     * @example Exclude Specific Errors
     * ```js
     * const excludeRgx = new RegExp("/systems/dnd5e/");
     * CONFIG.compatibility.excludePatterns.push(excludeRgx);
     * ```
     *
     * @example Both Include and Exclude
     * ```js
     * const includeRgx = new RegExp("/systems/dnd5e/module/actor/");
     * const excludeRgx = new RegExp("/systems/dnd5e/module/actor/sheets/base.js");
     * CONFIG.compatibility.includePatterns.push(includeRgx);
     * CONFIG.compatibility.excludePatterns.push(excludeRgx);
     * ```
     *
     * @example Targeting more than filenames
     * ```js
     * const includeRgx = new RegExp("applyActiveEffects");
     * CONFIG.compatibility.includePatterns.push(includeRgx);
     * ```
     */
    compatibility: {
      mode: CONST.COMPATIBILITY_MODES;
      includePatterns: RegExp[];
      excludePatterns: RegExp[];
    };

    compendium: {
      /**
       * Configure a table of compendium UUID redirects. Must be configured before the game *ready* hook is fired.
       *
       * @example Re-map individual UUIDs
       * ```js
       * CONFIG.compendium.uuidRedirects["Compendium.system.heroes.Actor.Tf0JDPzHOrIxz6BH"] = "Compendium.system.villains.Actor.DKYLeIliXXzlAZ2G";
       * ```
       *
       * @example Redirect UUIDs from one compendium to another.
       * ```js
       * CONFIG.compendium.uuidRedirects["Compendium.system.heroes"] = "Compendium.system.villains";
       * ```
       */
      uuidRedirects: Record<string, string>;
    };

    /**
     * Configure the DatabaseBackend used to perform Document operations
     * @defaultValue `new foundry.data.ClientDatabaseBackend()`
     */
    DatabaseBackend: foundry.data.ClientDatabaseBackend;

    /**
     * Configuration for the Actor document
     */
    Actor: {
      /** @defaultValue `Actor` */
      documentClass: Document.ConfiguredClassForName<"Actor">;

      /** @defaultValue `Actors` */
      collection: Actors.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/actor-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-user"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Actor>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseActor.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseActor.TypeNames, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;

      /** @defaultValue `{}` */
      trackableAttributes: Record<string, string>;
    };

    /**
     * Configuration for the Adventure document.
     * Currently for internal use only.
     * @internal
     */
    Adventure: {
      /** @defaultValue `foundry.documents.BaseAdventure` */
      documentClass: Document.ConfiguredClassForName<"Adventure">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/adventure-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fa-solid fa-treasure-chest"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the Cards primary Document type
     */
    Cards: {
      /** @defaultValue `CardStacks` */
      collection: CardStacks.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `Cards` */
      documentClass: Document.ConfiguredClassForName<"Cards">;

      /** @defaultValue `"fa-solid fa-cards"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Cards>>;

      /**
       * @defaultValue
       * ```typescript
       * {
       *    pokerDark: {
       *      type: "deck",
       *      label: "CARDS.DeckPresetPokerDark",
       *      src: "cards/poker-deck-dark.json"
       *    },
       *    pokerLight: {
       *      type: "deck",
       *      label: "CARDS.DeckPresetPokerLight",
       *      src: "cards/poker-deck-light.json"
       *    }
       * }
       * ```
       */
      presets: Record<string, CONFIG.Cards.Preset>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCards.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCards.TypeNames, string>;

      typeIcons: {
        /** @defaultValue `"fas fa-cards"` */
        deck: string;
        /** @defaultValue `"fa-duotone fa-cards"` */
        hand: string;
        /** @defaultValue `"fa-duotone fa-layer-group"` */
        pile: string;

        [x: string]: string;
      };
    };

    /**
     * Configuration for the ChatMessage document
     */
    ChatMessage: {
      /** @defaultValue `ChatMessage` */
      documentClass: Document.ConfiguredClassForName<"ChatMessage">;

      /** @defaultValue `Messages` */
      collection: Messages.AnyConstructor;

      /** @defaultValue `"templates/sidebar/chat-message.html"` */
      template: string;

      /** @defaultValue `"fas fa-comments"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, ChatMessage>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseChatMessage.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseChatMessage.TypeNames, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;

      /** @defaultValue `100` */
      batchSize: number;
    };

    /**
     * Configuration for the Combat document
     */
    Combat: {
      /** @defaultValue `Combat` */
      documentClass: Document.ConfiguredClassForName<"Combat">;

      /** @defaultValue `CombatEncounters` */
      collection: CombatEncounters.AnyConstructor;

      /** @defaultValue `"fas fa-swords"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Combat>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCombat.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCombat.TypeNames, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;

      initiative: {
        /** @defaultValue `null` */
        formula: string | null;

        /** @defaultValue `2` */
        decimals: number;
      };

      /**
       * @defaultValue
       * ```typescript
       * {
       *   "epic": {
       *     label: "COMBAT.Sounds.Epic",
       *     startEncounter: ["sounds/combat/epic-start-3hit.ogg", "sounds/combat/epic-start-horn.ogg"],
       *     nextUp: ["sounds/combat/epic-next-horn.ogg"],
       *     yourTurn: ["sounds/combat/epic-turn-1hit.ogg", "sounds/combat/epic-turn-2hit.ogg"]
       *   },
       *   "mc": {
       *     label: "COMBAT.Sounds.MC",
       *     startEncounter: ["sounds/combat/mc-start-battle.ogg", "sounds/combat/mc-start-begin.ogg", "sounds/combat/mc-start-fight.ogg", "sounds/combat/mc-start-fight2.ogg"],
       *     nextUp: ["sounds/combat/mc-next-itwillbe.ogg", "sounds/combat/mc-next-makeready.ogg", "sounds/combat/mc-next-youare.ogg"],
       *     yourTurn: ["sounds/combat/mc-turn-itisyour.ogg", "sounds/combat/mc-turn-itsyour.ogg"]
       *   }
       * }
       * ```
       */
      sounds: CONFIG.Combat.Sounds;
    };

    /**
     * Configuration for dice rolling behaviors in the Foundry Virtual Tabletop client
     */
    Dice: CONFIG.Dice;

    /**
     * Configuration for the FogExploration document
     */
    FogExploration: {
      /** @defaultValue `FogExploration` */
      documentClass: Document.ConfiguredClassForName<"FogExploration">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `FogExplorations` */
      collection: FogExplorations.AnyConstructor;
    };

    /**
     * Configuration for the Folder entity
     */
    Folder: {
      /** @defaultValue `Folder` */
      documentClass: Document.ConfiguredClassForName<"Folder">;

      /** @defaultValue `Folders` */
      collection: Folders.AnyConstructor;

      /** @defaultValue `"fas fa-folder"` */
      sidebarIcon: string;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.CONST.FOLDER_DOCUMENT_TYPES, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.CONST.FOLDER_DOCUMENT_TYPES, string>;
    };

    /**
     * Configuration for the default Item entity class
     */
    Item: {
      /** @defaultValue `Item` */
      documentClass: Document.ConfiguredClassForName<"Item">;

      /** @defaultValue `Items` */
      collection: Items.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/item-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-suitcase"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Item>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseItem.TypeNames, string>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseItem.TypeNames, Record<string, SheetClassConfig>>;
    };

    /**
     * Configuration for the JournalEntry entity
     */
    JournalEntry: {
      /** @defaultValue `JournalEntry` */
      documentClass: Document.ConfiguredClassForName<"JournalEntry">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Journal` */
      collection: Journal.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/journalentry-banner.webp"` */
      compendiumBanner: string;

      noteIcons: {
        /** @defaultValue `"icons/svg/anchor.svg"` */
        Anchor: string;

        /** @defaultValue `"icons/svg/barrel.svg"` */
        Barrel: string;

        /** @defaultValue `"icons/svg/book.svg"` */
        Book: string;

        /** @defaultValue `"icons/svg/bridge.svg"` */
        Bridge: string;

        /** @defaultValue `"icons/svg/cave.svg"` */
        Cave: string;

        /** @defaultValue `"icons/svg/castle.svg"` */
        Castle: string;

        /** @defaultValue `"icons/svg/chest.svg"` */
        Chest: string;

        /** @defaultValue `"icons/svg/city.svg"` */
        City: string;

        /** @defaultValue `"icons/svg/coins.svg"` */
        Coins: string;

        /** @defaultValue `"icons/svg/fire.svg"` */
        Fire: string;

        /** @defaultValue `"icons/svg/hanging-sign.svg"` */
        "Hanging Sign": string;

        /** @defaultValue `"icons/svg/house.svg"` */
        House: string;

        /** @defaultValue `"icons/svg/mountain.svg"` */
        Mountain: string;

        /** @defaultValue `"icons/svg/oak.svg"` */
        "Oak Tree": string;

        /** @defaultValue `"icons/svg/obelisk.svg"` */
        Obelisk: string;

        /** @defaultValue `"icons/svg/pawprint.svg"` */
        Pawprint: string;

        /** @defaultValue `"icons/svg/ruins.svg"` */
        Ruins: string;

        /** @defaultValue `"icons/svg/skull.svg"` */
        Skull: string;

        /** @defaultValue `"icons/svg/statue.svg"` */
        Statue: string;

        /** @defaultValue `"icons/svg/sword.svg"` */
        Sword: string;

        /** @defaultValue `"icons/svg/tankard.svg"` */
        Tankard: string;

        /** @defaultValue `"icons/svg/temple.svg"` */
        Temple: string;

        /** @defaultValue `"icons/svg/tower.svg"` */
        Tower: string;

        /** @defaultValue `"icons/svg/trap.svg"` */
        Trap: string;

        /** @defaultValue `"icons/svg/village.svg"` */
        Village: string;

        /** @defaultValue `"icons/svg/waterfall.svg"` */
        Waterfall: string;

        /** @defaultValue `"icons/svg/windmill.svg"` */
        Windmill: string;
      } & Record<string, string>;

      /** @defaultValue `"fas fa-book-open"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the Macro entity
     */
    Macro: {
      /** @defaultValue `Macro` */
      documentClass: Document.ConfiguredClassForName<"Macro">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseMacro.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.documents.BaseMacro.TypeNames, string>;

      /** @defaultValue `Macros` */
      collection: Macros.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/macro-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-code"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the default Playlist entity class
     */
    Playlist: {
      /** @defaultValue `Playlist` */
      documentClass: Document.ConfiguredClassForName<"Playlist">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Playlists` */
      collection: Playlists.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/playlist-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-music"` */
      sidebarIcon: string;

      /** @defaultValue `20` */
      autoPreloadSeconds: number;
    };

    /**
     * Configuration for RollTable random draws
     */
    RollTable: {
      /** @defaultValue `RollTable` */
      documentClass: Document.ConfiguredClassForName<"RollTable">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `RollTables` */
      collection: RollTables.AnyConstructor;

      /** @defaultValue `["formula"]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/rolltable-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-th-list"` */
      sidebarIcon: string;

      /** @defaultValue `"icons/svg/d20-black.svg"` */
      resultIcon: string;

      /** @defaultValue `"templates/dice/table-result.html"` */
      resultTemplate: string;
    };

    /**
     * Configuration for the default Scene entity class
     */
    Scene: {
      /** @defaultValue `Scene` */
      documentClass: Document.ConfiguredClassForName<"Scene">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Scenes` */
      collection: Scenes.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/scene-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-map"` */
      sidebarIcon: string;
    };

    Setting: {
      /** @defaultValue `Setting` */
      documentClass: Document.ConfiguredClassForName<"Setting">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `WorldSettings` */
      collection: WorldSettings.AnyConstructor;
    };

    /**
     * Configuration for the User entity, it's roles, and permissions
     */
    User: {
      /** @defaultValue `User` */
      documentClass: Document.ConfiguredClassForName<"User">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Users` */
      collection: Users.AnyConstructor;
    };

    /**
     * Configuration settings for the Canvas and its contained layers and objects
     */
    Canvas: {
      /** @defaultValue `8` */
      blurStrength: number;

      /** @defaultValue `4` */
      blurQuality: number;

      /** @defaultValue `0x303030` */
      darknessColor: number;

      /** @defaultValue `0xeeeeee` */
      daylightColor: number;

      /** @defaultValue `0xffffff` */
      brightestColor: number;

      chatBubblesClass: ChatBubbles.AnyConstructor;

      /** @defaultValue `0.25` */
      darknessLightPenalty: number;

      dispositionColors: {
        /** @defaultValue `0xe72124` */
        HOSTILE: number;

        /** @defaultValue `0xf1d836` */
        NEUTRAL: number;

        /** @defaultValue `0x43dfdf` */
        FRIENDLY: number;

        /** @defaultValue `0x555555` */
        INACTIVE: number;

        /** @defaultValue `0x33bc4e` */
        PARTY: number;

        /** @defaultValue `0xff9829` */
        CONTROLLED: number;

        /** @defaultValue `0xA612D4` */
        SECRET: number;
      };

      /**
       * The class used to render door control icons
       */
      doorControlClass: DoorControl.AnyConstructor;

      /** @defaultValue `0x000000` */
      exploredColor: number;

      /** @defaultValue `0x000000` */
      unexploredColor: number;

      /** @defaultValue `10000` */
      darknessToDaylightAnimationMS: number;

      /** @defaultValue `10000` */
      daylightToDarknessAnimationMS: number;

      darknessSourceClass: foundry.canvas.sources.PointDarknessSource.AnyConstructor;

      lightSourceClass: foundry.canvas.sources.PointLightSource.AnyConstructor;

      globalLightSourceClass: foundry.canvas.sources.GlobalLightSource.AnyConstructor;

      visionSourceClass: foundry.canvas.sources.PointVisionSource.AnyConstructor;

      soundSourceClass: foundry.canvas.sources.PointSoundSource.AnyConstructor;

      groups: CONFIG.Canvas.Groups;

      layers: CONFIG.Canvas.Layers;

      lightLevels: {
        /** @defaultValue `0` */
        dark: number;

        /** @defaultValue `0.5` */
        halfdark: number;

        /** @defaultValue `0.25` */
        dim: number;

        /** @defaultValue `1.0` */
        bright: number;
      };

      /** @defaultValue `FogManager` */
      fogManager: FogManager.AnyConstructor;

      polygonBackends: {
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        sight: PointSourcePolygon.AnyConstructor;
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        light: PointSourcePolygon.AnyConstructor;
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        sound: PointSourcePolygon.AnyConstructor;
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        move: PointSourcePolygon.AnyConstructor;
      };

      /** @defaultValue `number` */
      darknessSourcePaddingMultiplier: number;

      visibilityFilter: VisibilityFilter.AnyConstructor;

      visualEffectsMaskingFilter: VisualEffectsMaskingFilter.AnyConstructor;

      /** @defaultValue `Ruler` */
      rulerClass: Ruler.AnyConstructor;

      /** @defaultValue `0.8` */
      dragSpeedModifier: number;

      /** @defaultValue `3.0` */
      maxZoom: number;

      /** @defaultValue `4` */
      objectBorderThickness: number;

      gridStyles: {
        [key: string]: GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.SolidLines",
         *   shaderClass: GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        solidLines: GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.DashedLines",
         *   shaderClass: GridShader,
         *   shaderOptions: {
         *     style: 1
         *   }
         * }
         * ```
         */
        dashedLines: GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.DottedLines",
         *   shaderClass: GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        dottedLines: GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.SquarePoints",
         *   shaderClass: GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        squarePoints: GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.DiamondPoints",
         *   shaderClass: GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        diamondPoints: GridLayer.GridStyle;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "GRID.STYLES.RoundPoints",
         *   shaderClass: GridShader,
         *   shaderOptions: {
         *     style: 0
         *   }
         * }
         * ```
         */
        roundPoints: GridLayer.GridStyle;
      };

      lightAnimations: CONFIG.Canvas.LightSourceAnimationConfig & {
        flame: {
          /** @defaultValue `"LIGHT.AnimationFame"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateFlickering` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `FlameIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `FlameColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        torch: {
          /** @defaultValue `"LIGHT.AnimationTorch"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTorch` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `TorchIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `TorchColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        revolving: {
          /** @defaultValue `"LIGHT.AnimationRevolving"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `RevolvingColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        siren: {
          /** @defaultValue `"LIGHT.AnimationSiren"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTorch` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `SirenIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `SirenIlluminationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        pulse: {
          /** @defaultValue `"LIGHT.AnimationPulse"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animatePulse` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `PulseIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `PulseColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        chroma: {
          /** @defaultValue `"LIGHT.AnimationChroma"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `ChromaColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        wave: {
          /** @defaultValue `"LIGHT.AnimationWave"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `WaveIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `WaveColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        fog: {
          /** @defaultValue `"LIGHT.AnimationFog"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `FogColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        sunburst: {
          /** @defaultValue `"LIGHT.AnimationSunburst"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `SunburstIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `SunburstColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        dome: {
          /** @defaultValue `"LIGHT.AnimationLightDome"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `LightDomeColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        emanation: {
          /** @defaultValue `"LIGHT.AnimationEmanation"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `EmanationColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        hexa: {
          /** @defaultValue `"LIGHT.AnimationHexaDome";` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `HexaDomeColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        ghost: {
          /** @defaultValue `"LIGHT.AnimationGhostLight"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `GhostLightIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `GhostLightColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        energy: {
          /** @defaultValue `"LIGHT.AnimationEnergyField"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `EnergyFieldColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        vortex: {
          /** @defaultValue `"LIGHT.AnimationVortex"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `VortexIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `VortexColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        witchwave: {
          /** @defaultValue `"LIGHT.AnimationBewitchingWave"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `BewitchingWaveIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `BewitchingWaveColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        rainbowswirl: {
          /** @defaultValue `"LIGHT.AnimationSwirlingRainbow"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `SwirlingRainbowColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        radialrainbow: {
          /** @defaultValue `"LIGHT.AnimationRadialRainbow"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `RadialRainbowColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };

        fairy: {
          /** @defaultValue `"LIGHT.AnimationFairyLight"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `FairyLightIlluminationShader` */
          illuminationShader: AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `FairyLightColorationShader` */
          colorationShader: AdaptiveColorationShader.AnyConstructor;
        };
      };

      darknessAnimations: CONFIG.Canvas.DarknessSourceAnimationConfig;

      /**
       * A registry of Scenes which are managed by a specific SceneManager class.
       */
      // `typeof foundry.canvas.SceneManager` is used because
      managedScenes: Record<string, typeof foundry.canvas.SceneManager>;

      pings: {
        types: {
          /** @defaultValue `"pulse"` */
          PULSE: string;

          /** @defaultValue `"alert"` */
          ALERT: string;

          /** @defaultValue `"chevron"` */
          PULL: string;

          /** @defaultValue `"arrow"` */
          ARROW: string;
        };
        styles: {
          /** @defaultValue `{ class: AlertPing, color: "#ff0000", size: 1.5, duration: 900 }` */
          alert: CONFIG.Canvas.Pings.Style;

          /** @defaultValue `{ class: ArrowPing, size: 1, duration: 900 }` */
          arrow: CONFIG.Canvas.Pings.Style;

          /** @defaultValue `{ class: ChevronPing, size: 1, duration: 2000 }` */
          chevron: CONFIG.Canvas.Pings.Style;

          /** @defaultValue `{ class: PulsePing, size: 1.5, duration: 900 }` */
          pulse: CONFIG.Canvas.Pings.Style;

          [key: string]: CONFIG.Canvas.Pings.Style;
        };

        /** @defaultValue `700` */
        pullSpeed: number;
      };

      targeting: {
        /** @defaultValue `.15` */
        size: number;
      };

      /**
       * The hover-fading configuration.
       */
      hoverFade: {
        /**
         * The delay in milliseconds before the (un)faded animation starts on (un)hover.
         * @defaultValue `250`
         */
        delay: number;

        /**
         * The duration in milliseconds of the (un)fade animation on (un)hover.
         * @defaultValue `750`
         */
        duration: number;
      };

      /**
       * Allow specific transcoders for assets
       * @defaultValue `{ basis: false }`
       */
      transCoders: Record<string, boolean>;

      /**
       * The set of VisionMode definitions which are available to be used for Token vision.
       */
      visionModes: {
        [key: string]: VisionMode;

        /**
         * Default (Basic) Vision
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "basic",
         *   label: "VISION.ModeBasicVision",
         *   vision: {
         *     defaults: { attenuation: 0, contrast: 0, saturation: 0, brightness: 0 }
         *     preferred: true // Takes priority over other vision modes
         *   }
         * })
         * ```
         */
        basic: VisionMode;

        /**
         * Darkvision
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "darkvision",
         *   label: "VISION.ModeDarkvision",
         *     canvas: {
         *       shader: ColorAdjustmentsSamplerShader,
         *       uniforms: { contrast: 0, saturation: -1.0, brightness: 0 }
         *   },
         *   lighting: {
         *     levels: {
         *       [VisionMode.LIGHTING_LEVELS.DIM]: VisionMode.LIGHTING_LEVELS.BRIGHT
         *     },
         *   background: { visibility: VisionMode.LIGHTING_VISIBILITY.REQUIRED }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: -1.0, brightness: 0 }
         *   }
         * })
         * ```
         */
        darkvision: VisionMode;

        /**
         * Darkvision
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "monochromatic",
         *   label: "VISION.ModeMonochromatic",
         *   canvas: {
         *     shader: ColorAdjustmentsSamplerShader,
         *     uniforms: { contrast: 0, saturation: -1.0, brightness: 0 }
         *   },
         *   lighting: {
         *     background: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0, tint: [1, 1, 1] }
         *     },
         *     illumination: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0, tint: [1, 1, 1] }
         *     },
         *     coloration: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0, tint: [1, 1, 1] }
         *     }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: -1, brightness: 0 }
         *   }
         * })
         * ```
         */
        monochromatic: VisionMode;

        /**
         * Blindness
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "blindness",
         *   label: "VISION.ModeBlindness",
         *   tokenConfig: false,
         *   canvas: {
         *     shader: ColorAdjustmentsSamplerShader,
         *     uniforms: { contrast: -0.75, saturation: -1, exposure: -0.3 }
         *   },
         *   lighting: {
         *     background: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     illumination: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     coloration: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { color: null, attenuation: 0, contrast: -0.5, saturation: -1, brightness: -1 }
         *   }
         * }),
         * ```
         */
        blindness: VisionMode;

        /**
         * Tremorsense
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "tremorsense",
         *   label: "VISION.ModeTremorsense",
         *   canvas: {
         *     shader: ColorAdjustmentsSamplerShader,
         *     uniforms: { contrast: 0, saturation: -0.8, exposure: -0.65 }
         *   },
         *   lighting: {
         *     background: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     illumination: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     coloration: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     darkness: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0.2, saturation: -0.3, brightness: 1 },
         *     background: { shader: WaveBackgroundVisionShader },
         *     coloration: { shader: WaveColorationVisionShader }
         *   }
         * }, {animated: true})
         * ```
         */
        tremorsense: VisionMode;

        /**
         * Light Amplification
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "lightAmplification",
         *   label: "VISION.ModeLightAmplification",
         *   canvas: {
         *     shader: AmplificationSamplerShader,
         *     uniforms: { saturation: -0.5, tint: [0.38, 0.8, 0.38] }
         *   },
         *   lighting: {
         *     background: {
         *       visibility: VisionMode.LIGHTING_VISIBILITY.REQUIRED,
         *       postProcessingModes: ["SATURATION", "EXPOSURE"],
         *       uniforms: { saturation: -0.5, exposure: 1.5, tint: [0.38, 0.8, 0.38] }
         *     },
         *     illumination: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -0.5 }
         *     },
         *     coloration: {
         *       postProcessingModes: ["SATURATION", "EXPOSURE"],
         *       uniforms: { saturation: -0.5, exposure: 1.5, tint: [0.38, 0.8, 0.38] }
         *     },
         *     levels: {
         *       [VisionMode.LIGHTING_LEVELS.DIM]: VisionMode.LIGHTING_LEVELS.BRIGHT,
         *       [VisionMode.LIGHTING_LEVELS.BRIGHT]: VisionMode.LIGHTING_LEVELS.BRIGHTEST
         *     }
         *   },
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: -0.5, brightness: 1 },
         *     background: { shader: AmplificationBackgroundVisionShader }
         *   }
         * })
         * ```
         */
        lightAmplification: VisionMode;
      };

      /**
       * The set of DetectionMode definitions which are available to be used for visibility detection.
       */
      detectionModes: {
        [key: string]: DetectionMode;

        lightPerception: DetectionModeLightPerception;

        basicSight: DetectionModeBasicSight;

        seeInvisibility: DetectionModeInvisibility;

        senseInvisibility: DetectionModeInvisibility;

        feelTremor: DetectionModeTremor;

        seeAll: DetectionModeAll;

        senseAll: DetectionModeAll;
      };
    };

    /**
     * Configure the default Token text style so that it may be reused and overridden by modules
     * @defaultValue
     * ```typescript
     * new PIXI.TextStyle({
     *   fontFamily: "Signika",
     *   fontSize: 36,
     *   fill: "#FFFFFF",
     *   stroke: "#111111",
     *   strokeThickness: 1,
     *   dropShadow: true,
     *   dropShadowColor: "#000000",
     *   dropShadowBlur: 2,
     *   dropShadowAngle: 0,
     *   dropShadowDistance: 0,
     *   align: "center",
     *   wordWrap: false,
     *   padding: 1
     * })
     * ```
     **/
    canvasTextStyle: PIXI.TextStyle;

    /**
     * Available Weather Effects implementations
     */
    weatherEffects: {
      [key: string]: CONFIG.WeatherAmbienceConfiguration;

      /**
       * @defaultValue
       * ```ts
       * {
       *   id: "leaves",
       *   label: "WEATHER.AutumnLeaves",
       *   effects: [{
       *     id: "leavesParticles",
       *     effectClass: AutumnLeavesWeatherEffect
       *   }]
       * }
       * ```
       */
      leaves: CONFIG.WeatherAmbienceConfiguration;

      /**
       * @defaultValue
       * ```ts
       * {
       *   id: "rain",
       *   label: "WEATHER.Rain",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "rainShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: RainShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       opacity: 0.25,
       *       tint: [0.7, 0.9, 1.0],
       *       intensity: 1,
       *       strength: 1,
       *       rotation: 0.2618,
       *       speed: 0.2,
       *     }
       *   }]
       * }
       * ```
       */
      rain: CONFIG.WeatherAmbienceConfiguration;

      /**
       * @defaultValue
       * ```
       * {
       *   id: "rainStorm",
       *   label: "WEATHER.RainStorm",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "fogShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: FogShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     performanceLevel: 2,
       *     config: {
       *       slope: 1.5,
       *       intensity: 0.050,
       *       speed: -55.0,
       *       scale: 25,
       *     }
       *   },
       *   {
       *     id: "rainShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: RainShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       opacity: 0.45,
       *       tint: [0.7, 0.9, 1.0],
       *       intensity: 1.5,
       *       strength: 1.5,
       *       rotation: 0.5236,
       *       speed: 0.30,
       *     }
       *   }]
       * }
       * ```
       */
      rainStorm: CONFIG.WeatherAmbienceConfiguration;

      /**
       * @defaultValue
       * ```
       * {
       *   id: "fog",
       *   label: "WEATHER.Fog",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "fogShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: FogShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       slope: 0.45,
       *       intensity: 0.4,
       *       speed: 0.4,
       *     }
       *   }]
       * }
       * ```
       */
      fog: CONFIG.WeatherAmbienceConfiguration;

      /**
       * @defaultValue
       * ```
       * {
       *   id: "snow",
       *   label: "WEATHER.Snow",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "snowShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: SnowShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       tint: [0.85, 0.95, 1],
       *       direction: 0.5,
       *       speed: 2,
       *       scale: 2.5,
       *     }
       *   }]
       * }
       * ```
       * */
      snow: CONFIG.WeatherAmbienceConfiguration;

      /**
       * @defaultValue
       * ```
       * {
       *   id: "blizzard",
       *   label: "WEATHER.Blizzard",
       *   filter: {
       *     enabled: false
       *   },
       *   effects: [{
       *     id: "snowShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: SnowShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     config: {
       *       tint: [0.95, 1, 1],
       *       direction: 0.80,
       *       speed: 8,
       *       scale: 2.5,
       *     }
       *   },
       *   {
       *     id: "fogShader",
       *     effectClass: WeatherShaderEffect,
       *     shaderClass: FogShader,
       *     blendMode: PIXI.BLEND_MODES.SCREEN,
       *     performanceLevel: 2,
       *     config: {
       *       slope: 1.0,
       *       intensity: 0.15,
       *       speed: -4.0,
       *     }
       *   }]
       * }
       * ```
       */
      blizzard: CONFIG.WeatherAmbienceConfiguration;
    };

    /**
     * The control icons used for rendering common HUD operations
     */
    controlIcons: {
      /** @defaultValue `"icons/svg/combat.svg"` */
      combat: string;

      /** @defaultValue `"icons/svg/cowled.svg"` */
      visibility: string;

      /** @defaultValue `"icons/svg/aura.svg"` */
      effects: string;

      /** @defaultValue `"icons/svg/padlock.svg"` */
      lock: string;

      /** @defaultValue `"icons/svg/up.svg"` */
      up: string;

      /** @defaultValue `"icons/svg/down.svg"` */
      down: string;

      /** @defaultValue `"icons/svg/skull.svg"` */
      defeated: string;

      /** @defaultValue `"icons/svg/light.svg"` */
      light: string;

      /** @defaultValue `"icons/svg/light-off.svg"` */
      lightOff: string;

      /** @defaultValue `"icons/svg/explosion.svg"` */
      template: string;

      /** @defaultValue `"icons/svg/sound.svg"` */
      sound: string;

      /** @defaultValue `"icons/svg/sound-off.svg"` */
      soundOff: string;

      /** @defaultValue `"icons/svg/door-closed-outline.svg"` */
      doorClosed: string;

      /** @defaultValue `"icons/svg/door-open-outline.svg"` */
      doorOpen: string;

      /** @defaultValue `"icons/svg/door-secret-outline.svg"` */
      doorSecret: string;

      /** @defaultValue `"icons/svg/door-locked-outline.svg"` */
      doorLocked: string;

      /** @defaultValue `"icons/svg/wall-direction.svg"` */
      wallDirection: string;
    } & Record<string, string>;

    /**
     * A collection of fonts to load either from the user's local system, or remotely.
     * @defaultValue
     * ```typescript
     * {
     *   Arial: { editor: true; fonts: [] };
     *   Amiri: {
     *     editor: true,
     *     fonts: [
     *       {urls: ["fonts/amiri/amiri-regular.woff2"]},
     *       {urls: ["fonts/amiri/amiri-bold.woff2"], weight: 700}
     *     ]
     *   },
     *   "Bruno Ace": {editor: true, fonts: [
     *     {urls: ["fonts/bruno-ace/bruno-ace.woff2"]}
     *   ]},
     *   Courier: { editor: true; fonts: [] };
     *   "Courier New": { editor: true; fonts: [] };
     *   "Modesto Condensed": {
     *     editor: true;
     *     fonts: [
     *       { urls: ["fonts/modesto-condensed/modesto-condensed.woff2"] },
     *       { urls: ["fonts/modesto-condensed/modesto-condensed-bold.woff2"]; weight: 700 }
     *     ];
     *   };
     *   Signika: {
     *     editor: true;
     *     fonts: [
     *       { urls: ["fonts/signika/signika-regular.woff2"] },
     *       { urls: ["fonts/signika/signika-bold.woff2"]; weight: 700 }
     *     ];
     *   };
     *   Times: { editor: true; fonts: [] };
     *   "Times New Roman": { editor: true; fonts: [] };
     * }
     * ```
     */
    fontDefinitions: Record<string, CONFIG.Font.FamilyDefinition>;

    /**
     * The default font family used for text labels on the PIXI Canvas
     * @defaultValue `"Signika"`
     */
    defaultFontFamily: string;

    /**
     * The array of status effect icons which can be applied to an Actor
     * @defaultValue
     * ```js
     * [
     *   {
     *     id: "dead";
     *     name: "EFFECT.StatusDead";
     *     img: "icons/svg/skull.svg";
     *   },
     *   {
     *     id: "unconscious";
     *     name: "EFFECT.StatusUnconscious";
     *     img: "icons/svg/unconscious.svg";
     *   },
     *   {
     *     id: "sleep";
     *     name: "EFFECT.StatusAsleep";
     *     img: "icons/svg/sleep.svg";
     *   },
     *   {
     *     id: "stun";
     *     name: "EFFECT.StatusStunned";
     *     img: "icons/svg/daze.svg";
     *   },
     *   {
     *     id: "prone";
     *     name: "EFFECT.StatusProne";
     *     img: "icons/svg/falling.svg";
     *   },
     *   {
     *     id: "restrain";
     *     name: "EFFECT.StatusRestrained";
     *     img: "icons/svg/net.svg";
     *   },
     *   {
     *     id: "paralysis";
     *     name: "EFFECT.StatusParalysis";
     *     img: "icons/svg/paralysis.svg";
     *   },
     *   {
     *     id: "fly";
     *     name: "EFFECT.StatusFlying";
     *     img: "icons/svg/wing.svg";
     *   },
     *   {
     *     id: "blind";
     *     name: "EFFECT.StatusBlind";
     *     img: "icons/svg/blind.svg";
     *   },
     *   {
     *     id: "deaf";
     *     name: "EFFECT.StatusDeaf";
     *     img: "icons/svg/deaf.svg";
     *   },
     *   {
     *     id: "silence";
     *     name: "EFFECT.StatusSilenced";
     *     img: "icons/svg/silenced.svg";
     *   },
     *   {
     *     id: "fear";
     *     name: "EFFECT.StatusFear";
     *     img: "icons/svg/terror.svg";
     *   },
     *   {
     *     id: "burning";
     *     name: "EFFECT.StatusBurning";
     *     img: "icons/svg/fire.svg";
     *   },
     *   {
     *     id: "frozen";
     *     name: "EFFECT.StatusFrozen";
     *     img: "icons/svg/frozen.svg";
     *   },
     *   {
     *     id: "shock";
     *     name: "EFFECT.StatusShocked";
     *     img: "icons/svg/lightning.svg";
     *   },
     *   {
     *     id: "corrode";
     *     name: "EFFECT.StatusCorrode";
     *     img: "icons/svg/acid.svg";
     *   },
     *   {
     *     id: "bleeding";
     *     name: "EFFECT.StatusBleeding";
     *     img: "icons/svg/blood.svg";
     *   },
     *   {
     *     id: "disease";
     *     name: "EFFECT.StatusDisease";
     *     img: "icons/svg/biohazard.svg";
     *   },
     *   {
     *     id: "poison";
     *     name: "EFFECT.StatusPoison";
     *     img: "icons/svg/poison.svg";
     *   },
     *   {
     *     id: "curse";
     *     name: "EFFECT.StatusCursed";
     *     img: "icons/svg/sun.svg";
     *   },
     *   {
     *     id: "regen";
     *     name: "EFFECT.StatusRegen";
     *     img: "icons/svg/regen.svg";
     *   },
     *   {
     *     id: "degen";
     *     name: "EFFECT.StatusDegen";
     *     img: "icons/svg/degen.svg";
     *   },
     *   {
     *     id: "hover";
     *     name: "EFFECT.StatusHover";
     *     img: "icons/svg/wingfoot.svg";
     *   },
     *   {
     *     id: "burrow";
     *     name: "EFFECT.StatusBurrow";
     *     img: "icons/svg/mole.svg";
     *   },
     *   {
     *     id: "upgrade";
     *     name: "EFFECT.StatusUpgrade";
     *     img: "icons/svg/upgrade.svg";
     *   },
     *   {
     *     id: "downgrade";
     *     name: "EFFECT.StatusDowngrade";
     *     img: "icons/svg/downgrade.svg";
     *   },
     *   {
     *     id: "invisible",
     *     name: "EFFECT.StatusInvisible",
     *     img: "icons/svg/invisible.svg"
     *   },
     *   {
     *     id: "target";
     *     name: "EFFECT.StatusTarget";
     *     img: "icons/svg/target.svg";
     *   },
     *   {
     *     id: "eye";
     *     name: "EFFECT.StatusMarked";
     *     img: "icons/svg/eye.svg";
     *   },
     *   {
     *     id: "bless";
     *     name: "EFFECT.StatusBlessed";
     *     img: "icons/svg/angel.svg";
     *   },
     *   {
     *     id: "fireShield";
     *     name: "EFFECT.StatusFireShield";
     *     img: "icons/svg/fire-shield.svg";
     *   },
     *   {
     *     id: "coldShield";
     *     name: "EFFECT.StatusIceShield";
     *     img: "icons/svg/ice-shield.svg";
     *   },
     *   {
     *     id: "magicShield";
     *     name: "EFFECT.StatusMagicShield";
     *     img: "icons/svg/mage-shield.svg";
     *   },
     *   {
     *     id: "holyShield";
     *     name: "EFFECT.StatusHolyShield";
     *     img: "icons/svg/holy-shield.svg";
     *   }
     * ]
     * ```
     */
    statusEffects: CONFIG.StatusEffect[];

    /**
     * A mapping of status effect IDs which provide some additional mechanical integration.
     * @defaultValue `{ DEFEATED: "dead", INVISIBLE: "invisible", BLIND: "blind", BURROW: "burrow", HOVER: "hover", FLY: "fly" }`
     */
    specialStatusEffects: HandleEmptyObject<CONFIG.SpecialStatusEffects, CONFIG.DefaultSpecialStatusEffects>;

    /**
     * A mapping of core audio effects used which can be replaced by systems or mods
     */
    sounds: {
      /** @defaultValue `"sounds/dice.wav"` */
      dice: string;

      /** @defaultValue `"sounds/lock.wav"` */
      lock: string;

      /** @defaultValue `"sounds/notify.wav"` */
      notification: string;

      /** @defaultValue `"sounds/drums.wav"` */
      combat: string;
    };

    /**
     * Define the set of supported languages for localization
     * @defaultValue `{ en: "English" }`
     */
    supportedLanguages: {
      en: string;
    } & Record<string, string>;

    /**
     * Localization constants.
     */
    i18n: {
      /**
       * In operations involving the document index, search prefixes must have at least this many characters to avoid too
       * large a search space. Languages that have hundreds or thousands of characters will typically have very shallow
       * search trees, so it should be safe to lower this number in those cases.
       * @defaultValue `4`
       */
      searchMinimumCharacterLength: number;
    };

    /**
     * Configuration for time tracking
     */
    time: {
      /** @defaultValue `0` */
      turnTime: number;

      /** @defaultValue `0` */
      roundTime: number;
    };

    /**
     * Configuration for the ActiveEffect embedded document type
     */
    ActiveEffect: {
      /** @defaultValue `ActiveEffect` */
      documentClass: Document.ConfiguredClassForName<"ActiveEffect">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, ActiveEffect>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseActiveEffect.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseActiveEffect.TypeNames, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;

      /**
       * If true, Active Effects on Items will be copied to the Actor when the Item is created on the Actor if the
       * Active Effect's transfer property is true, and will be deleted when that Item is deleted from the Actor.
       * If false, Active Effects are never copied to the Actor, but will still apply to the Actor from within the Item
       * if the transfer property on the Active Effect is true.
       * @remarks Foundry states "\@deprecated since v11" but this is misleading for actual use
       */
      legacyTransferral: boolean;
    };

    /**
     * Configuration for the ActorDelta embedded document type.
     */
    ActorDelta: {
      /** @defaultValue `ActorDelta` */
      documentClass: Document.ConfiguredClassForName<"ActorDelta">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;
    };

    /**
     * Configuration for the Card embedded Document type
     */
    Card: {
      /** @defaultValue `Card` */
      documentClass: Document.ConfiguredClassForName<"Card">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Card>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCard.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCard.TypeNames, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;
    };

    /**
     * Configuration for the TableResult embedded document type
     */
    TableResult: {
      /** @defaultValue `TableResult` */
      documentClass: Document.ConfiguredClassForName<"TableResult">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseTableResult.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.documents.BaseTableResult.TypeNames, string>;
    };

    JournalEntryPage: {
      /** @defaultValue `JournalEntryPage` */
      documentClass: Document.ConfiguredClassForName<"JournalEntryPage">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, JournalEntryPage>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseJournalEntryPage.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseJournalEntryPage.TypeNames, string>;

      typeIcons: {
        [type: string]: string;

        /** @defaultValue `"fas fa-file-image"` */
        image: string;
        /** @defaultValue `"fas fa-file-pdf"` */
        pdf: string;
        /** @defaultValue `"fas fa-file-lines"` */
        text: string;
        /** @defaultValue `"fas fa-file-video"` */
        video: string;
      };

      /** @defaultValue `"text"` */
      defaultType: string;

      /** @defaultValue `"fas fa-book-open"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the ActiveEffect embedded document type
     */
    PlaylistSound: {
      /** @defaultValue `PlaylistSound` */
      documentClass: Document.ConfiguredClassForName<"PlaylistSound">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;
    };

    /**
     * Configuration for the AmbientLight embedded document type and its representation on the game Canvas
     */
    AmbientLight: {
      /** @defaultValue `AmbientLightDocument` */
      documentClass: Document.ConfiguredClassForName<"AmbientLight">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof AmbientLightDocument` */
      objectClass: ConfiguredObjectClassOrDefault<typeof AmbientLight>;

      /** @defaultValue `typeof LightingLayer` */
      layerClass: LightingLayer.AnyConstructor;
    };

    /**
     * Configuration for the AmbientSound embedded document type and its representation on the game Canvas
     */
    AmbientSound: {
      /** @defaultValue `AmbientSoundDocument` */
      documentClass: Document.ConfiguredClassForName<"AmbientSound">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof AmbientSound` */
      objectClass: ConfiguredObjectClassOrDefault<typeof AmbientSound>;

      /** @defaultValue `typeof SoundsLayer` */
      layerClass: SoundsLayer.AnyConstructor;
    };

    /**
     * Configuration for the Combatant embedded document type within a Combat document
     */
    Combatant: {
      /** @defaultValue `Combatant` */
      documentClass: Document.ConfiguredClassForName<"Combatant">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Combatant>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCombatant.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCombatant.TypeNames, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;
    };

    /**
     * Configuration for the Drawing embedded document type and its representation on the game Canvas
     */
    Drawing: {
      /** @defaultValue `DrawingDocument` */
      documentClass: Document.ConfiguredClassForName<"Drawing">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Drawing` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Drawing>;

      /** @defaultValue `typeof DrawingsLayer` */
      layerClass: typeof DrawingsLayer;

      /** @defaultValue `typeof DrawingHUD` */
      hudClass: typeof DrawingHUD;
    };

    /**
     * Configuration for the MeasuredTemplate embedded document type and its representation on the game Canvas
     */
    MeasuredTemplate: {
      defaults: {
        /** @defaultValue `53.13` */
        angle: number;

        /** @defaultValue `1` */
        width: number;
      };

      types: {
        /** @defaultValue `"Circle"` */
        circle: string;

        /** @defaultValue `"Cone"` */
        cone: string;

        /** @defaultValue `"Rectangle"` */
        rect: string;

        /** @defaultValue `"Ray"` */
        ray: string;
      };

      /** @defaultValue `MeasuredTemplateDocument` */
      documentClass: Document.ConfiguredClassForName<"MeasuredTemplate">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof MeasuredTemplate` */
      objectClass: ConfiguredObjectClassOrDefault<typeof MeasuredTemplate>;

      /** @defaultValue `typeof TemplateLayer` */
      layerClass: typeof TemplateLayer;
    };

    /**
     * Configuration for the Note embedded document type and its representation on the game Canvas
     */
    Note: {
      /** @defaultValue `NoteDocument` */
      documentClass: Document.ConfiguredClassForName<"Note">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Note` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Note>;

      /** @defaultValue `typeof NotesLayer` */
      layerClass: NotesLayer.AnyConstructor;
    };

    Region: {
      /** @defaultValue `RegionDocument` */
      documentClass: Document.ConfiguredClassForName<"Region">;

      /** @defaultValue `Region` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Region>;

      /** @defaultValue `RegionLayer` */
      layerClass: RegionLayer.AnyConstructor;

      /**
       * @remarks added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;
    };

    /**
     * Configuration for the Tile embedded document type and its representation on the game Canvas
     */
    Tile: {
      /** @defaultValue `TileDocument` */
      documentClass: Document.ConfiguredClassForName<"Tile">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Tile` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Tile>;

      /** @defaultValue `typeof TilesLayer` */
      layerClass: TilesLayer.AnyConstructor;

      /** @defaultValue `typeof TileHUD` */
      hudClass: TileHUD.AnyConstructor;
    };

    /**
     * Configuration for the Token embedded document type and its representation on the game Canvas
     */
    Token: {
      /** @defaultValue `TokenDocument` */
      documentClass: Document.ConfiguredClassForName<"Token">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Token` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Token>;

      /** @defaultValue `typeof TokenLayer` */
      layerClass: TokenLayer.AnyConstructor;

      /** @defaultValue `typeof TokenConfig` */
      prototypeSheetClass: TokenConfig.AnyConstructor;

      /** @defaultValue `typeof TokenHUD` */
      hudClass: TokenHUD.AnyConstructor;

      /** @defaultValue `"TOKEN.Adjectives"` */
      adjectivesPrefix: string;

      /**
       * @defaultValue `foundry.canvas.tokens.TokenRingConfig`
       * @remarks `"ring property is initialized in foundry.canvas.tokens.TokenRingConfig.initialize"`
       */
      readonly ring: foundry.canvas.tokens.TokenRingConfig;
    };

    /**
     * Configuration for the Wall embedded document type and its representation on the game Canvas
     */
    Wall: {
      /** @defaultValue `WallDocument` */
      documentClass: Document.ConfiguredClassForName<"Wall">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Wall` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Wall>;

      /** @defaultValue `typeof WallsLayer` */
      layerClass: WallsLayer.AnyConstructor;

      /** @defaultValue `1` */
      thresholdAttenuationMultiplier: number;

      doorSounds: {
        [sound: string]: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.FuturisticFast",
         *   close: "sounds/doors/futuristic/close-fast.ogg",
         *   lock: "sounds/doors/futuristic/lock.ogg",
         *   open: "sounds/doors/futuristic/open-fast.ogg",
         *   test: "sounds/doors/futuristic/test.ogg",
         *   unlock: "sounds/doors/futuristic/unlock.ogg"
         * }
         * ```
         */
        futuristicFast: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.FuturisticHydraulic",
         *   close: "sounds/doors/futuristic/close-hydraulic.ogg",
         *   lock: "sounds/doors/futuristic/lock.ogg",
         *   open: "sounds/doors/futuristic/open-hydraulic.ogg",
         *   test: "sounds/doors/futuristic/test.ogg",
         *   unlock: "sounds/doors/futuristic/unlock.ogg"
         * }
         * ```
         */
        futuristicHydraulic: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.FuturisticForcefield",
         *   close: "sounds/doors/futuristic/close-forcefield.ogg",
         *   lock: "sounds/doors/futuristic/lock.ogg",
         *   open: "sounds/doors/futuristic/open-forcefield.ogg",
         *   test: "sounds/doors/futuristic/test-forcefield.ogg",
         *   unlock: "sounds/doors/futuristic/unlock.ogg"
         * }
         * ```
         */
        futuristicForcefield: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.Industrial",
         *   close: "sounds/doors/industrial/close.ogg",
         *   lock: "sounds/doors/industrial/lock.ogg",
         *   open: "sounds/doors/industrial/open.ogg",
         *   test: "sounds/doors/industrial/test.ogg",
         *   unlock: "sounds/doors/industrial/unlock.ogg"
         * }
         * ```
         */
        industrial: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.IndustrialCreaky",
         *   close: "sounds/doors/industrial/close-creaky.ogg",
         *   lock: "sounds/doors/industrial/lock.ogg",
         *   open: "sounds/doors/industrial/open-creaky.ogg",
         *   test: "sounds/doors/industrial/test.ogg",
         *   unlock: "sounds/doors/industrial/unlock.ogg"
         * }
         * ```
         */
        industrialCreaky: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.Jail",
         *   close: "sounds/doors/jail/close.ogg",
         *   lock: "sounds/doors/jail/lock.ogg",
         *   open: "sounds/doors/jail/open.ogg",
         *   test: "sounds/doors/jail/test.ogg",
         *   unlock: "sounds/doors/jail/unlock.ogg"
         * }
         * ```
         */
        jail: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.MagicDoor",
         *   close: "sounds/doors/magic/door-close.ogg",
         *   lock: "sounds/doors/magic/lock.ogg",
         *   open: "sounds/doors/magic/door-open.ogg",
         *   test: "sounds/doors/magic/test.ogg",
         *   unlock: "sounds/doors/magic/unlock.ogg"
         * }
         * ```
         */
        magicDoor: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.MagicWall",
         *   close: "sounds/doors/magic/wall-close.ogg",
         *   lock: "sounds/doors/magic/lock.ogg",
         *   open: "sounds/doors/magic/wall-open.ogg",
         *   test: "sounds/doors/magic/test.ogg",
         *   unlock: "sounds/doors/magic/unlock.ogg"
         * }
         * ```
         */
        magicWall: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.Metal",
         *   close: "sounds/doors/metal/close.ogg",
         *   lock: "sounds/doors/metal/lock.ogg",
         *   open: "sounds/doors/metal/open.ogg",
         *   test: "sounds/doors/metal/test.ogg",
         *   unlock: "sounds/doors/metal/unlock.ogg"
         * }
         * ```
         */
        metal: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.SlidingMetal",
         *   close: "sounds/doors/shutter/close.ogg",
         *   lock: "sounds/doors/shutter/lock.ogg",
         *   open: "sounds/doors/shutter/open.ogg",
         *   test: "sounds/doors/shutter/test.ogg",
         *   unlock: "sounds/doors/shutter/unlock.ogg"
         * }
         * ```
         */
        slidingMetal: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.SlidingModern",
         *   close: "sounds/doors/sliding/close.ogg",
         *   lock: "sounds/doors/sliding/lock.ogg",
         *   open: "sounds/doors/sliding/open.ogg",
         *   test: "sounds/doors/sliding/test.ogg",
         *   unlock: "sounds/doors/sliding/unlock.ogg"
         * }
         * ```
         */
        slidingModern: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.SlidingWood",
         *   close: "sounds/doors/sliding/close-wood.ogg",
         *   lock: "sounds/doors/sliding/lock.ogg",
         *   open: "sounds/doors/sliding/open-wood.ogg",
         *   test: "sounds/doors/sliding/test.ogg",
         *   unlock: "sounds/doors/sliding/unlock.ogg"
         * }
         * ```
         */
        slidingWood: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.StoneBasic",
         *   close: "sounds/doors/stone/close.ogg",
         *   lock: "sounds/doors/stone/lock.ogg",
         *   open: "sounds/doors/stone/open.ogg",
         *   test: "sounds/doors/stone/test.ogg",
         *   unlock: "sounds/doors/stone/unlock.ogg"
         * }
         * ```
         */
        stoneBasic: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.StoneRocky",
         *   close: "sounds/doors/stone/close-rocky.ogg",
         *   lock: "sounds/doors/stone/lock.ogg",
         *   open: "sounds/doors/stone/open-rocky.ogg",
         *   test: "sounds/doors/stone/test.ogg",
         *   unlock: "sounds/doors/stone/unlock.ogg"
         * }
         * ```
         */
        stoneRocky: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.StoneSandy",
         *   close: "sounds/doors/stone/close-sandy.ogg",
         *   lock: "sounds/doors/stone/lock.ogg",
         *   open: "sounds/doors/stone/open-sandy.ogg",
         *   test: "sounds/doors/stone/test.ogg",
         *   unlock: "sounds/doors/stone/unlock.ogg"
         * }
         * ```
         */
        stoneSandy: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.WoodBasic",
         *   close: "sounds/doors/wood/close.ogg",
         *   lock: "sounds/doors/wood/lock.ogg",
         *   open: "sounds/doors/wood/open.ogg",
         *   test: "sounds/doors/wood/test.ogg",
         *   unlock: "sounds/doors/wood/unlock.ogg"
         * }
         * ```
         */
        woodBasic: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.WoodCreaky",
         *   close: "sounds/doors/wood/close-creaky.ogg",
         *   lock: "sounds/doors/wood/lock.ogg",
         *   open: "sounds/doors/wood/open-creaky.ogg",
         *   test: "sounds/doors/wood/test.ogg",
         *   unlock: "sounds/doors/wood/unlock.ogg"
         * }
         * ```
         */
        woodCreaky: CONFIG.WallDoorSound;

        /**
         * @defaultValue
         * ```ts
         * {
         *   label: "WALLS.DoorSound.WoodHeavy",
         *   close: "sounds/doors/wood/close-heavy.ogg",
         *   lock: "sounds/doors/wood/lock.ogg",
         *   open: "sounds/doors/wood/open-heavy.ogg",
         *   test: "sounds/doors/wood/test.ogg",
         *   unlock: "sounds/doors/wood/unlock.ogg"
         * }
         * ```
         */
        woodHeavy: CONFIG.WallDoorSound;
      };
    };

    /**
     * An enumeration of sound effects which can be applied to Sound instances.
     */
    soundEffects: {
      lowPass: { label: string; effectClass: AudioNode.AnyConstructor };
      highpass: { label: string; effectClass: AudioNode.AnyConstructor };
      reverb: { label: string; effectClass: AudioNode.AnyConstructor };
    };

    /**
     * Default configuration options for TinyMCE editors
     */
    TinyMCE: tinyMCE.RawEditorOptions;

    /**
     * Rich text editing configuration.
     */
    TextEditor: {
      /**
       * A collection of custom enrichers that can be applied to text content, allowing for the matching and handling of
       * custom patterns.
       */
      enrichers: TextEditor.EnricherConfig[];
    };

    /**
     * Configuration for the WebRTC implementation class
     */
    WebRTC: {
      /** @defaultValue `SimplePeerAVClient` */
      clientClass: GetKey<WebRTCConfig, "clientClass", SimplePeerAVClient.AnyConstructor>;

      /** @defaultValue `50` */
      detectPeerVolumeInterval: number;

      /** @defaultValue `20` */
      detectSelfVolumeInterval: number;

      /** @defaultValue `25` */
      emitVolumeInterval: number;

      /** @defaultValue `2` */
      speakingThresholdEvents: number;

      /** @defaultValue `10` */
      speakingHistoryLength: number;

      /** @defaultValue `8` */
      connectedUserPollIntervalS: number;
    };

    /**
     * Configure the Application classes used to render various core UI elements in the application
     */
    ui: CONFIG.UI;
  }

  namespace CONFIG {
    interface UI {
      /** @defaultValue `MainMenu` */
      menu: MainMenu.AnyConstructor;

      /** @defaultValue `Sidebar` */
      sidebar: Sidebar.AnyConstructor;

      /** @defaultValue `Pause` */
      pause: Pause.AnyConstructor;

      /** @defaultValue `SceneNavigation` */
      nav: SceneNavigation.AnyConstructor;

      /** @defaultValue `Notifications` */
      notifications: Notifications.AnyConstructor;

      /** @defaultValue `ActorDirectory` */
      actors: ActorDirectory.AnyConstructor;

      /** @defaultValue `CardsDirectory` */
      cards: CardsDirectory.AnyConstructor;

      /** @defaultValue `ChatLog` */
      chat: ChatLog.AnyConstructor;

      /** @defaultValue `CombatTracker` */
      combat: CombatTracker.AnyConstructor;

      /** @defaultValue `CompendiumDirectory` */
      compendium: CompendiumDirectory.AnyConstructor;

      /** @defaultValue `SceneControls` */
      controls: SceneControls.AnyConstructor;

      /** @defaultValue `Hotbar` */
      hotbar: Hotbar.AnyConstructor;

      /** @defaultValue `ItemDirectory` */
      items: ItemDirectory.AnyConstructor;

      /** @defaultValue `JournalDirectory` */
      journal: JournalDirectory.AnyConstructor;

      /** @defaultValue `MacroDirectory` */
      macros: MacroDirectory.AnyConstructor;

      /** @defaultValue `PlayerList` */
      players: PlayerList.AnyConstructor;

      /** @defaultValue `PlaylistDirectory` */
      playlists: PlaylistDirectory.AnyConstructor;

      /** @defaultValue `SceneDirectory` */
      scenes: SceneDirectory.AnyConstructor;

      /** @defaultValue `Settings` */
      settings: Settings.AnyConstructor;

      /** @defaultValue `RollTableDirectory` */
      tables: RollTableDirectory.AnyConstructor;

      /** @defaultValue `CameraViews` */
      webrtc: CameraViews.AnyConstructor;
    }

    namespace Canvas {
      interface Groups {
        /** @defaultValue `{ groupClass: HiddenCanvasGroup, parent: "stage" }` */
        hidden: CONFIG.Canvas.GroupDefinition<typeof HiddenCanvasGroup>;

        /** @defaultValue `{ groupClass: RenderedCanvasGroup, parent: "stage" }` */
        rendered: CONFIG.Canvas.GroupDefinition<typeof RenderedCanvasGroup>;

        /** @defaultValue `{ groupClass: EnvironmentCanvasGroup, parent: "rendered" }` */
        environment: CONFIG.Canvas.GroupDefinition<typeof EnvironmentCanvasGroup>;

        /** @defaultValue `{ groupClass: PrimaryCanvasGroup, parent: "environment" }` */
        primary: CONFIG.Canvas.GroupDefinition<typeof PrimaryCanvasGroup>;

        /** @defaultValue `{ groupClass: EffectsCanvasGroup, parent: "environment" }` */
        effects: CONFIG.Canvas.GroupDefinition<typeof EffectsCanvasGroup>;

        /** @defaultValue `{ groupClass: CanvasVisibility, parent: "rendered" }` */
        visibility: CONFIG.Canvas.GroupDefinition<typeof CanvasVisibility>;

        /** @defaultValue `{ groupClass: InterfaceCanvasGroup, parent: "rendered", zIndexDrawings: 500, zIndexScrollingText: 1100 }` */
        interface: CONFIG.Canvas.GroupDefinition<typeof InterfaceCanvasGroup>;

        /** @defaultValue `{ groupClass: OverlayCanvasGroup, parent: "stage" }` */
        overlay: CONFIG.Canvas.GroupDefinition<typeof OverlayCanvasGroup>;
      }

      interface Layers {
        /** @defaultValue `{ layerClass: WeatherLayer, group: "primary" }` */
        weather: LayerDefinition<typeof WeatherEffects, "primary">;

        /** @defaultValue `{ layerClass: GridLayer, group: "interface" }` */
        grid: LayerDefinition<typeof GridLayer, "interface">;

        /** @defaultValue `{ layerClass: RegionLayer, group: "interface" }` */
        // regions: LayerDefinition<typeof RegionLayer, "interface">;

        /** @defaultValue `{ layerClass: DrawingsLayer, group: "interface" }` */
        drawings: LayerDefinition<typeof DrawingsLayer, "interface">;

        /** @defaultValue `{ layerClass: TemplateLayer, group: "interface" }` */
        templates: LayerDefinition<typeof TemplateLayer, "interface">;

        /** @defaultValue `{ layerClass: TokenLayer, group: "interface" }` */
        tiles: LayerDefinition<typeof TilesLayer, "interface">;

        /** @defaultValue `{ layerClass: WallsLayer, group: "interface" }` */
        walls: LayerDefinition<typeof WallsLayer, "interface">;

        /** @defaultValue `{ layerClass: TokenLayer, group: "interface" }` */
        tokens: LayerDefinition<typeof TokenLayer, "interface">;

        /** @defaultValue `{ layerClass: SoundsLayer, group: "interface" }` */
        sounds: LayerDefinition<typeof SoundsLayer, "interface">;

        /** @defaultValue `{ layerClass: LightingLayer, group: "interface" }` */
        lighting: LayerDefinition<typeof LightingLayer, "interface">;

        /** @defaultValue `{ layerClass: NotesLayer, group: "interface" }` */
        notes: LayerDefinition<typeof NotesLayer, "interface">;

        /** @defaultValue `{ layerClass: ControlsLayer, group: "interface" }` */
        controls: LayerDefinition<typeof ControlsLayer, "interface">;
      }

      // This requires `CanvasGroupConstructor` because `Canvas##createGroups` assumes there's no parameters.
      interface GroupDefinition<GroupClass extends CanvasGroupConstructor = CanvasGroupConstructor> {
        groupClass: GroupClass;
        parent: string;
        zIndexDrawings?: number;
        zIndexScrollingText?: number;
      }

      // This requires `typeof CanvasLayer` because `CanvasGroupMixin#_createLayers` assumes there's no parameters.
      interface LayerDefinition<LayerClass extends typeof CanvasLayer, Group extends keyof CONFIG["Canvas"]["groups"]> {
        layerClass: LayerClass;
        group: Group;
      }

      interface GridStyle {
        label: string;
        shaderClass: GridShader.AnyConstructor;
        shaderOptions: {
          style: number;
        };
      }

      /**
       * A light source animation configuration object.
       */
      type LightSourceAnimationConfig = Record<
        string,
        {
          label: string;
          animation: BaseLightSource.LightAnimationFunction;
          backgroundShader?: AdaptiveBackgroundShader.AnyConstructor;
          illuminationShader?: AdaptiveIlluminationShader.AnyConstructor;
          colorationShader?: AdaptiveColorationShader.AnyConstructor;
        }
      >;

      /**
       * A darkness source animation configuration object.
       */
      type DarknessSourceAnimationConfig = Record<
        string,
        {
          label: string;
          animation: BaseLightSource.LightAnimationFunction;
          darknessShader: AdaptiveDarknessShader.AnyConstructor;
        }
      >;

      namespace Pings {
        interface Style {
          class: unknown;
          color?: string;
          size: number;
          duration: number;
        }
      }
    }

    interface WeatherAmbienceConfiguration {
      id: string;
      label: string;
      filter: {
        enabled: boolean;
        blendMode: PIXI.BLEND_MODES;
      };
      effects: WeatherEffectConfiguration;
    }

    interface WeatherEffectConfiguration {
      id: string;
      effectClass: ParticleEffect | WeatherShaderEffect.AnyConstructor;
      blendMode: PIXI.BLEND_MODES;
      config: Record<string, unknown>;
    }

    // The point of this interface is to be declaration merged into so you can override `DefaultSpecialStatusEffects` and remove existing keys. It's never used when empty.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface SpecialStatusEffects {}

    interface DefaultSpecialStatusEffects {
      DEFEATED: string;
      INVISIBLE: string;
      BLIND: string;
      BURROW: string;
      HOVER: string;
      FLY: string;
    }

    namespace Cards {
      interface Preset {
        type: string;
        label: string;
        src: string;
      }
    }
    namespace Combat {
      interface SoundPreset {
        label: string;
        startEncounter: string[];
        nextUp: string[];
        yourTurn: string[];
      }
    }

    namespace Font {
      interface Definition extends FontFaceDescriptors {
        url: string[];
      }

      interface FamilyDefinition {
        editor: boolean;
        fonts: Definition[];
      }
    }

    interface WallDoorSound {
      /** A localization string label */
      label: string;

      /** A sound path when the door is closed */
      close: string;

      /** A sound path when the door becomes locked */
      lock: string;

      /** A sound path when opening the door */
      open: string;

      /** A sound path when attempting to open a locked door */
      test: string;

      /** A sound path when the door becomes unlocked */
      unlock: string;
    }

    namespace Dice {
      interface RollModes extends Record<foundry.CONST.DICE_ROLL_MODES, string> {}
    }

    namespace Combat {
      interface Sounds {
        epic: CONFIG.Combat.SoundPreset;
        mc: CONFIG.Combat.SoundPreset;
      }
    }
  }

  const CONFIG: CONFIG;
}

type ConfiguredObjectClassOrDefault<Fallback extends PlaceableObject.AnyConstructor> = GetKey<
  PlaceableObjectClassConfig,
  Fallback["embeddedName"],
  Fallback
>;

interface SheetClassConfig {
  canBeDefault: boolean;

  canConfigure: boolean;

  cls: DocumentSheet.AnyConstructor;

  default: boolean;

  id: string;

  label: string;
}

type PixiContainerConstructor = PIXI.Container.AnyConstructor;
interface CanvasGroup extends PIXI.Container {
  sortableChildren: boolean;
}

interface CanvasGroupConstructor extends PixiContainerConstructor {
  new (): CanvasGroup;

  /**
   * The name of this canvas group
   * @remarks Can be undefined in some cases (e.g `EffectsCanvasGroup`) to prevent other groups using it as a parent
   */
  groupName?: string | undefined;
}
