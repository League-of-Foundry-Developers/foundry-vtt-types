import { DocumentConstructor, PlaceableObjectConstructor } from '../../types/helperTypes';
import type { StatusEffect } from './data/documents/token';

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

      /** @defaultValue `'fas fa-user'` */
      sidebarIcon: string;

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
    };

    /**
     * Configuration for the Cards primary Document type
     */
    Cards: {
      /** @defaultValue `CardStacks` */
      collection: ConstructorOf<CardStacks>;

      /** @defaultValue `Cards` */
      documentClass: ConfiguredDocumentClassOrDefault<typeof Cards>;

      /** @defaultValue `"fas fa-id-badge"` */
      sidebarIcon: string;

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

      /** @defaultValue `'templates/sidebar/chat-message.html'` */
      template: string;

      /** @defaultValue `'fas fa-comments'` */
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

      /** @defaultValue `'dead'` */
      defeatedStatusId: string;

      /** @defaultValue `'fas fa-fist-raised'` */
      sidebarIcon: string;

      initiative: {
        /** @defaultValue `null` */
        formula: string | null;

        /** @defaultValue `2` */
        decimals: number;
      };
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

      /** @defaultValue `'fas fa-folder'` */
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

      /** @defaultValue `'fas fa-suitcase'` */
      sidebarIcon: string;

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
        /** @defaultValue `'icons/svg/anchor.svg'` */
        Anchor: string;

        /** @defaultValue `'icons/svg/barrel.svg'` */
        Barrel: string;

        /** @defaultValue `'icons/svg/book.svg'` */
        Book: string;

        /** @defaultValue `'icons/svg/bridge.svg'` */
        Bridge: string;

        /** @defaultValue `'icons/svg/cave.svg'` */
        Cave: string;

        /** @defaultValue `'icons/svg/castle.svg` */
        Castle: string;

        /** @defaultValue `'icons/svg/chest.svg'` */
        Chest: string;

        /** @defaultValue `'icons/svg/city.svg'` */
        City: string;

        /** @defaultValue `'icons/svg/coins.svg'` */
        Coins: string;

        /** @defaultValue `'icons/svg/fire.svg'` */
        Fire: string;

        /** @defaultValue `'icons/svg/hanging-sign.svg'` */
        'Hanging Sign': string;

        /** @defaultValue `'icons/svg/house.svg'` */
        House: string;

        /** @defaultValue `'icons/svg/mountain.svg'` */
        Mountain: string;

        /** @defaultValue `'icons/svg/oak.svg'` */
        'Oak Tree': string;

        /** @defaultValue `'icons/svg/obelisk.svg'` */
        Obelisk: string;

        /** @defaultValue `'icons/svg/pawprint.svg'` */
        Pawprint: string;

        /** @defaultValue `'icons/svg/ruins.svg'` */
        Ruins: string;

        /** @defaultValue `'icons/svg/tankard.svg'` */
        Tankard: string;

        /** @defaultValue `'icons/svg/temple.svg'` */
        Temple: string;

        /** @defaultValue `'icons/svg/tower.svg'` */
        Tower: string;

        /** @defaultValue `'icons/svg/trap.svg'` */
        Trap: string;

        /** @defaultValue `'icons/svg/skull.svg'` */
        Skull: string;

        /** @defaultValue `'icons/svg/statue.svg'` */
        Statue: string;

        /** @defaultValue `'icons/svg/sword.svg'` */
        Sword: string;

        /** @defaultValue `'icons/svg/village.svg'` */
        Village: string;

        /** @defaultValue `'icons/svg/waterfall.svg'` */
        Waterfall: string;

        /** @defaultValue `'icons/svg/windmill.svg'` */
        Windmill: string;
      } & Record<string, string>;

      /** @defaultValue `'fas fa-book-open'` */
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

      /** @defaultValue `'fas fa-code'` */
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

      /** @defaultValue `'fas fa-music'` */
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

      /** @defaultValue `'fas fa-th-list'` */
      sidebarIcon: string;

      /** @defaultValue `'icons/svg/d20-black.svg'` */
      resultIcon: string;

      /** @defaultValue `'templates/dice/table-result.html'` */
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

      /** @defaultValue `'fas fa-map'` */
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

      /** @defaultValue `ScreenCulling` */
      cullingBackend: ConstructorOf<typeof ScreenCulling | typeof QuadtreeCulling>;

      /** @defaultValue `0x242448` */
      darknessColor: number;

      /** @defaultValue `0.25` */
      darknessLightPenalty: number;

      /** @defaultValue `0xeeeeee` */
      daylightColor: number;

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

      /** @defaultValue `0x7f7f7f` */
      exploredColor: number;

      /** @defaultValue `0x000000` */
      unexploredColor: number;

      groups: CONFIG.Canvas.Groups;

      layers: CONFIG.Canvas.Layers;

      lightLevels: {
        /** @defaultValue `0` */
        dark: number;

        /** @defaultValue `0.25` */
        dim: number;

        /** @defaultValue `1.0` */
        bright: number;
      };

      /** @defaultValue `0xb86200` */
      normalLightColor: number;

      /** @defaultValue `3.0` */
      maxZoom: number;

      /** @defaultValue `4` */
      objectBorderThickness: number;

      lightAnimations: {
        torch: {
          /** @defaultValue `'LIGHT.AnimationTorch'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTorch` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `TorchIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `TorchColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        pulse: {
          /** @defaultValue `'LIGHT.AnimationPulse'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animatePulse` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `PulseIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `PulseColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        chroma: {
          /** @defaultValue `'LIGHT.AnimationChroma'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `ChromaColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        wave: {
          /** @defaultValue `'LIGHT.AnimationWave'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `WaveIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `WaveColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        fog: {
          /** @defaultValue `'LIGHT.AnimationFog'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `FogColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        sunburst: {
          /** @defaultValue `'LIGHT.AnimationSunburst'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `SunburstIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `SunburstColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        dome: {
          /** @defaultValue `'LIGHT.AnimationLightDome'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `LightDomeColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        emanation: {
          /** @defaultValue `'LIGHT.AnimationEmanation'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `EmanationColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        hexa: {
          /** @defaultValue `'LIGHT.AnimationHexaDome';` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `HexaDomeColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        ghost: {
          /** @defaultValue `'LIGHT.AnimationGhostLight'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `GhostLightIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `GhostLightColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        energy: {
          /** @defaultValue `'LIGHT.AnimationEnergyField'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `EnergyFieldColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        roiling: {
          /** @defaultValue `'LIGHT.AnimationRoilingMass'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `RoilingIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;
        };

        hole: {
          /** @defaultValue `'LIGHT.AnimationBlackHole'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `BlackHoleIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;
        };

        vortex: {
          /** @defaultValue `'LIGHT.AnimationVortex'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `VortexIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `VortexColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        witchwave: {
          /** @defaultValue `'LIGHT.AnimationBewitchingWave'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `BewitchingWaveIlluminationShader` */
          illuminationShader: ConstructorOf<AbstractBaseShader>;

          /** @defaultValue `BewitchingWaveColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        rainbowswirl: {
          /** @defaultValue `'LIGHT.AnimationSwirlingRainbow'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `SwirlingRainbowColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        radialrainbow: {
          /** @defaultValue `'LIGHT.AnimationRadialRainbow'` */
          label: string;

          /** @defaultValue `LightSource.prototype.animateTime` */
          animation: CONFIG.Canvas.LightAnimationFunction;

          /** @defaultValue `RadialRainbowColorationShader` */
          colorationShader: ConstructorOf<AbstractBaseShader>;
        };

        fairy: {
          /** @defaultValue `'LIGHT.AnimationFairyLight'` */
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
    };

    /**
     * Configure the default Token text style so that it may be reused and overridden by modules
     * @defaultValue
     * ```typescript
     * new PIXI.TextStyle({
     *   fontFamily: 'Signika',
     *   fontSize: 36,
     *   fill: '#FFFFFF',
     *   stroke: '#111111',
     *   strokeThickness: 1,
     *   dropShadow: true,
     *   dropShadowColor: '#000000',
     *   dropShadowBlur: 4,
     *   dropShadowAngle: 0,
     *   dropShadowDistance: 0,
     *   align: 'center',
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
      /** @defaultValue `'icons/svg/combat.svg'` */
      combat: string;

      /** @defaultValue `'icons/svg/cowled.svg'` */
      visibility: string;

      /** @defaultValue `'icons/svg/aura.svg'` */
      effects: string;

      /** @defaultValue `'icons/svg/padlock.svg'` */
      lock: string;

      /** @defaultValue `'icons/svg/up.svg'` */
      up: string;

      /** @defaultValue `'icons/svg/down.svg'` */
      down: string;

      /** @defaultValue `'icons/svg/skull.svg'` */
      defeated: string;

      /** @defaultValue `'icons/svg/light.svg'` */
      light: string;

      /** @defaultValue `'icons/svg/light-off.svg'` */
      lightOff: string;

      /** @defaultValue `'icons/svg/explosion.svg'` */
      template: string;

      /** @defaultValue `'icons/svg/sound.svg'` */
      sound: string;

      /** @defaultValue `'icons/svg/sound-off.svg'` */
      soundOff: string;

      /** @defaultValue `'icons/svg/door-closed-outline.svg'` */
      doorClosed: string;

      /** @defaultValue `'icons/svg/door-open-outline.svg'` */
      doorOpen: string;

      /** @defaultValue `'icons/svg/door-secret-outline.svg'` */
      doorSecret: string;

      /** @defaultValue `'icons/svg/door-locked-outline.svg'` */
      doorLocked: string;
    } & Record<string, string>;

    /**
     * Suggested font families that are displayed wherever a choice is presented
     * @defaultValue `["Arial", "Courier", "Courier New", "Helvetica", "Signika", "Times", "Times New Roman", "Modesto Condensed"]`
     */
    fontFamilies: string[];

    /**
     * The default font family used for text labels on the PIXI Canvas
     * @defaultValue `'Signika'`
     */
    defaultFontFamily: string;

    /**
     * An array of status effect icons which can be applied to Tokens
     * @defaultValue
     * ```typescript
     * [
     *   {
     *     id: 'dead';
     *     label: 'EFFECT.StatusDead';
     *     icon: 'icons/svg/skull.svg';
     *   },
     *   {
     *     id: 'unconscious';
     *     label: 'EFFECT.StatusUnconscious';
     *     icon: 'icons/svg/unconscious.svg';
     *   },
     *   {
     *     id: 'sleep';
     *     label: 'EFFECT.StatusAsleep';
     *     icon: 'icons/svg/sleep.svg';
     *   },
     *   {
     *     id: 'stun';
     *     label: 'EFFECT.StatusStunned';
     *     icon: 'icons/svg/daze.svg';
     *   },
     *   {
     *     id: 'prone';
     *     label: 'EFFECT.StatusProne';
     *     icon: 'icons/svg/falling.svg';
     *   },
     *   {
     *     id: 'restrain';
     *     label: 'EFFECT.StatusRestrained';
     *     icon: 'icons/svg/net.svg';
     *   },
     *   {
     *     id: 'paralysis';
     *     label: 'EFFECT.StatusParalysis';
     *     icon: 'icons/svg/paralysis.svg';
     *   },
     *   {
     *     id: 'fly';
     *     label: 'EFFECT.StatusFlying';
     *     icon: 'icons/svg/wing.svg';
     *   },
     *   {
     *     id: 'blind';
     *     label: 'EFFECT.StatusBlind';
     *     icon: 'icons/svg/blind.svg';
     *   },
     *   {
     *     id: 'deaf';
     *     label: 'EFFECT.StatusDeaf';
     *     icon: 'icons/svg/deaf.svg';
     *   },
     *   {
     *     id: 'silence';
     *     label: 'EFFECT.StatusSilenced';
     *     icon: 'icons/svg/silenced.svg';
     *   },
     *   {
     *     id: 'fear';
     *     label: 'EFFECT.StatusFear';
     *     icon: 'icons/svg/terror.svg';
     *   },
     *   {
     *     id: 'burning';
     *     label: 'EFFECT.StatusBurning';
     *     icon: 'icons/svg/fire.svg';
     *   },
     *   {
     *     id: 'frozen';
     *     label: 'EFFECT.StatusFrozen';
     *     icon: 'icons/svg/frozen.svg';
     *   },
     *   {
     *     id: 'shock';
     *     label: 'EFFECT.StatusShocked';
     *     icon: 'icons/svg/lightning.svg';
     *   },
     *   {
     *     id: 'corrode';
     *     label: 'EFFECT.StatusCorrode';
     *     icon: 'icons/svg/acid.svg';
     *   },
     *   {
     *     id: 'bleeding';
     *     label: 'EFFECT.StatusBleeding';
     *     icon: 'icons/svg/blood.svg';
     *   },
     *   {
     *     id: 'disease';
     *     label: 'EFFECT.StatusDisease';
     *     icon: 'icons/svg/biohazard.svg';
     *   },
     *   {
     *     id: 'poison';
     *     label: 'EFFECT.StatusPoison';
     *     icon: 'icons/svg/poison.svg';
     *   },
     *   {
     *     id: 'radiation';
     *     label: 'EFFECT.StatusRadiation';
     *     icon: 'icons/svg/radiation.svg';
     *   },
     *   {
     *     id: 'regen';
     *     label: 'EFFECT.StatusRegen';
     *     icon: 'icons/svg/regen.svg';
     *   },
     *   {
     *     id: 'degen';
     *     label: 'EFFECT.StatusDegen';
     *     icon: 'icons/svg/degen.svg';
     *   },
     *   {
     *     id: 'upgrade';
     *     label: 'EFFECT.StatusUpgrade';
     *     icon: 'icons/svg/upgrade.svg';
     *   },
     *   {
     *     id: 'downgrade';
     *     label: 'EFFECT.StatusDowngrade';
     *     icon: 'icons/svg/downgrade.svg';
     *   },
     *   {
     *     id: 'target';
     *     label: 'EFFECT.StatusTarget';
     *     icon: 'icons/svg/target.svg';
     *   },
     *   {
     *     id: 'eye';
     *     label: 'EFFECT.StatusMarked';
     *     icon: 'icons/svg/eye.svg';
     *   },
     *   {
     *     id: 'curse';
     *     label: 'EFFECT.StatusCursed';
     *     icon: 'icons/svg/sun.svg';
     *   },
     *   {
     *     id: 'bless';
     *     label: 'EFFECT.StatusBlessed';
     *     icon: 'icons/svg/angel.svg';
     *   },
     *   {
     *     id: 'fireShield';
     *     label: 'EFFECT.StatusFireShield';
     *     icon: 'icons/svg/fire-shield.svg';
     *   },
     *   {
     *     id: 'coldShield';
     *     label: 'EFFECT.StatusIceShield';
     *     icon: 'icons/svg/ice-shield.svg';
     *   },
     *   {
     *     id: 'magicShield';
     *     label: 'EFFECT.StatusMagicShield';
     *     icon: 'icons/svg/mage-shield.svg';
     *   },
     *   {
     *     id: 'holyShield';
     *     label: 'EFFECT.StatusHolyShield';
     *     icon: 'icons/svg/holy-shield.svg';
     *   }
     * ]
     * ```
     */
    statusEffects: StatusEffect[];

    /**
     * A mapping of core audio effects used which can be replaced by systems or mods
     */
    sounds: {
      /** @defaultValue `'sounds/dice.wav'` */
      dice: string;

      /** @defaultValue `'sounds/lock.wav'` */
      lock: string;

      /** @defaultValue `'sounds/notify.wav'` */
      notification: string;

      /** @defaultValue `'sounds/drums.wav'` */
      combat: string;
    };

    /**
     * Define the set of supported languages for localization
     * @defaultValue `{ en: 'English' }`
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
        /** @defaultValue `'Circle'` */
        circle: string;

        /** @defaultValue `'Cone'` */
        cone: string;

        /** @defaultValue `'Rectangle'` */
        rect: string;

        /** @defaultValue `'Ray'` */
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

      /** @defaultValue `BackgroundLayer` */
      layerClass: typeof BackgroundLayer;
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
    TinyMCE: tinyMCE.RawEditorSettings;

    /**
     * Configuration for the WebRTC implementation class
     */
    WebRTC: {
      /** @defaultValue `SimplePeerAVClient` */
      clientClass: PropertyTypeOrFallback<WebRTCConfig, 'clientClass', typeof AVClient>;

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
        /** @defaultValue `{ groupClass: PrimaryCanvasGroup }` */
        primary: CONFIG.Canvas.GroupDefinition<typeof PrimaryCanvasGroup>;

        /** @defaultValue `{ groupClass: EffectsCanvasGroup }` */
        effects: CONFIG.Canvas.GroupDefinition<typeof EffectsCanvasGroup>;

        /** @defaultValue `{ groupClass: InterfaceCanvasGroup }` */
        interface: CONFIG.Canvas.GroupDefinition<typeof InterfaceCanvasGroup>;

        [key: string]: CONFIG.Canvas.GroupDefinition;
      }

      interface Layers {
        /** @defaultValue `{ layerClass: BackgroundLayer, group: "primary" }` */
        background: LayerDefinition<typeof BackgroundLayer>;

        /** @defaultValue `{ layerClass: DrawingsLayer, group: "primary" }` */
        drawings: LayerDefinition<typeof DrawingsLayer>;

        /** @defaultValue `{ layerClass: GridLayer, group: "primary" }` */
        grid: LayerDefinition<typeof GridLayer>;

        /** @defaultValue `{ layerClass: TemplateLayer, group: "primary" }` */
        templates: LayerDefinition<typeof TemplateLayer>;

        /** @defaultValue `{ layerClass: TokenLayer, group: "primary" }` */
        tokens: LayerDefinition<typeof TokenLayer>;

        /** @defaultValue `{ layerClass: ForegroundLayer, group: "primary" }` */
        foreground: LayerDefinition<typeof ForegroundLayer>;

        /** @defaultValue `{ layerClass: WallsLayer, group: "effects" }` */
        walls: LayerDefinition<typeof WallsLayer>;

        /** @defaultValue `{ layerClass: LightingLayer, group: "effects" }` */
        lighting: LayerDefinition<typeof LightingLayer>;

        /** @defaultValue `{ layerClass: WeatherLayer, group: "effects" }` */
        weather: LayerDefinition<typeof WeatherLayer>;

        /** @defaultValue `{ layerClass: SightLayer, group: "effects" }` */
        sight: LayerDefinition<typeof SightLayer>;

        /** @defaultValue `{ layerClass: SoundsLayer, group: "interface" }` */
        sounds: LayerDefinition<typeof SoundsLayer>;

        /** @defaultValue `{ layerClass: NotesLayer, group: "interface" }` */
        notes: LayerDefinition<typeof NotesLayer>;

        /** @defaultValue `{ layerClass: ControlsLayer, group: "interface" }` */
        controls: LayerDefinition<typeof ControlsLayer>;

        [key: string]: LayerDefinition;
      }

      interface GroupDefinition<GroupClass extends CanvasGroupConstructor = CanvasGroupConstructor> {
        groupClass: GroupClass;
      }

      interface LayerDefinition<LayerClass extends ConstructorOf<CanvasLayer> = ConstructorOf<CanvasLayer>> {
        layerClass: LayerClass;
        group: keyof CONFIG['Canvas']['groups'];
      }

      type LightAnimationFunction = (
        this: PointSource,
        dt: number,
        properties?: { speed?: number; intensity?: number; reverse?: false }
      ) => void;
    }

    namespace Cards {
      interface Preset {
        type: string;
        label: string;
        src: string;
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
  Fallback['metadata']['name'] extends keyof DocumentClassConfig
    ? DocumentClassConfig[Fallback['metadata']['name']]
    : Fallback;

type ConfiguredObjectClassOrDefault<Fallback extends PlaceableObjectConstructor> =
  Fallback['embeddedName'] extends keyof PlaceableObjectClassConfig
    ? PlaceableObjectClassConfig[Fallback['embeddedName']]
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
