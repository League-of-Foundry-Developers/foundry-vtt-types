import { DocumentConstructor, PlaceableObjectConstructor } from "../../types/helperTypes";
import type { StatusEffect } from "./data/documents/token";
import * as CONST from "../common/constants.mjs";

// FIXME: Replace with imports for for the right things or remove when implemented
type VisionMode = unknown;
type DetectInvisibilityVisionMode = VisionMode;
type TremorSenseVisionMode = VisionMode;
type DataModel = unknown;
declare const FogManager: unknown;
declare const ColorManager: unknown;
declare const TilesLayer: ConstructorOf<CanvasLayer>;
declare const HiddenCanvasGroup: CanvasGroupConstructor;
declare const RenderedCanvasGroup: CanvasGroupConstructor;
declare const EnvironmentCanvasGroup: CanvasGroupConstructor;

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

      /** @defaultValue `false` */
      fog: boolean;

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
    DatabaseBackend: ClientDatabaseBackend;

    /**
     * Configuration for the Actor document
     */
    Actor: {
      /** @defaultValue `Actor` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Actor>;

      /** @defaultValue `Actors` */
      collection: ConstructorOf<Actors>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"fas fa-user"` */
      sidebarIcon: string;

      /** @defaultValue `{}` */
      systemDataModels: Record<string, DataModel>;

      /** @defaultValue `{}` */
      typeLabels: Record<string, string>;
    };

    /**
     * Configuration for the Adventure document.
     * Currently for internal use only.
     * @internal
     */
    Adventure: {
      /** @defaultValue `foundry.documents.BaseAdventure` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof foundry.documents.BaseAdventure>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"fa-solid fa-folder-tree"` */
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
      documentClass: ConfiguredDocumentClassOrDefault<typeof Cards>;

      /** @defaultValue `"fa-solid fa-cards"` */
      sidebarIcon: string;

      /** @defaultValue `{}` */
      systemDataModels: Record<string, DataModel>;

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
    };

    /**
     * Configuration for the ChatMessage document
     */
    ChatMessage: {
      /** @defaultValue `ChatMessage` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof ChatMessage>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof Combat>;

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
     * Configuration for dice rolling behaviors in the Foundry VTT client
     */
    Dice: {
      /** @defaultValue `[Die, FateDie]` */
      types: Array<ConstructorOf<DiceTerm>>;

      rollModes: CONFIG.Dice.RollModes;

      /** @defaultValue `[Roll]` */
      rolls: Array<ConstructorOf<Roll>>;

      /**
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

      terms: {
        c: typeof Coin;
        d: typeof Die;
        f: typeof FateDie;
      } & Record<string, ConstructorOf<DiceTerm>>;

      /** @defaultValue `MersenneTwister.random` */
      randomUniform: () => number;
    };

    /**
     * Configuration for the FogExploration document
     */
    FogExploration: {
      /** @defaultValue `FogExploration` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof FogExploration>;

      /** @defaultValue `FogExplorations` */
      collection: ConstructorOf<FogExplorations>;
    };

    /**
     * Configuration for the Folder entity
     */
    Folder: {
      /** @defaultValue `Folder` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Folder>;

      /** @defaultValue `Folders` */
      collection: ConstructorOf<Folders>;

      /** @defaultValue `"fas fa-folder"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the default Item entity class
     */
    Item: {
      /** @defaultValue `Item` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Item>;

      /** @defaultValue `Items` */
      collection: ConstructorOf<Items>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"fas fa-suitcase"` */
      sidebarIcon: string;

      /** @defaultValue `{}` */
      systemDataModels: Record<string, DataModel>;

      /** @defaultValue `{}` */
      typeLabels: Record<string, string>;
    };

    /**
     * Configuration for the JournalEntry entity
     */
    JournalEntry: {
      /** @defaultValue `JournalEntry` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof JournalEntry>;

      /** @defaultValue `Journal` */
      collection: ConstructorOf<Journal>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof Macro>;

      /** @defaultValue `Macros` */
      collection: ConstructorOf<Macros>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"fas fa-code"` */
      sidebarIcon: string;
    };

    /**
     * Configuration for the default Playlist entity class
     */
    Playlist: {
      /** @defaultValue `Playlist` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Playlist>;

      /** @defaultValue `Playlists` */
      collection: ConstructorOf<Playlists>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof RollTable>;

      /** @defaultValue `RollTables` */
      collection: ConstructorOf<RollTables>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof Scene>;

      /** @defaultValue `Scenes` */
      collection: ConstructorOf<Scenes>;

      /** @defaultValue `[]` */
      compendiumIndexFields: string[];

      /** @defaultValue `"fas fa-map"` */
      sidebarIcon: string;
    };

    Setting: {
      /** @defaultValue `Setting` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Setting>;

      /** @defaultValue `WorldSettings` */
      collection: ConstructorOf<WorldSettings>;
    };

    /**
     * Configuration for the User entity, it's roles, and permissions
     */
    User: {
      /** @defaultValue `User` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof User>;

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
      colorManager: typeof ColorManager;

      /** @defaultValue `ClockwiseSweepPolygon` */
      losBackend: typeof PointSourcePolygon;

      /** @defaultValue `Ruler` */
      rulerClass: typeof Ruler;

      globalLightConfig: {
        /** @defaultValue `0` */
        luminosity: number;
      };

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
         *   }
         * })
         * ```
         */
        basic: VisionMode;

        /**
         * Detect Invisibility
         * @defaultValue
         * ```typescript
         * new DetectInvisibilityVisionMode({
         *   id: "detectInvisibility",
         *   label: "VISION.ModeDetectInvisibility",
         *   vision: {
         *     darkness: { adaptive: false },
         *     defaults: { attenuation: 0, contrast: 0, saturation: 0, brightness: 0 }
         *   }
         * })
         * ```
         */
        detectInvisibility: DetectInvisibilityVisionMode;

        /**
         * Darkvision
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "darkvision",
         *   label: "VISION.ModeDarkvision",
         *     canvas: {
         *       shader: ColorAdjustmentsSamplerShader,
         *       uniforms: { enable: true, contrast: 0, saturation: -1.0, brightness: 0 }
         *   },
         *   lighting: {
         *     levels: {
         *       [VisionMode.LIGHTING_LEVELS.DIM]: VisionMode.LIGHTING_LEVELS.BRIGHT
         *     },
         *   background: { visibility: VisionMode.LIGHTING_VISIBILITY.REQUIRED }
         *   },
         *   vision: {
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
         *     uniforms: { enable: true, contrast: 0, saturation: -1.0, brightness: 0 }
         *   },
         *   lighting: {
         *     background: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0 }
         *     },
         *     illumination: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0 }
         *     },
         *     coloration: {
         *       postProcessingModes: ["SATURATION"],
         *       uniforms: { saturation: -1.0 }
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
         *     uniforms: { enable: true, contrast: -0.75, saturation: -1, exposure: -0.3 }
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
         * new TremorSenseVisionMode({
         *   id: "tremorsense",
         *   label: "VISION.ModeTremorsense",
         *   canvas: {
         *     shader: ColorAdjustmentsSamplerShader,
         *     uniforms: { enable: true, contrast: 0, saturation: -0.8, exposure: -0.65 }
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
         * })
         * ```
         */
        tremorsense: TremorSenseVisionMode;

        /**
         * Light Amplification
         * @defaultValue
         * ```typescript
         * new VisionMode({
         *   id: "lightAmplification",
         *   label: "VISION.ModeLightAmplification",
         *   canvas: {
         *     shader: AmplificationSamplerShader,
         *     uniforms: { enable: true, contrast: 0, saturation: -0.5, exposure: -0.25, tint: [0.48, 1.0, 0.48] }
         *   },
         *   lighting: {
         *     background: { visibility: VisionMode.LIGHTING_VISIBILITY.DISABLED },
         *     illumination: {
         *       postProcessingModes: ["EXPOSURE"],
         *       uniforms: { exposure: 0.8 }
         *     },
         *     coloration: {
         *       postProcessingModes: ["SATURATION", "TINT", "EXPOSURE"],
         *       uniforms: { saturation: -0.75, exposure: 8.0, tint: [0.48, 1.0, 0.48] }
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
      /** @defaultValue `AutumnLeavesWeatherEffect` */
      leaves: ConstructorOf<SpecialEffect>;

      /** @defaultValue `RainWeatherEffect` */
      rain: ConstructorOf<SpecialEffect>;

      /** @defaultValue `SnowWeatherEffect` */
      snow: ConstructorOf<SpecialEffect>;
    } & Record<string, ConstructorOf<SpecialEffect>>;

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
    } & Record<string, string>;

    /**
     * A collection of fonts to load either from the user's local system, or remotely.
     * @defaultValue
     * ```typescript
     * {
     *   Arial: { editor: true; fonts: [] };
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
     *     label: "EFFECT.StatusDead";
     *     icon: "icons/svg/skull.svg";
     *   },
     *   {
     *     id: "unconscious";
     *     label: "EFFECT.StatusUnconscious";
     *     icon: "icons/svg/unconscious.svg";
     *   },
     *   {
     *     id: "sleep";
     *     label: "EFFECT.StatusAsleep";
     *     icon: "icons/svg/sleep.svg";
     *   },
     *   {
     *     id: "stun";
     *     label: "EFFECT.StatusStunned";
     *     icon: "icons/svg/daze.svg";
     *   },
     *   {
     *     id: "prone";
     *     label: "EFFECT.StatusProne";
     *     icon: "icons/svg/falling.svg";
     *   },
     *   {
     *     id: "restrain";
     *     label: "EFFECT.StatusRestrained";
     *     icon: "icons/svg/net.svg";
     *   },
     *   {
     *     id: "paralysis";
     *     label: "EFFECT.StatusParalysis";
     *     icon: "icons/svg/paralysis.svg";
     *   },
     *   {
     *     id: "fly";
     *     label: "EFFECT.StatusFlying";
     *     icon: "icons/svg/wing.svg";
     *   },
     *   {
     *     id: "blind";
     *     label: "EFFECT.StatusBlind";
     *     icon: "icons/svg/blind.svg";
     *   },
     *   {
     *     id: "deaf";
     *     label: "EFFECT.StatusDeaf";
     *     icon: "icons/svg/deaf.svg";
     *   },
     *   {
     *     id: "silence";
     *     label: "EFFECT.StatusSilenced";
     *     icon: "icons/svg/silenced.svg";
     *   },
     *   {
     *     id: "fear";
     *     label: "EFFECT.StatusFear";
     *     icon: "icons/svg/terror.svg";
     *   },
     *   {
     *     id: "burning";
     *     label: "EFFECT.StatusBurning";
     *     icon: "icons/svg/fire.svg";
     *   },
     *   {
     *     id: "frozen";
     *     label: "EFFECT.StatusFrozen";
     *     icon: "icons/svg/frozen.svg";
     *   },
     *   {
     *     id: "shock";
     *     label: "EFFECT.StatusShocked";
     *     icon: "icons/svg/lightning.svg";
     *   },
     *   {
     *     id: "corrode";
     *     label: "EFFECT.StatusCorrode";
     *     icon: "icons/svg/acid.svg";
     *   },
     *   {
     *     id: "bleeding";
     *     label: "EFFECT.StatusBleeding";
     *     icon: "icons/svg/blood.svg";
     *   },
     *   {
     *     id: "disease";
     *     label: "EFFECT.StatusDisease";
     *     icon: "icons/svg/biohazard.svg";
     *   },
     *   {
     *     id: "poison";
     *     label: "EFFECT.StatusPoison";
     *     icon: "icons/svg/poison.svg";
     *   },
     *   {
     *     id: "curse";
     *     label: "EFFECT.StatusCursed";
     *     icon: "icons/svg/sun.svg";
     *   },
     *   {
     *     id: "regen";
     *     label: "EFFECT.StatusRegen";
     *     icon: "icons/svg/regen.svg";
     *   },
     *   {
     *     id: "degen";
     *     label: "EFFECT.StatusDegen";
     *     icon: "icons/svg/degen.svg";
     *   },
     *   {
     *     id: "upgrade";
     *     label: "EFFECT.StatusUpgrade";
     *     icon: "icons/svg/upgrade.svg";
     *   },
     *   {
     *     id: "downgrade";
     *     label: "EFFECT.StatusDowngrade";
     *     icon: "icons/svg/downgrade.svg";
     *   },
     *   {
     *     id: "invisible",
     *     label: "EFFECT.StatusInvisible",
     *     icon: "icons/svg/invisible.svg"
     *   },
     *   {
     *     id: "target";
     *     label: "EFFECT.StatusTarget";
     *     icon: "icons/svg/target.svg";
     *   },
     *   {
     *     id: "eye";
     *     label: "EFFECT.StatusMarked";
     *     icon: "icons/svg/eye.svg";
     *   },
     *   {
     *     id: "bless";
     *     label: "EFFECT.StatusBlessed";
     *     icon: "icons/svg/angel.svg";
     *   },
     *   {
     *     id: "fireShield";
     *     label: "EFFECT.StatusFireShield";
     *     icon: "icons/svg/fire-shield.svg";
     *   },
     *   {
     *     id: "coldShield";
     *     label: "EFFECT.StatusIceShield";
     *     icon: "icons/svg/ice-shield.svg";
     *   },
     *   {
     *     id: "magicShield";
     *     label: "EFFECT.StatusMagicShield";
     *     icon: "icons/svg/mage-shield.svg";
     *   },
     *   {
     *     id: "holyShield";
     *     label: "EFFECT.StatusHolyShield";
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
    specialStatusEffects: Record<"DEFEATED" | "INVISIBLE" | "BLIND", string>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof ActiveEffect>;
    };

    /**
     * Configuration for the Card embedded Document type
     */
    Card: {
      /** @defaultValue `Card` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Card>;

      /** @defaultValue `{}` */
      systemDataModels: Record<string, DataModel>;
    };

    /**
     * Configuration for the TableResult embedded document type
     */
    TableResult: {
      /** @defaultValue `TableResult` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof TableResult>;
    };

    /**
     * Configuration for the ActiveEffect embedded document type
     */
    PlaylistSound: {
      /** @defaultValue `PlaylistSound` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof PlaylistSound>;
    };

    /**
     * Configuration for the AmbientLight embedded document type and its representation on the game Canvas
     */
    AmbientLight: {
      /** @defaultValue `AmbientLightDocument` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof AmbientLightDocument>;

      /** @defaultValue `AmbientLightDocument` */
      objectClass: ConfiguredObjectClassOrDefault<typeof AmbientLight>;

      /** @defaultValue `AmbientLightDocument` */
      layerClass: typeof LightingLayer;
    };

    /**
     * Configuration for the AmbientSound embedded document type and its representation on the game Canvas
     */
    AmbientSound: {
      /** @defaultValue `AmbientSoundDocument` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof AmbientSoundDocument>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof Combatant>;
    };

    /**
     * Configuration for the Drawing embedded document type and its representation on the game Canvas
     */
    Drawing: {
      /** @defaultValue `DrawingDocument` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof DrawingDocument>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof MeasuredTemplateDocument>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof NoteDocument>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof TileDocument>;

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
      documentClass: ConfiguredDocumentClassOrDefault<typeof TokenDocument>;

      /** @defaultValue `Token` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Token>;

      /** @defaultValue `TokenLayer` */
      layerClass: typeof TokenLayer;

      /** @defaultValue `TokenConfig` */
      prototypeSheetClass: ConstructorOf<TokenConfig>;
    };

    /**
     * Configuration for the Wall embedded document type and its representation on the game Canvas
     */
    Wall: {
      /** @defaultValue `WallDocument` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof WallDocument>;

      /** @defaultValue `Wall` */
      objectClass: ConfiguredObjectClassOrDefault<typeof Wall>;

      /** @defaultValue `WallsLayer` */
      layerClass: typeof WallsLayer;
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
      clientClass: PropertyTypeOrFallback<WebRTCConfig, "clientClass", typeof AVClient>;

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

        [key: string]: CONFIG.Canvas.GroupDefinition;
      }

      interface Layers {
        /** @defaultValue `{ layerClass: WeatherLayer, group: "primary" }` */
        weather: LayerDefinition<typeof WeatherLayer>;

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

      interface GroupDefinition<GroupClass extends CanvasGroupConstructor = CanvasGroupConstructor> {
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
        properties?: { speed?: number; intensity?: number; reverse?: false }
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

    namespace TextEditor {
      /**
       * @param match   - The regular expression match result
       * @param options - Options provided to customize text enrichment
       * @returns An HTML element to insert in place of the matched text or null to indicate that
       *          no replacement should be made.
       */
      type Enricher = (
        match: RegExpMatchArray,
        options?: globalThis.TextEditor.EnrichOptions
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

type ConfiguredDocumentClassOrDefault<Fallback extends DocumentConstructor> =
  Fallback["metadata"]["name"] extends keyof DocumentClassConfig
    ? DocumentClassConfig[Fallback["metadata"]["name"]]
    : Fallback;

type ConfiguredObjectClassOrDefault<Fallback extends PlaceableObjectConstructor> =
  Fallback["embeddedName"] extends keyof PlaceableObjectClassConfig
    ? PlaceableObjectClassConfig[Fallback["embeddedName"]]
    : Fallback;

type PixiContainerConstructor = typeof PIXI.Container;
interface CanvasGroup extends PIXI.Container {
  sortableChildren: boolean;
}

interface CanvasGroupConstructor extends PixiContainerConstructor {
  new (): CanvasGroup;

  /**
   * The name of this canvas group
   */
  groupName: string;
}
