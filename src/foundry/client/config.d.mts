import type { ConfiguredDocumentClassForName, PlaceableObjectConstructor } from "../../types/helperTypes.d.mts";
import type { ConstructorOf, PropertyTypeOrFallback } from "../../types/utils.d.mts";
import type * as CONST from "../common/constants.d.mts";
import type { StatusEffect } from "./data/documents/token.d.mts";
import type { DataModel } from "../common/abstract/module.d.mts";

declare global {
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

    /**
     * Configure the DatabaseBackend used to perform Document operations
     * @defaultValue `new ClientDatabaseBackend()`
     */
    DatabaseBackend: foundry.data.ClientDatabaseBackend;

    /**
     * Configuration for the Actor document
     */
    Actor: {
      /** @defaultValue `Actor` */
      documentClass: ConfiguredDocumentClassForName<"Actor">;

      /** @defaultValue `Actors` */
      collection: ConstructorOf<Actors>;

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
      dataModels: Record<string, ConstructorOf<DataModel<any, Actor>>>;

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
      documentClass: ConfiguredDocumentClassForName<"Adventure">;

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
      collection: ConstructorOf<CardStacks>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `Cards` */
      documentClass: ConfiguredDocumentClassForName<"Cards">;

      /** @defaultValue `"fa-solid fa-cards"` */
      sidebarIcon: string;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, ConstructorOf<DataModel<any, Cards>>>;

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
      documentClass: ConfiguredDocumentClassForName<"ChatMessage">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      // TODO: Update in v12
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Messages` */
      collection: ConstructorOf<Messages>;

      /** @defaultValue `"templates/sidebar/chat-message.html"` */
      template: string;

      /** @defaultValue `"fas fa-comments"` */
      sidebarIcon: string;

      /** @defaultValue `100` */
      batchSize: number;
    };

    /**
     * Configuration for the Combat document
     */
    Combat: {
      /** @defaultValue `Combat` */
      documentClass: ConfiguredDocumentClassForName<"Combat">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      // TODO: Update in v12
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `CombatEncounters` */
      collection: ConstructorOf<CombatEncounters>;

      /** @defaultValue `"fas fa-swords"` */
      sidebarIcon: string;

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
      sounds: Record<string, CONFIG.Combat.SoundPreset>;
    };

    /**
     * Configuration for dice rolling behaviors in the Foundry Virtual Tabletop client
     */
    Dice: {
      /**
       * The Dice types which are supported.
       * @defaultValue `[Die, FateDie]`
       */
      types: Array<ConstructorOf<DiceTerm>>;

      rollModes: CONFIG.Dice.RollModes;

      /**
       * Configured Roll class definitions
       * @defaultValue `[Roll]`
       */
      rolls: Array<ConstructorOf<Roll>>;

      /**
       * Configured DiceTerm class definitions
       * @defaultValue
       * ```typescript
       * {
       *   DiceTerm: typeof DiceTerm,
       *   MathTerm: typeof MathTerm,
       *   NumericTerm: typeof NumericTerm,
       *   OperatorTerm: typeof OperatorTerm,
       *   ParentheticalTerm: typeof ParentheticalTerm,
       *   PoolTerm: typeof PoolTerm,
       *   StringTerm: typeof StringTerm
       * }
       * ```
       */
      termTypes: Record<string, ConstructorOf<RollTerm>>;

      /**
       * Configured roll terms and the classes they map to.
       */
      terms: {
        c: typeof Coin;
        d: typeof Die;
        f: typeof FateDie;
      } & Record<string, ConstructorOf<DiceTerm>>;

      /**
       * A function used to provide random uniform values.
       * @defaultValue `MersenneTwister.random`
       */
      randomUniform: () => number;
    } & Record<string, ConstructorOf<Roll>>; // Common pattern

    /**
     * Configuration for the FogExploration document
     */
    FogExploration: {
      /** @defaultValue `FogExploration` */
      documentClass: ConfiguredDocumentClassForName<"FogExploration">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `FogExplorations` */
      collection: ConstructorOf<FogExplorations>;
    };

    /**
     * Configuration for the Folder entity
     */
    Folder: {
      /** @defaultValue `Folder` */
      documentClass: ConfiguredDocumentClassForName<"Folder">;

      /** @defaultValue `Folders` */
      collection: ConstructorOf<Folders>;

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
      documentClass: ConfiguredDocumentClassForName<"Item">;

      /** @defaultValue `Items` */
      collection: ConstructorOf<Items>;

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
      dataModels: Record<string, ConstructorOf<DataModel<any, Item>>>;

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
      documentClass: ConfiguredDocumentClassForName<"JournalEntry">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Journal` */
      collection: ConstructorOf<Journal>;

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
      documentClass: ConfiguredDocumentClassForName<"Macro">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseMacro.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.documents.BaseMacro.TypeNames, string>;

      /** @defaultValue `Macros` */
      collection: ConstructorOf<Macros>;

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
      documentClass: ConfiguredDocumentClassForName<"Playlist">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Playlists` */
      collection: ConstructorOf<Playlists>;

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
      documentClass: ConfiguredDocumentClassForName<"RollTable">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `RollTables` */
      collection: ConstructorOf<RollTables>;

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
      documentClass: ConfiguredDocumentClassForName<"Scene">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Scenes` */
      collection: ConstructorOf<Scenes>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"ui/banners/scene-banner.webp"` */
      compendiumBanner: string;

      /** @defaultValue `"fas fa-map"` */
      sidebarIcon: string;
    };

    Setting: {
      /** @defaultValue `Setting` */
      documentClass: ConfiguredDocumentClassForName<"Setting">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `WorldSettings` */
      collection: ConstructorOf<WorldSettings>;
    };

    /**
     * Configuration for the User entity, it's roles, and permissions
     */
    User: {
      /** @defaultValue `User` */
      documentClass: ConfiguredDocumentClassForName<"User">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Users` */
      collection: ConstructorOf<Users>;
    };

    /**
     * Configuration settings for the Canvas and its contained layers and objects
     */
    Canvas: {
      /** @defaultValue `8` */
      blurStrength: number;

      /** @defaultValue `0x242448` */
      darknessColor: number;

      /** @defaultValue `0xeeeeee` */
      daylightColor: number;

      /** @defaultValue `0xffffff` */
      brightestColor: number;

      /** @defaultValue `0.25` */
      darknessLightPenalty: number;

      /** @defaultValue `/Edg|Firefox|Electron/` */
      videoPremultiplyRgx: RegExp;

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

      /** @defaultValue `0x000000` */
      exploredColor: number;

      /** @defaultValue `0x000000` */
      unexploredColor: number;

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
      fogManager: typeof FogManager;

      /** @defaultValue `ColorManager` */
      colorManager: typeof CanvasColorManager;

      polygonBackends: {
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        sight: typeof PointSourcePolygon;
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        light: typeof PointSourcePolygon;
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        sound: typeof PointSourcePolygon;
        /** @defaultValue `typeof ClockwiseSweepPolygon` */
        move: typeof PointSourcePolygon;
      };
      visibilityFilter: typeof VisibilityFilter;

      /** @defaultValue `Ruler` */
      rulerClass: typeof Ruler;

      globalLightConfig: {
        /** @defaultValue `0` */
        luminosity: number;
      };

      /** @defaultValue `0.8` */
      dragSpeedModifier: number;

      /** @defaultValue `3.0` */
      maxZoom: number;

      /** @defaultValue `4` */
      objectBorderThickness: number;

      lightAnimations: {
        flame: {
          /** @defaultValue `"LIGHT.AnimationFame"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateFlickering` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `FlameIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `FlameColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        torch: {
          /** @defaultValue `"LIGHT.AnimationTorch"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTorch` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `TorchIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `TorchColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        revolving: {
          /** @defaultValue `"LIGHT.AnimationRevolving"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `RevolvingColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        siren: {
          /** @defaultValue `"LIGHT.AnimationSiren"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTorch` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `SirenIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `SirenIlluminationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        pulse: {
          /** @defaultValue `"LIGHT.AnimationPulse"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animatePulse` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `PulseIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `PulseColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        chroma: {
          /** @defaultValue `"LIGHT.AnimationChroma"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `ChromaColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        wave: {
          /** @defaultValue `"LIGHT.AnimationWave"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `WaveIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `WaveColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        fog: {
          /** @defaultValue `"LIGHT.AnimationFog"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `FogColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        sunburst: {
          /** @defaultValue `"LIGHT.AnimationSunburst"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `SunburstIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `SunburstColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        dome: {
          /** @defaultValue `"LIGHT.AnimationLightDome"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `LightDomeColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        emanation: {
          /** @defaultValue `"LIGHT.AnimationEmanation"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `EmanationColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        hexa: {
          /** @defaultValue `"LIGHT.AnimationHexaDome";` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `HexaDomeColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        ghost: {
          /** @defaultValue `"LIGHT.AnimationGhostLight"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `GhostLightIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `GhostLightColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        energy: {
          /** @defaultValue `"LIGHT.AnimationEnergyField"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `EnergyFieldColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        roiling: {
          /** @defaultValue `"LIGHT.AnimationRoilingMass"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `RoilingIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;
        };

        hole: {
          /** @defaultValue `"LIGHT.AnimationBlackHole"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `BlackHoleIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;
        };

        vortex: {
          /** @defaultValue `"LIGHT.AnimationVortex"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `VortexIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `VortexColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        witchwave: {
          /** @defaultValue `"LIGHT.AnimationBewitchingWave"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `BewitchingWaveIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `BewitchingWaveColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        rainbowswirl: {
          /** @defaultValue `"LIGHT.AnimationSwirlingRainbow"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `SwirlingRainbowColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        radialrainbow: {
          /** @defaultValue `"LIGHT.AnimationRadialRainbow"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `RadialRainbowColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        fairy: {
          /** @defaultValue `"LIGHT.AnimationFairyLight"` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `FairyLightIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `FairyLightColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };
      } & Record<
        string,
        {
          label: string;
          animation: CONFIG.Canvas.LightAnimationFunction;
          illuminationShader?: ConstructorOf<AbstractBaseShader>;
          colorationShader?: ConstructorOf<AbstractBaseShader>;
        }
      >;

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
         *     defaults: { attenuation: 0, contrast: -0.5, saturation: -1, brightness: -1 }
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
         *     coloration: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED }
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
     * @deprecated since v10.
     * @defaultValue `Object.keys(CONFIG.fontDefinitions)`
     * @internal
     */
    _fontFamilies: string[];

    /**
     * @see {@link CONFIG.fontDefinitions}
     * @defaultValue `Object.keys(CONFIG.fontDefinitions)`
     * @deprecated since v10.
     */
    get fontFamilies(): CONFIG["_fontFamilies"];

    /**
     * The default font family used for text labels on the PIXI Canvas
     * @defaultValue `"Signika"`
     */
    defaultFontFamily: string;

    /**
     * An array of status effect icons which can be applied to Tokens
     * @defaultValue
     * ```typescript
     * [
     *   {
     *     id: "dead";
     *     name: "EFFECT.StatusDead";
     *     icon: "icons/svg/skull.svg";
     *   },
     *   {
     *     id: "unconscious";
     *     name: "EFFECT.StatusUnconscious";
     *     icon: "icons/svg/unconscious.svg";
     *   },
     *   {
     *     id: "sleep";
     *     name: "EFFECT.StatusAsleep";
     *     icon: "icons/svg/sleep.svg";
     *   },
     *   {
     *     id: "stun";
     *     name: "EFFECT.StatusStunned";
     *     icon: "icons/svg/daze.svg";
     *   },
     *   {
     *     id: "prone";
     *     name: "EFFECT.StatusProne";
     *     icon: "icons/svg/falling.svg";
     *   },
     *   {
     *     id: "restrain";
     *     name: "EFFECT.StatusRestrained";
     *     icon: "icons/svg/net.svg";
     *   },
     *   {
     *     id: "paralysis";
     *     name: "EFFECT.StatusParalysis";
     *     icon: "icons/svg/paralysis.svg";
     *   },
     *   {
     *     id: "fly";
     *     name: "EFFECT.StatusFlying";
     *     icon: "icons/svg/wing.svg";
     *   },
     *   {
     *     id: "blind";
     *     name: "EFFECT.StatusBlind";
     *     icon: "icons/svg/blind.svg";
     *   },
     *   {
     *     id: "deaf";
     *     name: "EFFECT.StatusDeaf";
     *     icon: "icons/svg/deaf.svg";
     *   },
     *   {
     *     id: "silence";
     *     name: "EFFECT.StatusSilenced";
     *     icon: "icons/svg/silenced.svg";
     *   },
     *   {
     *     id: "fear";
     *     name: "EFFECT.StatusFear";
     *     icon: "icons/svg/terror.svg";
     *   },
     *   {
     *     id: "burning";
     *     name: "EFFECT.StatusBurning";
     *     icon: "icons/svg/fire.svg";
     *   },
     *   {
     *     id: "frozen";
     *     name: "EFFECT.StatusFrozen";
     *     icon: "icons/svg/frozen.svg";
     *   },
     *   {
     *     id: "shock";
     *     name: "EFFECT.StatusShocked";
     *     icon: "icons/svg/lightning.svg";
     *   },
     *   {
     *     id: "corrode";
     *     name: "EFFECT.StatusCorrode";
     *     icon: "icons/svg/acid.svg";
     *   },
     *   {
     *     id: "bleeding";
     *     name: "EFFECT.StatusBleeding";
     *     icon: "icons/svg/blood.svg";
     *   },
     *   {
     *     id: "disease";
     *     name: "EFFECT.StatusDisease";
     *     icon: "icons/svg/biohazard.svg";
     *   },
     *   {
     *     id: "poison";
     *     name: "EFFECT.StatusPoison";
     *     icon: "icons/svg/poison.svg";
     *   },
     *   {
     *     id: "curse";
     *     name: "EFFECT.StatusCursed";
     *     icon: "icons/svg/sun.svg";
     *   },
     *   {
     *     id: "regen";
     *     name: "EFFECT.StatusRegen";
     *     icon: "icons/svg/regen.svg";
     *   },
     *   {
     *     id: "degen";
     *     name: "EFFECT.StatusDegen";
     *     icon: "icons/svg/degen.svg";
     *   },
     *   {
     *     id: "upgrade";
     *     name: "EFFECT.StatusUpgrade";
     *     icon: "icons/svg/upgrade.svg";
     *   },
     *   {
     *     id: "downgrade";
     *     name: "EFFECT.StatusDowngrade";
     *     icon: "icons/svg/downgrade.svg";
     *   },
     *   {
     *     id: "invisible",
     *     name: "EFFECT.StatusInvisible",
     *     icon: "icons/svg/invisible.svg"
     *   },
     *   {
     *     id: "target";
     *     name: "EFFECT.StatusTarget";
     *     icon: "icons/svg/target.svg";
     *   },
     *   {
     *     id: "eye";
     *     name: "EFFECT.StatusMarked";
     *     icon: "icons/svg/eye.svg";
     *   },
     *   {
     *     id: "bless";
     *     name: "EFFECT.StatusBlessed";
     *     icon: "icons/svg/angel.svg";
     *   },
     *   {
     *     id: "fireShield";
     *     name: "EFFECT.StatusFireShield";
     *     icon: "icons/svg/fire-shield.svg";
     *   },
     *   {
     *     id: "coldShield";
     *     name: "EFFECT.StatusIceShield";
     *     icon: "icons/svg/ice-shield.svg";
     *   },
     *   {
     *     id: "magicShield";
     *     name: "EFFECT.StatusMagicShield";
     *     icon: "icons/svg/mage-shield.svg";
     *   },
     *   {
     *     id: "holyShield";
     *     name: "EFFECT.StatusHolyShield";
     *     icon: "icons/svg/holy-shield.svg";
     *   }
     * ]
     * ```
     */
    statusEffects: StatusEffect[];

    /**
     * A mapping of status effect IDs which provide some additional mechanical integration.
     * @defaultValue `{ DEFEATED: "dead", INVISIBLE: "invisible", BLIND: "blind" }`
     */
    specialStatusEffects: keyof CONFIG.SpecialStatusEffects extends never
      ? CONFIG.DefaultSpecialStatusEffects
      : CONFIG.SpecialStatusEffects;

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
      documentClass: ConfiguredDocumentClassForName<"ActiveEffect">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      // TODO: Update in v12
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /**
       * If true, Active Effects on Items will be copied to the Actor when the Item is created on the Actor if the
       * Active Effect's transfer property is true, and will be deleted when that Item is deleted from the Actor.
       * If false, Active Effects are never copied to the Actor, but will still apply to the Actor from within the Item
       * if the transfer property on the Active Effect is true.
       * @deprecated since v11
       */
      legacyTransferral: boolean;
    };

    /**
     * Configuration for the ActorDelta embedded document type.
     */
    ActorDelta: {
      /** @defaultValue `ActorDelta` */
      documentClass: ConfiguredDocumentClassForName<"ActorDelta">;

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
      documentClass: ConfiguredDocumentClassForName<"Card">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, ConstructorOf<DataModel<any, Card>>>;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<foundry.documents.BaseCard.TypeNames, Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<foundry.documents.BaseCard.TypeNames, string>;
    };

    /**
     * Configuration for the TableResult embedded document type
     */
    TableResult: {
      /** @defaultValue `TableResult` */
      documentClass: ConfiguredDocumentClassForName<"TableResult">;

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
      documentClass: ConfiguredDocumentClassForName<"JournalEntryPage">;

      /**
       * @defaultValue `{}`
       * @remarks `TypeDataModel` is preferred to `DataModel` per core Foundry team
       */
      dataModels: Record<string, ConstructorOf<DataModel<any, JournalEntryPage>>>;

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
      documentClass: ConfiguredDocumentClassForName<"PlaylistSound">;

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
      documentClass: ConfiguredDocumentClassForName<"AmbientLight">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `AmbientLightDocument` */
      objectClass: ConfiguredObjectClassOrDefault<typeof AmbientLight>;

      /** @defaultValue `LightingLayer` */
      layerClass: typeof LightingLayer;
    };

    /**
     * Configuration for the AmbientSound embedded document type and its representation on the game Canvas
     */
    AmbientSound: {
      /** @defaultValue `AmbientSoundDocument` */
      documentClass: ConfiguredDocumentClassForName<"AmbientSound">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `AmbientSound` */
      objectClass: ConfiguredObjectClassOrDefault<typeof AmbientSound>;

      /** @defaultValue `SoundsLayer` */
      layerClass: typeof SoundsLayer;
    };

    /**
     * Configuration for the Combatant embedded document type within a Combat document
     */
    Combatant: {
      /** @defaultValue `Combatant` */
      documentClass: ConfiguredDocumentClassForName<"Combatant">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      // TODO: Update in v12
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;
    };

    /**
     * Configuration for the Drawing embedded document type and its representation on the game Canvas
     */
    Drawing: {
      /** @defaultValue `DrawingDocument` */
      documentClass: ConfiguredDocumentClassForName<"Drawing">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Drawing` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Drawing>;

      /** @defaultValue `DrawingsLayer` */
      layerClass: typeof DrawingsLayer;
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
      documentClass: ConfiguredDocumentClassForName<"MeasuredTemplate">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `MeasuredTemplate` */
      objectClass: ConfiguredObjectClassOrDefault<typeof MeasuredTemplate>;

      /** @defaultValue `TemplateLayer` */
      layerClass: typeof TemplateLayer;
    };

    /**
     * Configuration for the Note embedded document type and its representation on the game Canvas
     */
    Note: {
      /** @defaultValue `NoteDocument` */
      documentClass: ConfiguredDocumentClassForName<"Note">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Note` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Note>;

      /** @defaultValue `NotesLayer` */
      layerClass: typeof NotesLayer;
    };

    /**
     * Configuration for the Tile embedded document type and its representation on the game Canvas
     */
    Tile: {
      /** @defaultValue `TileDocument` */
      documentClass: ConfiguredDocumentClassForName<"Tile">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Tile` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Tile>;

      /** @defaultValue `TilesLayer` */
      layerClass: typeof TilesLayer;
    };

    /**
     * Configuration for the Token embedded document type and its representation on the game Canvas
     */
    Token: {
      /** @defaultValue `TokenDocument` */
      documentClass: ConfiguredDocumentClassForName<"Token">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Token` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Token>;

      /** @defaultValue `TokenLayer` */
      layerClass: typeof TokenLayer;

      /** @defaultValue `TokenConfig` */
      prototypeSheetClass: ConstructorOf<TokenConfig>;

      /** @defaultValue `"TOKEN.Adjectives"` */
      adjectivesPrefix: string;
    };

    /**
     * Configuration for the Wall embedded document type and its representation on the game Canvas
     */
    Wall: {
      /** @defaultValue `WallDocument` */
      documentClass: ConfiguredDocumentClassForName<"Wall">;

      /**
       * @remarks Added by `DocumentSheetConfig._registerDefaultSheets` in `tail.js`
       */
      sheetClasses: Record<"base", Record<string, SheetClassConfig>>;

      /**
       * @remarks Initialized by `Localization#initialize`, is undefined until `i18nInit`
       */
      typeLabels?: Record<"base", string>;

      /** @defaultValue `Wall` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Wall>;

      /** @defaultValue `WallsLayer` */
      layerClass: typeof WallsLayer;

      /** @defaultValue `1` */
      thresholdAttenuationMultiplier: number;

      doorSounds: {
        [sound: string]: CONFIG.WallDoorSound;

        /**
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
      enrichers: CONFIG.TextEditor.EnricherConfig[];
    };

    /**
     * Configuration for the WebRTC implementation class
     */
    WebRTC: {
      /** @defaultValue `SimplePeerAVClient` */
      clientClass: PropertyTypeOrFallback<WebRTCConfig, "clientClass", typeof SimplePeerAVClient>;

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
      menu: ConstructorOf<MainMenu>;

      /** @defaultValue `Sidebar` */
      sidebar: ConstructorOf<Sidebar>;

      /** @defaultValue `Pause` */
      pause: ConstructorOf<Pause>;

      /** @defaultValue `SceneNavigation` */
      nav: ConstructorOf<SceneNavigation>;

      /** @defaultValue `Notifications` */
      notifications: ConstructorOf<Notifications>;

      /** @defaultValue `ActorDirectory` */
      actors: ConstructorOf<ActorDirectory>;

      /** @defaultValue `CardsDirectory` */
      cards: ConstructorOf<CardsDirectory>;

      /** @defaultValue `ChatLog` */
      chat: ConstructorOf<ChatLog>;

      /** @defaultValue `CombatTracker` */
      combat: ConstructorOf<CombatTracker>;

      /** @defaultValue `CompendiumDirectory` */
      compendium: ConstructorOf<CompendiumDirectory>;

      /** @defaultValue `SceneControls` */
      controls: ConstructorOf<SceneControls>;

      /** @defaultValue `Hotbar` */
      hotbar: ConstructorOf<Hotbar>;

      /** @defaultValue `ItemDirectory` */
      items: ConstructorOf<ItemDirectory>;

      /** @defaultValue `JournalDirectory` */
      journal: ConstructorOf<JournalDirectory>;

      /** @defaultValue `MacroDirectory` */
      macros: ConstructorOf<MacroDirectory>;

      /** @defaultValue `PlayerList` */
      players: ConstructorOf<PlayerList>;

      /** @defaultValue `PlaylistDirectory` */
      playlists: ConstructorOf<PlaylistDirectory>;

      /** @defaultValue `SceneDirectory` */
      scenes: ConstructorOf<SceneDirectory>;

      /** @defaultValue `Settings` */
      settings: ConstructorOf<Settings>;

      /** @defaultValue `RollTableDirectory` */
      tables: ConstructorOf<RollTableDirectory>;

      /** @defaultValue `CameraViews` */
      webrtc: ConstructorOf<CameraViews>;
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

        /** @defaultValue `{ groupClass: InterfaceCanvasGroup, parent: "rendered" }` */
        interface: CONFIG.Canvas.GroupDefinition<typeof InterfaceCanvasGroup>;

        /** @defaultValue `{ groupClass: OverlayCanvasGroup, parent: "stage" }` */
        overlay: CONFIG.Canvas.GroupDefinition<typeof OverlayCanvasGroup>;

        [key: string]: CONFIG.Canvas.GroupDefinition;
      }

      interface Layers {
        /** @defaultValue `{ layerClass: WeatherLayer, group: "primary" }` */
        weather: LayerDefinition<typeof WeatherEffects>;

        /** @defaultValue `{ layerClass: GridLayer, group: "interface" }` */
        grid: LayerDefinition<typeof GridLayer>;

        /** @defaultValue `{ layerClass: DrawingsLayer, group: "interface" }` */
        drawings: LayerDefinition<typeof DrawingsLayer>;

        /** @defaultValue `{ layerClass: TemplateLayer, group: "interface" }` */
        templates: LayerDefinition<typeof TemplateLayer>;

        /** @defaultValue `{ layerClass: TokenLayer, group: "interface" }` */
        tiles: LayerDefinition<typeof TilesLayer>;

        /** @defaultValue `{ layerClass: WallsLayer, group: "interface" }` */
        walls: LayerDefinition<typeof WallsLayer>;

        /** @defaultValue `{ layerClass: TokenLayer, group: "interface" }` */
        tokens: LayerDefinition<typeof TokenLayer>;

        /** @defaultValue `{ layerClass: SoundsLayer, group: "interface" }` */
        sounds: LayerDefinition<typeof SoundsLayer>;

        /** @defaultValue `{ layerClass: LightingLayer, group: "interface" }` */
        lighting: LayerDefinition<typeof LightingLayer>;

        /** @defaultValue `{ layerClass: NotesLayer, group: "interface" }` */
        notes: LayerDefinition<typeof NotesLayer>;

        /** @defaultValue `{ layerClass: ControlsLayer, group: "interface" }` */
        controls: LayerDefinition<typeof ControlsLayer>;

        [key: string]: LayerDefinition;
      }

      interface GroupDefinition<
        GroupClass extends ToSpriteConstructor<CanvasGroupConstructor> = ToSpriteConstructor<CanvasGroupConstructor>,
      > {
        groupClass: GroupClass;
        parent: string;
      }

      interface LayerDefinition<LayerClass extends ConstructorOf<CanvasLayer> = ConstructorOf<CanvasLayer>> {
        layerClass: LayerClass;
        group: keyof CONFIG["Canvas"]["groups"];
      }

      type LightAnimationFunction = (
        this: PointSource,
        dt: number,
        properties?: { speed?: number; intensity?: number; reverse?: false },
      ) => void;

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
      effectClass: typeof ParticleEffect | typeof WeatherShaderEffect;
      blendMode: PIXI.BLEND_MODES;
      config: Record<string, unknown>;
    }

    interface SpecialStatusEffects {}
    type DefaultSpecialStatusEffects = {
      DEFEATED: string;
      INVISIBLE: string;
      BLIND: string;
    };

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

    namespace TextEditor {
      /**
       * @param match   - The regular expression match result
       * @param options - Options provided to customize text enrichment
       * @returns An HTML element to insert in place of the matched text or null to indicate that
       *          no replacement should be made.
       */
      type Enricher = (
        match: RegExpMatchArray,
        options?: globalThis.TextEditor.EnrichmentOptions,
      ) => Promise<HTMLElement | null>;

      interface EnricherConfig {
        /** The string pattern to match. Must be flagged as global. */
        pattern: RegExp;

        /**
         * The function that will be called on each match. It is expected that this returns an HTML element
         * to be inserted into the final enriched content.
         */
        enricher: Enricher;
      }
    }
    namespace Dice {
      // eslint-disable-next-line @typescript-eslint/no-empty-interface
      interface RollModes extends Record<foundry.CONST.DICE_ROLL_MODES, string> {}
    }
  }

  const CONFIG: CONFIG;
}

type ConfiguredObjectClassOrDefault<Fallback extends PlaceableObjectConstructor> =
  Fallback["embeddedName"] extends keyof PlaceableObjectClassConfig
    ? PlaceableObjectClassConfig[Fallback["embeddedName"]]
    : Fallback;

interface SheetClassConfig {
  canBeDefault: boolean;

  canConfigure: boolean;

  cls: typeof DocumentSheet;

  default: boolean;

  id: string;

  label: string;
}

type PixiContainerConstructor = typeof PIXI.Container;
interface CanvasGroup extends PIXI.Container {
  sortableChildren: boolean;
}

interface CanvasGroupConstructor extends PixiContainerConstructor {
  new (): CanvasGroup;

  /**
   * The name of this canvas group
   * @remarks Not used in EffectsCanvasGroup in v11
   */
  groupName?: string;
}

type ToSpriteConstructor<Class extends new (sprite?: SpriteMesh) => any> = Pick<Class, keyof Class> &
  (new (sprite: SpriteMesh) => InstanceType<Class>);
