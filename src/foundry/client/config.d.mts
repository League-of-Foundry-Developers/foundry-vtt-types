import type * as CONST from "#common/constants.d.mts";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type {
  GetKey,
  AnyObject,
  HandleEmptyObject,
  MaybePromise,
  ConcreteKeys,
  RemoveIndexSignatures,
  InexactPartial,
  Brand,
  InterfaceToObject,
} from "#utils";
import type BaseLightSource from "#client/canvas/sources/base-light-source.d.mts";
import type RenderedEffectSource from "#client/canvas/sources/rendered-effect-source.d.mts";
import type * as shaders from "#client/canvas/rendering/shaders/_module.d.mts";
import type * as canvasLayers from "#client/canvas/layers/_module.d.mts";
import type * as canvasGroups from "#client/canvas/groups/_module.d.mts";
import type * as perception from "#client/canvas/perception/_module.d.mts";
import type * as placeables from "#client/canvas/placeables/_module.d.mts";
import type { DoorControl, DoorMesh } from "#client/canvas/containers/_module.d.mts";
import type * as geometry from "#client/canvas/geometry/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";

import SimplePeerAVClient = foundry.av.clients.SimplePeerAVClient;

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

      type RollFunction = (...args: Array<string | number>) => MaybePromise<number | `${number}`>;

      type DTermDiceStrings = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

      interface Terms extends Record<string, foundry.dice.terms.DiceTerm.AnyConstructor> {
        c: foundry.dice.terms.Coin.AnyConstructor;
        d: foundry.dice.terms.Die.AnyConstructor;
        f: foundry.dice.terms.FateDie.AnyConstructor;
      }
    }

    interface Dice {
      /**
       * The Dice types which are supported.
       * @defaultValue `[foundry.dice.terms.Die, foundry.dice.terms.FateDie]`
       */
      types: Array<foundry.dice.terms.DiceTerm.AnyConstructor>;

      // Note(LukeAbby): `InterfaceToObject` is used to ensure that it's valid when used with `choices`.
      rollModes: InterfaceToObject<CONFIG.Dice.RollModes>;

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
      terms: Dice.Terms;

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
    interface StatusEffect extends foundry.documents.BaseActiveEffect.CreateData {
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
    }

    interface TrackableAttribute {
      bar: string[];
      value: string[];
    }
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
     * @see {@linkcode CONST.COMPATIBILITY_MODES}
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
      documentClass: Document.ImplementationClassFor<"Actor">;

      /** @defaultValue `Actors` */
      collection: foundry.documents.collections.Actors.AnyConstructor;

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
      dataModels: Record<string, typeof DataModel<any, Actor.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<Actor.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<Actor.SubType, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;

      /** @defaultValue `{}` */
      trackableAttributes: Record<string, CONFIG.TrackableAttribute>;
    };

    /**
     * Configuration for the Adventure document.
     * Currently for internal use only.
     * @internal
     */
    Adventure: {
      /** @defaultValue `foundry.documents.BaseAdventure` */
      documentClass: Document.ImplementationClassFor<"Adventure">;

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
      collection: foundry.documents.collections.CardStacks.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `Cards` */
      documentClass: Document.ImplementationClassFor<"Cards">;

      /** @defaultValue `"fa-solid fa-cards"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Cards.Implementation>>;

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
      sheetClasses: Record<foundry.documents.BaseCards.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCards.SubType, string>;

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
      documentClass: Document.ImplementationClassFor<"ChatMessage">;

      /** @defaultValue `Messages` */
      collection: foundry.documents.collections.ChatMessages.AnyConstructor;

      /** @defaultValue `"templates/sidebar/chat-message.html"` */
      template: string;

      /** @defaultValue `"fas fa-comments"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, ChatMessage.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseChatMessage.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseChatMessage.SubType, string>;

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
      documentClass: Document.ImplementationClassFor<"Combat">;

      /** @defaultValue `CombatEncounters` */
      collection: foundry.documents.collections.CombatEncounters.AnyConstructor;

      /** @defaultValue `"fas fa-swords"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Combat.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCombat.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCombat.SubType, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;

      initiative: {
        /** @defaultValue `null` */
        formula: string | null;

        /** @defaultValue `2` */
        decimals: number;
      };

      /** @defaultValue "icons/vtt-512.png" */
      fallbackTurnMarker: string;

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
      documentClass: Document.ImplementationClassFor<"FogExploration">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `FogExplorations` */
      collection: foundry.documents.collections.FogExplorations.AnyConstructor;
    };

    /**
     * Configuration for the Folder entity
     */
    Folder: {
      /** @defaultValue `Folder` */
      documentClass: Document.ImplementationClassFor<"Folder">;

      /** @defaultValue `Folders` */
      collection: foundry.documents.collections.Folders.AnyConstructor;

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
      documentClass: Document.ImplementationClassFor<"Item">;

      /** @defaultValue `Items` */
      collection: foundry.documents.collections.Items.AnyConstructor;

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
      dataModels: Record<string, typeof DataModel<any, Item.Implementation>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseItem.SubType, string>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseItem.SubType, Record<string, SheetClassConfig>>;
    };

    /**
     * Configuration for the JournalEntry entity
     */
    JournalEntry: {
      /** @defaultValue `JournalEntry` */
      documentClass: Document.ImplementationClassFor<"JournalEntry">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Journal` */
      collection: foundry.documents.collections.Journal.AnyConstructor;

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
      documentClass: Document.ImplementationClassFor<"Macro">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseMacro.SubType, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.documents.BaseMacro.SubType, string>;

      /** @defaultValue `Macros` */
      collection: foundry.documents.collections.Macros.AnyConstructor;

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
      documentClass: Document.ImplementationClassFor<"Playlist">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Playlists` */
      collection: foundry.documents.collections.Playlists.AnyConstructor;

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
      documentClass: Document.ImplementationClassFor<"RollTable">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `RollTables` */
      collection: foundry.documents.collections.RollTables.AnyConstructor;

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
      documentClass: Document.ImplementationClassFor<"Scene">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Scenes` */
      collection: foundry.documents.collections.Scenes.AnyConstructor;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/scene-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-map"` */
      sidebarIcon: string;
    };

    Setting: {
      /** @defaultValue `Setting` */
      documentClass: Document.ImplementationClassFor<"Setting">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `WorldSettings` */
      collection: foundry.documents.collections.WorldSettings.AnyConstructor;
    };

    /**
     * Configuration for the User entity, it's roles, and permissions
     */
    User: {
      /** @defaultValue `User` */
      documentClass: Document.ImplementationClassFor<"User">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Users` */
      collection: foundry.documents.collections.Users.AnyConstructor;
    };

    /**
     * Configuration settings for the Canvas and its contained layers and objects
     */
    Canvas: CONFIG.Canvas;

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
     */
    canvasTextStyle: PIXI.TextStyle;

    /**
     * Available Weather Effects implementations
     */
    weatherEffects: {
      [key: string]: canvasLayers.WeatherEffects.AmbienceConfiguration;

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
      leaves: canvasLayers.WeatherEffects.AmbienceConfiguration;

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
      rain: canvasLayers.WeatherEffects.AmbienceConfiguration;

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
      rainStorm: canvasLayers.WeatherEffects.AmbienceConfiguration;

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
      fog: canvasLayers.WeatherEffects.AmbienceConfiguration;

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
       */
      snow: canvasLayers.WeatherEffects.AmbienceConfiguration;

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
      blizzard: canvasLayers.WeatherEffects.AmbienceConfiguration;
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
    time: CONFIG.Time;

    /**
     * Configuration for the ActiveEffect embedded document type
     */
    ActiveEffect: {
      /** @defaultValue `ActiveEffect` */
      documentClass: Document.ImplementationClassFor<"ActiveEffect">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, ActiveEffect.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseActiveEffect.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseActiveEffect.SubType, string>;

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
      documentClass: Document.ImplementationClassFor<"ActorDelta">;

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
      documentClass: Document.ImplementationClassFor<"Card">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Card.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCard.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCard.SubType, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;
    };

    /**
     * Configuration for the TableResult embedded document type
     */
    TableResult: {
      /** @defaultValue `TableResult` */
      documentClass: Document.ImplementationClassFor<"TableResult">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseTableResult.SubType, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.documents.BaseTableResult.SubType, string>;
    };

    JournalEntryPage: {
      /** @defaultValue `JournalEntryPage` */
      documentClass: Document.ImplementationClassFor<"JournalEntryPage">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, JournalEntryPage.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseJournalEntryPage.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseJournalEntryPage.SubType, string>;

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
      documentClass: Document.ImplementationClassFor<"PlaylistSound">;

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
      documentClass: Document.ImplementationClassFor<"AmbientLight">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof AmbientLightDocument` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.AmbientLight>;

      /** @defaultValue `typeof LightingLayer` */
      layerClass: canvasLayers.LightingLayer.AnyConstructor;
    };

    /**
     * Configuration for the AmbientSound embedded document type and its representation on the game Canvas
     */
    AmbientSound: {
      /** @defaultValue `AmbientSoundDocument` */
      documentClass: Document.ImplementationClassFor<"AmbientSound">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof AmbientSound` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.AmbientSound>;

      /** @defaultValue `typeof SoundsLayer` */
      layerClass: canvasLayers.SoundsLayer.AnyConstructor;
    };

    /**
     * Configuration for the Combatant embedded document type within a Combat document
     */
    Combatant: {
      /** @defaultValue `Combatant` */
      documentClass: Document.ImplementationClassFor<"Combatant">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, Combatant.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCombatant.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCombatant.SubType, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;
    };

    /**
     * Configuration for the CombatantGroup embedded document type within a Combat document.
     */
    CombatantGroup: {
      /** @defaultValue `CombatantGroup` */
      documentClass: Document.ImplementationClassFor<"CombatantGroup">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, typeof DataModel<any, CombatantGroup.Implementation>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCombatantGroup.SubType, Record<string, SheetClassConfig>>;

      /**
       * @defaultValue `{}`
       * @remarks Initialized by `Localization#initialize`, is an empty object until `i18nInit`
       */
      typeLabels: Record<foundry.documents.BaseCombatantGroup.SubType, string>;

      /** @defaultValue `{}` */
      typeIcons: Record<string, string>;
    };

    /**
     * Configuration for the Drawing embedded document type and its representation on the game Canvas
     */
    Drawing: {
      /** @defaultValue `DrawingDocument` */
      documentClass: Document.ImplementationClassFor<"Drawing">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Drawing` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.Drawing>;

      /** @defaultValue `typeof DrawingsLayer` */
      layerClass: typeof canvasLayers.DrawingsLayer;

      /** @defaultValue `typeof DrawingHUD` */
      hudClass: typeof foundry.applications.hud.DrawingHUD;
    };

    /**
     * Configuration for the JournalEntryCategory embedded document type.
     */
    JournalEntryCategory: {
      /** @defaultValue `JournalEntryCategory` */
      documentClass: Document.ImplementationClassFor<"JournalEntryCategory">;

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
      documentClass: Document.ImplementationClassFor<"MeasuredTemplate">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof MeasuredTemplate` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.MeasuredTemplate>;

      /** @defaultValue `typeof TemplateLayer` */
      layerClass: typeof canvasLayers.TemplateLayer;
    };

    /**
     * Configuration for the Note embedded document type and its representation on the game Canvas
     */
    Note: {
      /** @defaultValue `NoteDocument` */
      documentClass: Document.ImplementationClassFor<"Note">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Note` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.Note>;

      /** @defaultValue `typeof NotesLayer` */
      layerClass: canvasLayers.NotesLayer.AnyConstructor;
    };

    Region: {
      /** @defaultValue `RegionDocument` */
      documentClass: Document.ImplementationClassFor<"Region">;

      /** @defaultValue `Region` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.Region>;

      /** @defaultValue `RegionLayer` */
      layerClass: canvasLayers.RegionLayer.AnyConstructor;

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
     * Configuration for the RegionBehavior embedded document type
     */
    RegionBehavior: {
      documentClass: Document.ImplementationClassFor<"Region">;
      dataModels: Record<
        string,
        typeof foundry.data.regionBehaviors.RegionBehaviorType<any, RegionBehavior.Implementation, AnyObject, AnyObject>
      >;
      typeLabels?: Record<"base", string>;
      typeIcons: Record<string, string>;
    };

    /**
     * Configuration for the Tile embedded document type and its representation on the game Canvas
     */
    Tile: {
      /** @defaultValue `TileDocument` */
      documentClass: Document.ImplementationClassFor<"Tile">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Tile` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.Tile>;

      /** @defaultValue `typeof TilesLayer` */
      layerClass: canvasLayers.TilesLayer.AnyConstructor;

      /** @defaultValue `typeof TileHUD` */
      hudClass: foundry.applications.hud.TileHUD.AnyConstructor;
    };

    /**
     * Configuration for the Token embedded document type and its representation on the game Canvas
     */
    Token: {
      /** @defaultValue `TokenDocument` */
      documentClass: Document.ImplementationClassFor<"Token">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Token` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.Token>;

      /** @defaultValue `typeof TokenLayer` */
      layerClass: canvasLayers.TokenLayer.AnyConstructor;

      /** @defaultValue `typeof TokenConfig` */
      prototypeSheetClass: foundry.applications.sheets.TokenConfig.AnyConstructor;

      /** @defaultValue `typeof TokenHUD` */
      hudClass: foundry.applications.hud.TokenHUD.AnyConstructor;

      /** @defaultValue `typeof TokenRuler` */
      rulerClass: foundry.canvas.placeables.tokens.TokenRuler.AnyConstructor;

      movement: {
        /** @defaultValue `data.TerrainData` */
        TerrainData: typeof foundry.data.BaseTerrainData;

        /**
         * The default movementa nimation speed in grid spaces per second.
         * @defaultValue `6`
         */
        defaultSpeed: number;

        /** @defaultValue `"walk"` */
        defaultAction: string;

        /**
         * @defaultValue
         * ```js
         * {
         *   walk: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.walk.label",
         *     icon: "fa-solid fa-person-walking",
         *     order: 0
         *   },
         *   fly: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.fly.label",
         *     icon: "fa-solid fa-person-fairy",
         *     order: 1
         *   },
         *   swim: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.swim.label",
         *     icon: "fa-solid fa-person-swimming",
         *     order: 2,
         *     getAnimationOptions: () => ({movementSpeed: CONFIG.Token.movement.defaultSpeed / 2})
         *   },
         *   burrow: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.burrow.label",
         *     icon: "fa-solid fa-person-digging",
         *     order: 3
         *   },
         *   crawl: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.crawl.label",
         *     icon: "fa-solid fa-person-praying",
         *     order: 4,
         *     getAnimationOptions: () => ({movementSpeed: CONFIG.Token.movement.defaultSpeed / 2}),
         *     deriveTerrainDifficulty: ({walk}) => walk,
         *     getCostFunction: () => cost => cost * 2
         *   },
         *   climb: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.climb.label",
         *     icon: "fa-solid fa-person-through-window",
         *     order: 5,
         *     getAnimationOptions: () => ({movementSpeed: CONFIG.Token.movement.defaultSpeed / 2}),
         *     deriveTerrainDifficulty: ({walk}) => walk,
         *     getCostFunction: () => cost => cost * 2
         *   },
         *   jump: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.jump.label",
         *     icon: "fa-solid fa-person-running-fast",
         *     order: 6,
         *     deriveTerrainDifficulty: ({walk, fly}) => Math.max(walk, fly),
         *     getCostFunction: () => cost => cost * 2
         *   },
         *   blink: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.blink.label",
         *     icon: "fa-solid fa-person-from-portal",
         *     order: 7,
         *     teleport: true,
         *     getAnimationOptions: () => ({duration: 0}),
         *     deriveTerrainDifficulty: () => 1
         *   },
         *   displace: {
         *     label: "TOKEN.MOVEMENT.ACTIONS.displace.label",
         *     icon: "fa-solid fa-transporter-1",
         *     order: 8,
         *     teleport: true,
         *     measure: false,
         *     walls: null,
         *     visualize: false,
         *     getAnimationOptions: () => ({duration: 0}),
         *     canSelect: () => false,
         *     deriveTerrainDifficulty: () => 1,
         *     getCostFunction: () => () => 0
         *   }
         * }
         * ```
         */
        actions: Record<string, CONFIG.Token.MovementActionConfig>;
      };

      /** @defaultValue `"TOKEN.Adjectives"` */
      adjectivesPrefix: string;

      /**
       * @defaultValue `foundry.canvas.tokens.TokenRingConfig`
       * @remarks Foundry leaves a comment claiming `"ring property is initialized in foundry.canvas.tokens.TokenRingConfig.initialize"`,
       * and while that's true, it's _instantiated_ here in `config.js` via defineProperty (`enumerable: true`)
       */
      readonly ring: foundry.canvas.placeables.tokens.TokenRingConfig;
    };

    /**
     * Configuration for the Wall embedded document type and its representation on the game Canvas
     */
    Wall: {
      /** @defaultValue `WallDocument` */
      documentClass: Document.ImplementationClassFor<"Wall">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `typeof Wall` */
      objectClass: ConfiguredObjectClassOrDefault<typeof placeables.Wall>;

      /** @defaultValue `typeof WallsLayer` */
      layerClass: canvasLayers.WallsLayer.AnyConstructor;

      /** @defaultValue `1` */
      thresholdAttenuationMultiplier: number;

      doorSounds: InterfaceToObject<CONFIG.Wall.DoorSounds>;

      animationTypes: InterfaceToObject<CONFIG.Wall.DoorAnimations>;
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
      enrichers: foundry.applications.ux.TextEditor.EnricherConfig[];
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

    /**
     * Overrides for various core UI/UX helpers.
     */
    ux: CONFIG.UX;

    /**
     * System and modules must prefix the names of the queries they register (e.g. "my-module.aCustomQuery").
     * Non-prefixed query names are reserved by core.
     */
    queries: CONFIG.Queries;
  }

  namespace CONFIG {
    interface UI {
      /** @defaultValue `MainMenu` */
      menu: foundry.applications.ui.MainMenu.AnyConstructor;

      /** @defaultValue `Sidebar` */
      sidebar: foundry.applications.sidebar.Sidebar.AnyConstructor;

      /** @defaultValue `Pause` */
      pause: foundry.applications.ui.GamePause.AnyConstructor;

      /** @defaultValue `SceneNavigation` */
      nav: foundry.applications.ui.SceneNavigation.AnyConstructor;

      /** @defaultValue `Notifications` */
      notifications: foundry.applications.ui.Notifications.AnyConstructor;

      /** @defaultValue `ActorDirectory` */
      actors: foundry.applications.sidebar.tabs.ActorDirectory.AnyConstructor;

      /** @defaultValue `CardsDirectory` */
      cards: foundry.applications.sidebar.tabs.CardsDirectory.AnyConstructor;

      /** @defaultValue `ChatLog` */
      chat: foundry.applications.sidebar.tabs.ChatLog.AnyConstructor;

      /** @defaultValue `CombatTracker` */
      combat: foundry.applications.sidebar.tabs.CombatTracker.AnyConstructor;

      /** @defaultValue `CompendiumDirectory` */
      compendium: foundry.applications.sidebar.tabs.CompendiumDirectory.AnyConstructor;

      /** @defaultValue `SceneControls` */
      controls: foundry.applications.ui.SceneControls.AnyConstructor;

      /** @defaultValue `Hotbar` */
      hotbar: foundry.applications.ui.Hotbar.AnyConstructor;

      /** @defaultValue `ItemDirectory` */
      items: foundry.applications.sidebar.tabs.ItemDirectory.AnyConstructor;

      /** @defaultValue `JournalDirectory` */
      journal: foundry.applications.sidebar.tabs.JournalDirectory.AnyConstructor;

      /** @defaultValue `MacroDirectory` */
      macros: foundry.applications.sidebar.tabs.MacroDirectory.AnyConstructor;

      /** @defaultValue `PlayerList` */
      players: foundry.applications.ui.Players.AnyConstructor;

      /** @defaultValue `PlaylistDirectory` */
      playlists: foundry.applications.sidebar.tabs.PlaylistDirectory.AnyConstructor;

      /** @defaultValue `SceneDirectory` */
      scenes: foundry.applications.sidebar.tabs.SceneDirectory.AnyConstructor;

      /** @defaultValue `Settings` */
      settings: foundry.applications.sidebar.tabs.Settings.AnyConstructor;

      /** @defaultValue `RollTableDirectory` */
      tables: foundry.applications.sidebar.tabs.RollTableDirectory.AnyConstructor;

      /** @defaultValue `CameraViews` */
      webrtc: foundry.applications.apps.av.CameraViews.AnyConstructor;
    }

    interface UX {
      ContextMenu: foundry.applications.ux.ContextMenu.AnyConstructor;
      Draggable: foundry.applications.ux.Draggable.AnyConstructor;
      DragDrop: foundry.applications.ux.DragDrop.AnyConstructor;
      FilePicker: foundry.applications.apps.FilePicker.AnyConstructor;
      TextEditor: foundry.applications.ux.TextEditor.AnyConstructor;
      TooltipManager: foundry.helpers.interaction.TooltipManager.AnyConstructor;
    }

    interface Queries {
      dialog: typeof foundry.applications.api.DialogV2._handleQuery;
      confirmTeleportToken: typeof foundry.data.regionBehaviors.TeleportTokenRegionBehaviorType._confirmQuery;
    }

    interface Canvas {
      /** @defaultValue `10` */
      elevationSnappingPrecision: number;

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

      chatBubblesClass: foundry.canvas.animation.ChatBubbles;

      /** @defaultValue `0.25` */
      darknessLightPenalty: number;

      dispositionColors: Canvas.DispositionColors;

      /**
       * The class used to render door control icons
       * @remarks Not `AnyConstructor` because it's instantiated with a `Wall.Implementation` as its first argument
       */
      doorControlClass: typeof DoorControl;

      /** @defaultValue `0x000000` */
      exploredColor: number;

      /** @defaultValue `0x000000` */
      unexploredColor: number;

      /** @defaultValue `10000` */
      darknessToDaylightAnimationMS: number;

      /** @defaultValue `10000` */
      daylightToDarknessAnimationMS: number;

      /**
       * @defaultValue `foundry.canvas.sources.PointDarknessSource`
       * @remarks Can't be `AnyConstructor` as it's instantiated expecting a compatible constructor
       */
      darknessSourceClass: typeof foundry.canvas.sources.PointDarknessSource;

      /**
       * @defaultValue `foundry.canvas.sources.PointLightSource`
       * @remarks Can't be `AnyConstructor` as it's instantiated expecting a compatible constructor
       */
      lightSourceClass: typeof foundry.canvas.sources.PointLightSource;

      /**
       * @defaultValue `foundry.canvas.sources.GlobalLightSource`
       * @remarks Can't be `AnyConstructor` as it's instantiated expecting a compatible constructor
       */
      globalLightSourceClass: typeof foundry.canvas.sources.GlobalLightSource;

      /**
       * @defaultValue `foundry.canvas.sources.PointVisionSource`
       * @remarks Can't be `AnyConstructor` as it's instantiated expecting a compatible constructor
       */
      visionSourceClass: typeof foundry.canvas.sources.PointVisionSource;

      /**
       * @defaultValue `foundry.canvas.sources.PointSoundSource`
       * @remarks Can't be `AnyConstructor` as it's instantiated expecting a compatible constructor
       */
      soundSourceClass: typeof foundry.canvas.sources.PointSoundSource;

      groups: CONFIG.Canvas.Groups;

      layers: CONFIG.Canvas.Layers;

      lightLevels: Canvas.LightLevels;

      /**
       * @defaultValue `FogManager`
       * @remarks Can't be `AnyConstructor` because Foundry assumes it can call `new` with the same arguments FogManager accepts
       */
      // TODO: Widen to `.AnyConstructor`? Takes no arguments
      fogManager: typeof perception.FogManager;

      polygonBackends: Canvas.PolygonBackends;

      /** @defaultValue `number` */
      darknessSourcePaddingMultiplier: number;

      visibilityFilter: foundry.canvas.rendering.filters.VisibilityFilter.AnyConstructor;

      visualEffectsMaskingFilter: foundry.canvas.rendering.filters.VisualEffectsMaskingFilter.AnyConstructor;

      /**
       * @defaultValue `Ruler`
       * @remarks Not `AnyConstructor` because it's instantiated with a `User.Implementation` as its first argument
       */
      rulerClass: typeof foundry.canvas.interaction.Ruler;

      /** @defaultValue `0.8` */
      dragSpeedModifier: number;

      /** @defaultValue `3.0` */
      maxZoom: number;

      /** @defaultValue `4` */
      objectBorderThickness: number;

      gridStyles: Canvas.GridStyles;

      lightAnimations: RemoveIndexSignatures<Canvas.LightAnimations>;

      darknessAnimations: RemoveIndexSignatures<Canvas.DarknessAnimations>;

      /**
       * A registry of Scenes which are managed by a specific SceneManager class.
       * @remarks Keys are Scene IDs
       * @privateRemarks Can't be `AnyConstructor` because it's instantiated expecting a compatible constructor
       */
      managedScenes: Record<string, typeof foundry.canvas.SceneManager>;

      pings: Canvas.Pings;

      targeting: Canvas.Targeting;

      /**
       * The hover-fading configuration.
       */
      hoverFade: Canvas.HoverFade;

      /**
       * Allow specific transcoders for assets
       * @defaultValue `{ basis: false }`
       */
      transCoders: Canvas.TransCoders;

      /**
       * The set of VisionMode definitions which are available to be used for Token vision.
       */
      visionModes: Canvas.VisionModes;

      /**
       * The set of DetectionMode definitions which are available to be used for visibility detection.
       */
      detectionModes: Canvas.DetectionModes;
    }

    namespace Canvas {
      interface Groups {
        /** @defaultValue `{ groupClass: HiddenCanvasGroup, parent: "stage" }` */
        hidden: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.HiddenCanvasGroup>;

        /** @defaultValue `{ groupClass: RenderedCanvasGroup, parent: "stage" }` */
        rendered: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.RenderedCanvasGroup>;

        /** @defaultValue `{ groupClass: EnvironmentCanvasGroup, parent: "rendered" }` */
        environment: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.EnvironmentCanvasGroup>;

        /** @defaultValue `{ groupClass: PrimaryCanvasGroup, parent: "environment" }` */
        primary: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.PrimaryCanvasGroup>;

        /** @defaultValue `{ groupClass: EffectsCanvasGroup, parent: "environment" }` */
        effects: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.EffectsCanvasGroup>;

        /** @defaultValue `{ groupClass: CanvasVisibility, parent: "rendered" }` */
        visibility: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.CanvasVisibility>;

        /** @defaultValue `{ groupClass: InterfaceCanvasGroup, parent: "rendered", zIndexDrawings: 500, zIndexScrollingText: 1100 }` */
        interface: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.InterfaceCanvasGroup>;

        /** @defaultValue `{ groupClass: OverlayCanvasGroup, parent: "stage" }` */
        overlay: CONFIG.Canvas.GroupDefinition<typeof canvasGroups.OverlayCanvasGroup>;
      }

      // This requires `CanvasGroupConstructor` because `Canvas##createGroups` assumes there's no parameters.
      interface GroupDefinition<GroupClass extends CanvasGroupConstructor = CanvasGroupConstructor> {
        groupClass: GroupClass;
        parent: string;
        zIndexDrawings?: number;
        zIndexScrollingText?: number;
      }

      interface Layers {
        /** @defaultValue `{ layerClass: WeatherLayer, group: "primary" }` */
        weather: LayerDefinition<typeof canvasLayers.WeatherEffects, "primary">;

        /** @defaultValue `{ layerClass: GridLayer, group: "interface" }` */
        grid: LayerDefinition<typeof canvasLayers.GridLayer, "interface">;

        /** @defaultValue `{ layerClass: RegionLayer, group: "interface" }` */
        // regions: LayerDefinition<typeof RegionLayer, "interface">;

        /** @defaultValue `{ layerClass: DrawingsLayer, group: "interface" }` */
        drawings: LayerDefinition<typeof canvasLayers.DrawingsLayer, "interface">;

        /** @defaultValue `{ layerClass: TemplateLayer, group: "interface" }` */
        templates: LayerDefinition<typeof canvasLayers.TemplateLayer, "interface">;

        /** @defaultValue `{ layerClass: TokenLayer, group: "interface" }` */
        tiles: LayerDefinition<typeof canvasLayers.TilesLayer, "interface">;

        /** @defaultValue `{ layerClass: WallsLayer, group: "interface" }` */
        walls: LayerDefinition<typeof canvasLayers.WallsLayer, "interface">;

        /** @defaultValue `{ layerClass: TokenLayer, group: "interface" }` */
        tokens: LayerDefinition<typeof canvasLayers.TokenLayer, "interface">;

        /** @defaultValue `{ layerClass: SoundsLayer, group: "interface" }` */
        sounds: LayerDefinition<typeof canvasLayers.SoundsLayer, "interface">;

        /** @defaultValue `{ layerClass: LightingLayer, group: "interface" }` */
        lighting: LayerDefinition<typeof canvasLayers.LightingLayer, "interface">;

        /** @defaultValue `{ layerClass: NotesLayer, group: "interface" }` */
        notes: LayerDefinition<typeof canvasLayers.NotesLayer, "interface">;

        /** @defaultValue `{ layerClass: ControlsLayer, group: "interface" }` */
        controls: LayerDefinition<typeof canvasLayers.ControlsLayer, "interface">;
      }

      // This requires `typeof CanvasLayer` because `CanvasGroupMixin#_createLayers` assumes there's no parameters.
      interface LayerDefinition<
        LayerClass extends typeof canvasLayers.CanvasLayer,
        Group extends keyof CONFIG["Canvas"]["groups"],
      > {
        layerClass: LayerClass;
        group: Group;
      }

      interface LightLevels {
        /** @defaultValue `0` */
        dark: number;

        /** @defaultValue `0.5` */
        halfdark: number;

        /** @defaultValue `0.25` */
        dim: number;

        /** @defaultValue `1.0` */
        bright: number;
      }

      /**
       * @privateRemarks Foundry types this as {@linkcode geometry.PointSourcePolygon | @enum PointSourcePolygon},
       * but all the runtime defaults are {@linkcode geometry.ClockwiseSweepPolygon | ClockwiseSweepPolygon}, and its
       * types and methods are assumed in other canvas classes, so entries have been constrained to it over `PointSourcePolygon`.
       * It is not impossible to add a new type of source, so the index signature is included, but this is unlikely to
       * come up in real world code.
       */
      interface PolygonBackends {
        sight: geometry.ClockwiseSweepPolygon.AnyConstructor;
        light: geometry.ClockwiseSweepPolygon.AnyConstructor;
        darkness: geometry.ClockwiseSweepPolygon.AnyConstructor;
        sound: geometry.ClockwiseSweepPolygon.AnyConstructor;
        move: geometry.ClockwiseSweepPolygon.AnyConstructor;
        [K: string]: geometry.ClockwiseSweepPolygon.AnyConstructor;
      }

      interface GridStyles {
        [key: string]: canvasLayers.GridLayer.GridStyle;

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
        solidLines: canvasLayers.GridLayer.GridStyle;

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
        dashedLines: canvasLayers.GridLayer.GridStyle;

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
        dottedLines: canvasLayers.GridLayer.GridStyle;

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
        squarePoints: canvasLayers.GridLayer.GridStyle;

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
        diamondPoints: canvasLayers.GridLayer.GridStyle;

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
        roundPoints: canvasLayers.GridLayer.GridStyle;
      }

      interface LightSourceAnimationConfig
        extends RenderedEffectSource._AnimationConfigBase,
          Pick<RenderedEffectSource._AnimationConfigLightingShaders, "colorationShader">,
          InexactPartial<Omit<RenderedEffectSource._AnimationConfigLightingShaders, "colorationShader">>,
          RenderedEffectSource._Seed {}

      interface LightAnimations {
        [animationID: string]: LightSourceAnimationConfig;
        flame: LightAnimations.Flame;
        torch: LightAnimations.Torch;
        revolving: LightAnimations.Revolving;
        siren: LightAnimations.Siren;
        pulse: LightAnimations.Pulse;
        chroma: LightAnimations.Chroma;
        wave: LightAnimations.Wave;
        fog: LightAnimations.Fog;
        sunburst: LightAnimations.Sunburst;
        dome: LightAnimations.Dome;
        emanation: LightAnimations.Emanation;
        hexa: LightAnimations.Hexa;
        ghost: LightAnimations.Ghost;
        energy: LightAnimations.Energy;
        vortex: LightAnimations.Vortex;
        witchwave: LightAnimations.WitchWave;
        rainbowswirl: LightAnimations.RainbowSwirl;
        radialrainbow: LightAnimations.RadialRainbow;
        fairy: LightAnimations.Fairy;
      }
      namespace LightAnimations {
        interface Flame extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationFame"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateFlickering` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `FlameIlluminationShader` */
          illuminationShader: foundry.canvas.rendering.shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `FlameColorationShader` */
          colorationShader: foundry.canvas.rendering.shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Torch extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationTorch"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTorch` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `TorchIlluminationShader` */
          illuminationShader: foundry.canvas.rendering.shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `TorchColorationShader` */
          colorationShader: foundry.canvas.rendering.shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Revolving extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationRevolving"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `RevolvingColorationShader` */
          colorationShader: foundry.canvas.rendering.shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Siren extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationSiren"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTorch` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `SirenIlluminationShader` */
          illuminationShader: foundry.canvas.rendering.shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `SirenIlluminationShader` */
          colorationShader: foundry.canvas.rendering.shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Pulse extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationPulse"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animatePulse` */
          animation: BaseLightSource.LightAnimationFunction;

          /** @defaultValue `PulseIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `PulseColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Chroma extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationChroma"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `ChromaColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Wave extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationWave"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `WaveIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `WaveColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Fog extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationFog"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `FogColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Sunburst extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationSunburst"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `SunburstIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `SunburstColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Dome extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationLightDome"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `LightDomeColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Emanation extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationEmanation"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `EmanationColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Hexa extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationHexaDome";` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `HexaDomeColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Ghost extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationGhostLight"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `GhostLightIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `GhostLightColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Energy extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationEnergyField"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `EnergyFieldColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Vortex extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationVortex"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `VortexIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `VortexColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface WitchWave extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationBewitchingWave"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `BewitchingWaveIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `BewitchingWaveColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface RainbowSwirl extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationSwirlingRainbow"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `SwirlingRainbowColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface RadialRainbow extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationRadialRainbow"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `RadialRainbowColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }

        interface Fairy extends LightSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationFairyLight"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.LightSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `FairyLightIlluminationShader` */
          illuminationShader: shaders.AdaptiveIlluminationShader.AnyConstructor;

          /** @defaultValue `FairyLightColorationShader` */
          colorationShader: shaders.AdaptiveColorationShader.AnyConstructor;
        }
      }

      interface DarknessSourceAnimationConfig
        extends RenderedEffectSource._AnimationConfigBase,
          RenderedEffectSource._AnimationConfigDarknessShaders,
          RenderedEffectSource._Seed {}

      interface DarknessAnimations {
        [animationID: string]: DarknessSourceAnimationConfig;
        magicalGloom: DarknessAnimations.MagicalGloom;
        roiling: DarknessAnimations.Roiling;
        hole: DarknessAnimations.Hole;
      }

      namespace DarknessAnimations {
        interface MagicalGloom extends DarknessSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationMagicalGloom"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.PointDarknessSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `MagicalGloomDarknessShader` */
          darknessShader: shaders.AdaptiveDarknessShader.AnyConstructor;
        }

        interface Roiling extends DarknessSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationRoilingMass"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.PointDarknessSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `RoilingDarknessShader` */
          darknessShader: shaders.AdaptiveDarknessShader.AnyConstructor;
        }

        interface Hole extends DarknessSourceAnimationConfig {
          /** @defaultValue `"LIGHT.AnimationBlackHole"` */
          label: string;

          /** @defaultValue `foundry.canvas.sources.PointDarknessSource.prototype.animateTime` */
          animation: RenderedEffectSource.AnimationFunction;

          /** @defaultValue `BlackHoleDarknessShader` */
          darknessShader: shaders.AdaptiveDarknessShader.AnyConstructor;
        }
      }

      interface Pings {
        types: Pings.Types;

        styles: Pings.Styles;

        /** @defaultValue `700` */
        pullSpeed: number;
      }

      namespace Pings {
        interface Types {
          /** @defaultValue `"pulse"` */
          PULSE: string;

          /** @defaultValue `"alert"` */
          ALERT: string;

          /** @defaultValue `"chevron"` */
          PULL: string;

          /** @defaultValue `"arrow"` */
          ARROW: string;
        }

        interface Styles {
          /** @defaultValue `{ class: AlertPing, color: "#ff0000", size: 1.5, duration: 900 }` */
          alert: CONFIG.Canvas.Pings.Style;

          /** @defaultValue `{ class: ArrowPing, size: 1, duration: 900 }` */
          arrow: CONFIG.Canvas.Pings.Style;

          /** @defaultValue `{ class: ChevronPing, size: 1, duration: 2000 }` */
          chevron: CONFIG.Canvas.Pings.Style;

          /** @defaultValue `{ class: PulsePing, size: 1.5, duration: 900 }` */
          pulse: CONFIG.Canvas.Pings.Style;

          [key: string]: CONFIG.Canvas.Pings.Style;
        }

        interface Style {
          class: unknown;
          color?: string;
          size: number;
          duration: number;
        }
      }

      interface DispositionColors {
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
      }

      interface Targeting {
        /** @defaultValue `.15` */
        size: number;
      }

      interface HoverFade {
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
      }

      interface TransCoders {
        [K: string]: boolean;
      }

      interface VisionModes {
        [key: string]: perception.VisionMode;

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
        basic: perception.VisionMode;

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
        darkvision: perception.VisionMode;

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
        monochromatic: perception.VisionMode;

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
        blindness: perception.VisionMode;

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
        tremorsense: perception.VisionMode;

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
        lightAmplification: perception.VisionMode;
      }

      interface DetectionModes {
        [key: string]: perception.DetectionMode;

        lightPerception: perception.DetectionModeLightPerception;

        basicSight: perception.DetectionModeDarkvision;

        seeInvisibility: perception.DetectionModeInvisibility;

        senseInvisibility: perception.DetectionModeInvisibility;

        feelTremor: perception.DetectionModeTremor;

        seeAll: perception.DetectionModeAll;

        senseAll: perception.DetectionModeAll;
      }
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

    namespace Dice {
      type RollMode = keyof RollModes;

      interface RollModes {
        [rollMode: Brand<string, "CONFIG.Dice.RollMode">]: RollModeConfig;
        publicroll: RollModes.PublicRoll;
        gmroll: RollModes.GMRoll;
        blindroll: RollModes.BlindRoll;
        selfroll: RollModes.SelfRoll;
      }

      interface RollModeConfig {
        /** @remarks A localization key */
        label: string;

        /** @remarks Just the class string, e.g "fa-solid fa-globe" */
        icon: string;
      }

      namespace RollModes {
        interface PublicRoll extends RollModeConfig {
          /** @defaultValue `"CHAT.RollPublic"` */
          label: string;

          /** @defaultValue `"fa-solid fa-globe"` */
          icon: string;
        }

        interface GMRoll extends RollModeConfig {
          /** @defaultValue `"CHAT.RollPrivate"` */
          label: string;

          /** @defaultValue `"fa-solid fa-user-secret"` */
          icon: string;
        }

        interface BlindRoll extends RollModeConfig {
          /** @defaultValue `"CHAT.RollBlind"` */
          label: string;

          /** @defaultValue `"fa-solid fa-eye-slash"` */
          icon: string;
        }

        interface SelfRoll extends RollModeConfig {
          /** @defaultValue `"CHAT.RollSelf"` */
          label: string;

          /** @defaultValue `"fa-solid fa-user"` */
          icon: string;
        }
      }
    }

    namespace Combat {
      interface Sounds {
        epic: CONFIG.Combat.SoundPreset;
        mc: CONFIG.Combat.SoundPreset;
      }
    }

    namespace Token {
      /** Returns the cost of the move between the grid spaces (nonnegative) */
      type MovementActionCostFunction = (
        /** The base cost (terrain cost) */
        baseCost: number,

        /**
         * The offset that is moved from
         * @remarks foundry marked as `readonly`
         */
        from: foundry.grid.BaseGrid.Offset3D,

        /**
         * The offset that is moved to
         * @remarks foundry marked as `readonly`
         */
        to: foundry.grid.BaseGrid.Offset3D,

        /** The distance between the grid spaces */
        distance: number,

        /**
         * The properties of the segment
         * @remarks foundry marked as `readonly`
         */
        segment: TokenDocument.MovementSegmentData,
      ) => number;

      interface AnimationOptions
        extends Pick<
          foundry.canvas.placeables.Token.AnimateOptions,
          "duration" | "movementSpeed" | "easing" | "ontick"
        > {}

      interface _MovementActionConfig {
        /**
         * The FontAwesome icon class.
         */
        icon: string;

        /**
         * An image filename. Takes precedence over the icon if both are supplied.
         */
        img: string;

        /**
         * The number that is used to sort the movement actions / movement action configs.
         * Determines the order in the Token Config/HUD and of cycling.
         * @defaultValue `0`
         */
        order: number;

        /**
         * Is teleportation? If true, the movement does not go through all grid spaces
         * between the origin and destination: it goes from teh origin immediately to the destination grid space.
         * @defaultValue `false`
         */
        teleport: boolean;

        /**
         * Is the movement measured? The distance, cost, spaces, and diagonals
         * of a segment that is not measured are always 0.
         * @defaultValue `true`
         */
        measure: boolean;

        /**
         * The type of walls that block this movement, if any.
         * @defaultValue `"move"`
         */
        walls: ConcreteKeys<CONFIG.Canvas.PolygonBackends> | null;

        /**
         * Is segment of the movement visualized by the ruler?
         * @defaultValue `true`
         */
        visualize: boolean;

        /**
         * Get the default animation options for this movement action.
         * @defaultValue `() => ({})`
         */
        getAnimationOptions: (token: foundry.canvas.placeables.Token) => AnimationOptions;

        /**
         * Can the current User select this movement action for the given Token? If selectable, the movement action of the
         * Token can be set to this movement action by the User via the UI and when cycling.
         * @defaultValue `() => true`
         */
        canSelect: (token: TokenDocument.Implementation | foundry.data.PrototypeToken) => boolean;

        /**
         * If set, this function is used to derive the terrain difficulty from from nonderived difficulties,
         * which are those that do not have `deriveTerrainDifficulty` set.
         * Used by {@linkcode foundry.data.regionBehaviors.ModifyMovementCostRegionBehaviorType}.
         * Derived terrain difficulties are not configurable via the behavior UI.
         */
        deriveTerrainDifficulty: ((nonDerivedDifficulties: { [action: string]: number }) => number) | null;

        /**
         * The cost modification function.
         * @defaultValue `() => cost => cost`
         */
        getCostFunction: (
          token: TokenDocument.Implementation,
          options: foundry.canvas.placeables.Token.MeasureMovementPathOptions,
        ) => MovementActionCostFunction;
      }

      interface MovementActionOptionalConfig extends InexactPartial<_MovementActionConfig> {}

      interface MovementActionConfig extends MovementActionOptionalConfig {
        /**
         * The label of the movement action.
         */
        label: string;
      }
    }

    interface Time {
      /** The Calendar configuration used for in-world timekeeping. */
      worldCalendarConfig: foundry.data.CalendarData.CreateData;

      /** The CalendarData subclass is used for in-world timekeeping. */
      worldCalendarClass: typeof foundry.data.CalendarData;

      /** The Calendar configuration used for IRL timekeeping. */
      earthCalendarConfig: foundry.data.CalendarData.CreateData;

      /** The CalendarData subclass is used for IRL timekeeping. */
      earthCalendarClass: typeof foundry.data.CalendarData;

      /**
       * The number of seconds which automatically elapse at the end of a Combat turn.
       * @defaultValue `0`
       */
      turnTime: number;

      /**
       * The number of seconds which automatically elapse at the end of a Combat round.
       * @defaultValue `0`
       */
      roundTime: number;

      /** Formatting functions used to display time data as strings. */
      formatters: CONFIG.Time.formatters;
    }

    namespace Time {
      interface formatters {
        timestamp: typeof foundry.data.CalendarData.formatTimestamp;
        ago: typeof foundry.data.CalendarData.formatAgo;
      }
    }

    namespace Wall {
      /** @internal */
      type _DoorSoundConfig = InexactPartial<{
        /**
         * One or more sound paths for when the door is closed
         * @remarks If an array is provided, a random entry is chosen
         */
        close: string | string[];

        /**
         * One or more sound paths for when the door becomes locked
         * @remarks If an array is provided, a random entry is chosen
         */
        lock: string | string[];

        /**
         * One or more sound paths for when opening the door
         * @remarks If an array is provided, a random entry is chosen
         */
        open: string | string[];

        /**
         * One or more sound paths for when attempting to open a locked door
         * @remarks If an array is provided, a random entry is chosen
         */
        test: string | string[];

        /**
         * One or more sound paths for when the door becomes unlocked
         * @remarks If an array is provided, a random entry is chosen
         */
        unlock: string | string[];
      }>;

      interface DoorSoundConfig extends _DoorSoundConfig {
        /** A localization string label */
        label: string;
      }

      type DoorSound = Brand<string, "CONFIG.Wall.doorSounds">;

      interface DoorSounds {
        [sound: DoorSound]: DoorSoundConfig;

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
        futuristicFast: DoorSoundConfig;

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
        futuristicHydraulic: DoorSoundConfig;

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
        futuristicForcefield: DoorSoundConfig;

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
        industrial: DoorSoundConfig;

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
        industrialCreaky: DoorSoundConfig;

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
        jail: DoorSoundConfig;

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
        magicDoor: DoorSoundConfig;

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
        magicWall: DoorSoundConfig;

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
        metal: DoorSoundConfig;

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
        slidingMetal: DoorSoundConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.DoorSounds.SlidingMetalHeavy";
         *   close: "sounds/doors/metal/heavy-sliding-close.ogg";
         *   lock: "sounds/doors/metal/heavy-sliding-lock.ogg";
         *   open: "sounds/doors/metal/heavy-sliding-open.ogg";
         *   test: "sounds/doors/metal/heavy-sliding-test.ogg";
         *   unlock: "sounds/doors/metal/heavy-sliding-unlock.ogg";
         * }
         * ```
         */
        slidingMetalHeavy: DoorSoundConfig;

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
        slidingModern: DoorSoundConfig;

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
        slidingWood: DoorSoundConfig;

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
        stoneBasic: DoorSoundConfig;

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
        stoneRocky: DoorSoundConfig;

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
        stoneSandy: DoorSoundConfig;

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
        woodBasic: DoorSoundConfig;

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
        woodCreaky: DoorSoundConfig;

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
        woodHeavy: DoorSoundConfig;
      }

      type DoorAnimationFunction = (this: DoorMesh, open: boolean) => CanvasAnimation.Attribute[];

      type DoorAnimationHook = (this: DoorMesh, open: boolean) => MaybePromise<void>;

      /** @internal */
      type _DoorAnimationConfig = InexactPartial<{
        /**
         * @defaultValue `false`
         * @remarks Pivot about the midpoint, instead of the {@linkcode geometry.edges.Edge.a | a} endpoint of the Wall's Edge?
         */
        midpoint: boolean;

        /** @defaultValue {@linkcode CanvasAnimation.easeInOutCosine | "easeInOutCosine"} */
        easing: CanvasAnimation.EasingFunction;

        /** @remarks `initialize` hooks are not awaited */
        initialize: DoorAnimationHook;

        /** @remarks `preAnimate` hooks **are** awaited */
        preAnimate: DoorAnimationHook;

        /** @remarks `postAnimate` hooks **are** awaited */
        postAnimate: DoorAnimationHook;
      }>;

      interface DoorAnimationConfig extends _DoorAnimationConfig {
        /** @remarks Label (or localization key) for the animation select in {@linkcode foundry.applications.sheets.WallConfig | WallConfig}*/
        label: string;

        animate: DoorAnimationFunction;

        /** @remarks Time to animate over in milliseconds */
        duration: number;
      }

      type DoorAnimation = Brand<string, "CONFIG.Wall.animationTypes">;

      interface DoorAnimations {
        [animationName: DoorAnimation]: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.ASCEND",
         *   midpoint: true,
         *   animate: canvas.containers.DoorMesh.animateAscend,
         *   duration: 1000
         * }
         * ```
         */
        ascend: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.DESCEND",
         *   midpoint: true,
         *   initialize: canvas.containers.DoorMesh.initializeDescend,
         *   animate: canvas.containers.DoorMesh.animateDescend,
         *   preAnimate: canvas.containers.DoorMesh.preAnimateDescend,
         *   postAnimate: canvas.containers.DoorMesh.postAnimateDescend,
         *   duration: 1000
         * }
         * ```
         */
        descend: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.SLIDE",
         *   animate: canvas.containers.DoorMesh.animateSlide,
         *   duration: 500
         * }
         * ```
         */
        slide: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.SWING",
         *   animate: canvas.containers.DoorMesh.animateSwing,
         *   duration: 500
         * }
         * ```
         */
        swing: DoorAnimationConfig;

        /**
         * @defaultValue
         * ```js
         * {
         *   label: "WALL.ANIMATION_TYPES.SWIVEL",
         *   midpoint: true,
         *   animate: canvas.containers.DoorMesh.animateSwing,
         *   duration: 500
         * }
         * ```
         */
        swivel: DoorAnimationConfig;
      }
    }
  }

  const CONFIG: CONFIG;
}

type ConfiguredObjectClassOrDefault<Fallback extends placeables.PlaceableObject.AnyConstructor> = GetKey<
  PlaceableObjectClassConfig,
  Fallback["embeddedName"],
  Fallback
>;

interface SheetClassConfig {
  canBeDefault: boolean;

  canConfigure: boolean;

  cls: foundry.applications.api.DocumentSheetV2.AnyConstructor | foundry.appv1.api.DocumentSheet.AnyConstructor;

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
