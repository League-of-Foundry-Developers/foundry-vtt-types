/**
 * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
 * aspects of the software behaves.
 *
 * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
 * session or modified by system and module developers to adjust how the application behaves.
 */
declare const CONFIG: {
  /**
   * Configure debugging flags to display additional information
   */
  debug: {
    /**
     * @defaultValue `false`
     */
    fog: boolean;

    /**
     * @defaultValue `false`
     */
    hooks: boolean;

    /**
     * @defaultValue `false`
     */
    sight: boolean;

    /**
     * @defaultValue `false`
     */
    sightRays: boolean;

    /**
     * @defaultValue `false`
     */
    av: boolean;

    /**
     * @defaultValue `false`
     */
    avclient: boolean;

    /**
     * @defaultValue `false`
     */
    mouseInteraction: boolean;

    /**
     * @defaultValue `false`
     */
    time: boolean;
  };

  /**
   * Configuration for the ActiveEffect embedded Entity
   */
  ActiveEffect: {
    /**
     * @defaultValue `ActiveEffect`
     */
    entityClass: ConstructorOf<ActiveEffect>;

    /**
     * @defaultValue `ActiveEffectConfig`
     */
    sheetClass: ConstructorOf<ActiveEffectConfig>;
  };

  /**
   * Configuration for the default Actor entity class
   */
  Actor: {
    /**
     * @defaultValue `Actor`
     */
    entityClass: ConstructorOf<Actor>;

    /**
     * @defaultValue `Actors`
     */
    collection: ConstructorOf<Actors>;

    /**
     * @defaultValue `{}`
     */
    sheetClasses: Record<string, unknown>; // TODO: Fill in the full typing here.

    /**
     * @defaultValue `'fas fa-user'`
     */
    sidebarIcon: string;

    /**
     * @defaultValue `{}`
     */
    typeLabels: Partial<Record<string, string>>;
  };

  /**
   * Configuration settings for the Canvas and its contained layers and objects
   */
  Canvas: {
    /**
     * @defaultValue `8`
     */
    blurStrength: number;

    /**
     * @defaultValue `0x242448`
     */
    darknessColor: number;

    /**
     * @defaultValue `0.4`
     */
    darknessLightPenalty: number;

    /**
     * @defaultValue `0xeeeeee`
     */
    daylightColor: number;

    dispositionColors: {
      /**
       * @defaultValue `0xe72124`
       */
      HOSTILE: number;

      /**
       * @defaultValue `0xf1d836`
       */
      NEUTRAL: number;

      /**
       * @defaultValue `0x43dfdf`
       */
      FRIENDLY: number;

      /**
       * @defaultValue `0x555555`
       */
      INACTIVE: number;

      /**
       * @defaultValue `0x33bc4e`
       */
      PARTY: number;

      /**
       * @defaultValue `0xff9829`
       */
      CONTROLLED: number;
    };

    /**
     * @defaultValue `0x7f7f7f`
     */
    exploredColor: number;

    /**
     * @defaultValue `0x000000`
     */
    unexploredColor: number;

    lightLevels: {
      /**
       * @defaultValue `0`
       */
      dark: number;

      /**
       * @defaultValue `0.5`
       */
      dim: number;

      /**
       * @defaultValue `1.0`
       */
      bright: number;
    };

    /**
     * @defaultValue `0xb86200`
     */
    normalLightColor: number;

    /**
     * @defaultValue `3.0`
     */
    maxZoom: number;

    /**
     * @defaultValue `4`
     */
    objectBorderThickness: number;

    lightAnimations: Partial<
      Record<
        string,
        {
          label: string;
          animation: (
            this: PointSource,
            dt: number,
            { speed, intensity }?: { speed?: number; intensity?: number }
          ) => void;
          illuminationShader?: any; // TODO: ConstructorOf<StandardIlluminationShader>
          colorationShader?: any; // TODO: ConstructorOf<StandardColorationShader>
        }
      >
    >;
  };

  /**
   * Configuration for the ChatMessage entity
   */
  ChatMessage: {
    /**
     * @defaultValue `ChatMessage`
     */
    entityClass: ConstructorOf<ChatMessage>;

    /**
     * @defaultValue `Messages`
     */
    collection: ConstructorOf<Messages>;

    /**
     * @defaultValue `'templates/sidebar/chat-message.html'`
     */
    template: string;

    /**
     * @defaultValue `'fas fa-comments'`
     */
    sidebarIcon: string;

    /**
     * @defaultValue `100`
     */
    batchSize: number;
  };

  /**
   * Configuration for the Combat entity
   */
  Combat: {
    /**
     * @defaultValue `Combat`
     */
    entityClass: ConstructorOf<Combat>;

    /**
     * @defaultValue `CombatEncounters`
     */
    collection: ConstructorOf<CombatEncounters>;

    /**
     * @defaultValue `'dead'`
     */
    defeatedStatusId: string;

    /**
     * @defaultValue `'fas fa-fist-raised'`
     */
    sidebarIcon: string;

    initiative: {
      /**
       * @defaultValue `null`
       */
      formula: string | null;

      /**
       * @defaultValue `2`
       */
      decimals: number;
    };
  };

  Dice: {
    /**
     * @defaultValue `[Die, FateDie]`
     */
    types: Array<ConstructorOf<DiceTerm>>;

    rollModes: {
      /**
       * @defaultValue `'CHAT.RollPublic'`
       */
      roll: string;

      /**
       * @defaultValue `'CHAT.RollPrivate'`
       */
      gmroll: string;

      /**
       * @defaultValue `CHAT.RollBlind'`
       */
      blindroll: string;

      /**
       * @defaultValue `'CHAT.RollSelf'`
       */
      selfroll: string;
    } & Partial<Record<string, string>>;

    /**
     * @defaultValue `[Roll]`
     */
    rolls: Array<ConstructorOf<Roll>>;

    terms: {
      c: typeof Coin;
      d: typeof Die;
      f: typeof FateDie;
    } & Partial<Record<string, ConstructorOf<DiceTerm>>>;

    /**
     * @defaultValue `MersenneTwister.random`
     */
    randomUniform: () => number;
  };

  /**
   * Configuration for the Folder entity
   */
  Folder: {
    /**
     * @defaultValue `Folder`
     */
    entityClass: ConstructorOf<Folder>;

    /**
     * @defaultValue `FolderConfig`
     */
    sheetClass: ConstructorOf<FolderConfig>;
  };

  /**
   * Configuration for the default Item entity class
   */
  Item: {
    /**
     * @defaultValue `Item`
     */
    entityClass: ConstructorOf<Item>;

    /**
     * @defaultValue `Items`
     */
    collection: ConstructorOf<Items>;

    /**
     * @defaultValue `ItemSheet`
     */
    sheetClass: ConstructorOf<ItemSheet>;

    /**
     * @defaultValue `{}`
     */
    sheetClasses: Record<string, unknown>; // TODO: Fill in the full typing here.

    /**
     * @defaultValue `'fas fa-suitcase'`
     */
    sidebarIcon: string;

    /**
     * defaultValue `{}`
     */
    typeLabels: Partial<Record<string, string>>;
  };

  /**
   * Configuration for the JournalEntry entity
   */
  JournalEntry: {
    /**
     * @defaultValue `JournalEntry`
     */
    entityClass: ConstructorOf<JournalEntry>;

    /**
     * @defaultValue `Journal`
     */
    collection: ConstructorOf<Journal>;

    /**
     * @defaultValue `JournalSheet`
     */
    sheetClass: ConstructorOf<JournalSheet>;

    noteIcons: {
      /**
       * @defaultValue `'icons/svg/anchor.svg'`
       */
      Anchor: string;

      /**
       * @defaultValue `'icons/svg/barrel.svg'`
       */
      Barrel: string;

      /**
       * @defaultValue `'icons/svg/book.svg'`
       */
      Book: string;

      /**
       * @defaultValue `'icons/svg/bridge.svg'`
       */
      Bridge: string;

      /**
       * @defaultValue `'icons/svg/cave.svg'`
       */
      Cave: string;

      /**
       * @defaultValue `'icons/svg/castle.svg`
       */
      Castle: string;

      /**
       * @defaultValue `'icons/svg/chest.svg'`
       */
      Chest: string;

      /**
       * @defaultValue `'icons/svg/city.svg'`
       */
      City: string;

      /**
       * @defaultValue `'icons/svg/coins.svg'`
       */
      Coins: string;

      /**
       * @defaultValue `'icons/svg/fire.svg'`
       */
      Fire: string;

      /**
       * @defaultValue `'icons/svg/hanging-sign.svg'`
       */
      'Hanging Sign': string;

      /**
       * @defaultValue `'icons/svg/house.svg'`
       */
      House: string;

      /**
       * @defaultValue `'icons/svg/mountain.svg'`
       */
      Mountain: string;

      /**
       * @defaultValue `'icons/svg/oak.svg'`
       */
      'Oak Tree': string;

      /**
       * @defaultValue `'icons/svg/obelisk.svg'`
       */
      Obelisk: string;

      /**
       * @defaultValue `'icons/svg/pawprint.svg'`
       */
      Pawprint: string;

      /**
       * @defaultValue `'icons/svg/ruins.svg'`
       */
      Ruins: string;

      /**
       * @defaultValue `'icons/svg/tankard.svg'`
       */
      Tankard: string;

      /**
       * @defaultValue `'icons/svg/temple.svg'`
       */
      Temple: string;

      /**
       * @defaultValue `'icons/svg/tower.svg'`
       */
      Tower: string;

      /**
       * @defaultValue `'icons/svg/trap.svg'`
       */
      Trap: string;

      /**
       * @defaultValue `'icons/svg/skull.svg'`
       */
      Skull: string;

      /**
       * @defaultValue `'icons/svg/statue.svg'`
       */
      Statue: string;

      /**
       * @defaultValue `'icons/svg/sword.svg'`
       */
      Sword: string;

      /**
       * @defaultValue `'icons/svg/village.svg'`
       */
      Village: string;

      /**
       * @defaultValue `'icons/svg/waterfall.svg'`
       */
      Waterfall: string;
      /**
       * @defaultValue `'icons/svg/windmill.svg'`
       */
      Windmill: string;
    } & Partial<Record<string, string>>;

    /**
     * @defaultValue `'fas fa-book-open'`
     */
    sidebarIcon: string;
  };

  /**
   * Configuration for the Macro entity
   */
  Macro: {
    /**
     * @defaultValue `Macro`
     */
    entityClass: ConstructorOf<Macro>;

    /**
     * @defaultValue `Macros`
     */
    collection: ConstructorOf<Macros>;

    /**
     * @defaultValue `MacroConfig`
     */
    sheetClass: any; // TODO: ConstructorOf<MacroConfig>

    /**
     * @defaultValue `'fas fa-terminal'`
     */
    sidebarIcon: string;
  };

  /**
   * Configuration for MeasuredTemplate settings and options
   */
  MeasuredTemplate: {
    types: {
      /**
       * @defaultValue `'Circle'`
       */
      circle: string;

      /**
       * @defaultValue `'Cone'`
       */
      cone: string;

      /**
       * @defaultValue `'Rectangle'`
       */
      rect: string;

      /**
       * @defaultValue `'Ray'`
       */
      ray: string;
    } & Partial<Record<string, string>>;

    defaults: {
      /**
       * @defaultValue `53.13`
       */
      angle: number;

      /**
       * @defaultValue `1`
       */
      width: number;
    };
  };

  /**
   * Configuration for the default Playlist entity class
   */
  Playlist: {
    /**
     * @defaultValue `Playlist`
     */
    entityClass: ConstructorOf<Playlist>;

    /**
     * @defaultValue `Playlists`
     */
    collection: ConstructorOf<Playlists>;

    /**
     * @defaultValue null
     */
    sheetClass: ConstructorOf<PlaylistConfig> | null;

    /**
     * @defaultValue `'fas fa-music'`
     */
    sidebarIcon: string;
  };

  /**
   * Configuration for RollTable random draws
   */
  RollTable: {
    /**
     * @defaultValue `RollTable`
     */
    entityClass: ConstructorOf<RollTable>;

    /**
     * @defaultValue `RollTables`
     */
    collection: ConstructorOf<RollTables>;

    /**
     * @defaultValue `RollTableConfig`
     */
    sheetClass: ConstructorOf<RollTableConfig>;

    /**
     * @defaultValue `'fas fa-th-list'`
     */
    sidebarIcon: string;

    /**
     * @defaultValue `'icons/svg/d20-black.svg'`
     */
    resultIcon: string;

    /**
     * @defaultValue `'templates/dice/table-result.html'`
     */
    resultTemplate: string;
  };

  /**
   * Configuration for the default Scene entity class
   */
  Scene: {
    /**
     * @defaultValue `Scene`
     */
    entityClass: ConstructorOf<Scene>;

    /**
     * @defaultValue `Scenes`
     */
    collection: ConstructorOf<Scenes>;

    /**
     * @defaultValue `SceneConfig`
     */
    sheetClass: any; // TODO: ConstructorOf<SceneConfig>;

    /**
     * @defaultValue `'fas fa-map'`
     */
    sidebarIcon: string;
  };

  /**
   * Configuration for the User entity, it's roles, and permissions
   */
  User: {
    /**
     * @defaultValue `User`
     */
    entityClass: ConstructorOf<User>;

    /**
     * @defaultValue `Users`
     */
    collection: ConstructorOf<Users>;

    /**
     * @defaultValue `PlayerConfig`
     */
    sheetClass: ConstructorOf<PlayerConfig>;

    /**
     * @defaultValue `CONST.USER_PERMISSIONS`
     */
    permissions: {
      BROADCAST_AUDIO: Config.Permission;
      BROADCAST_VIDEO: Config.Permission;
      ACTOR_CREATE: Config.Permission;
      DRAWING_CREATE: Config.Permission;
      ITEM_CREATE: Config.Permission;
      FILES_BROWSE: Config.Permission;
      FILES_UPLOAD: Config.Permission;
      JOURNAL_CREATE: Config.Permission;
      MACRO_SCRIPT: Config.Permission;
      MESSAGE_WHISPER: Config.Permission;
      SETTINGS_MODIFY: Config.Permission;
      SHOW_CURSOR: Config.Permission;
      SHOW_RULER: Config.Permission;
      TEMPLATE_CREATE: Config.Permission;
      TOKEN_CREATE: Config.Permission;
      TOKEN_CONFIGURE: Config.Permission;
      WALL_DOORS: Config.Permission;
    } & Partial<Record<string, Config.Permission>>;
  };

  /**
   * Configure the default Token text style so that it may be reused and overridden by modules
   * @defaultValue
   * ```
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
   * The control icons used for rendering common HUD operations
   */
  controlIcons: {
    /**
     * @defaultValue `'icons/svg/combat.svg'`
     */
    combat: string;

    /**
     * @defaultValue `'icons/svg/cowled.svg'`
     */
    visibility: string;

    /**
     * @defaultValue `'icons/svg/aura.svg'`
     */
    effects: string;

    /**
     * @defaultValue `'icons/svg/padlock.svg'`
     */
    lock: string;

    /**
     * @defaultValue `'icons/svg/up.svg'`
     */
    up: string;

    /**
     * @defaultValue `'icons/svg/down.svg'`
     */
    down: string;

    /**
     * @defaultValue `'icons/svg/skull.svg'`
     */
    defeated: string;

    /**
     * @defaultValue `'icons/svg/fire.svg'`
     */
    light: string;

    /**
     * @defaultValue `'icons/svg/explosion.svg'`
     */
    template: string;

    /**
     * @defaultValue `'icons/svg/sound.svg'`
     */
    sound: string;

    /**
     * @defaultValue `'icons/svg/door-steel.svg'`
     */
    doorClosed: string;

    /**
     * @defaultValue `'icons/svg/door-exit.svg'`
     */
    doorOpen: string;

    /**
     * @defaultValue `'icons/svg/padlock.svg'`
     */
    doorLocked: string;
  } & Partial<Record<string, string>>;

  /**
   * Suggested font families that are displayed wherever a choice is presented
   * @defaultValue `['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Times New Roman', 'Signika', 'Modesto Condensed']`
   */
  fontFamilies: string[];

  /**
   * The default font family used for text labels on the PIXI Canvas
   * @defaultValue `'Signika'`
   */
  defaultFontFamily: string;

  /**
   * An array of status effect icons which can be applied to Tokens
   */
  statusEffects: { id: string; label: string; icon: string }[];

  /**
   * A mapping of core audio effects used which can be replaced by systems or mods
   */
  sounds: {
    /**
     * @defaultValue `'sounds/dice.wav'`
     */
    dice: string;

    /**
     * @defaultValue `'sounds/lock.wav'`
     */
    lock: string;

    /**
     * @defaultValue `'sounds/notify.wav'`
     */
    notification: string;

    /**
     * @defaultValue `'sounds/drums.wav'`
     */
    combat: string;
  };

  /**
   * Define the set of supported languages for localization
   */
  supportedLanguages: {
    en: string;
  } & Partial<Record<string, string>>;

  /**
   * Configuration for time tracking
   */
  time: {
    /**
     * @defaultValue `0`
     */
    turnTime: number;

    /**
     * @defaultValue `0`
     */
    roundTime: number;
  };

  /**
   * Default configuration options for TinyMCE editors
   */
  TinyMCE: import('tinymce').Settings;

  /**
   * Configure the Application classes used to render various core UI elements in the application
   */
  ui: {
    /**
     * @defaultValue `ActorDirectory`
     */
    actors: ConstructorOf<ActorDirectory>;

    /**
     * @defaultValue `ChatLog`
     */
    chat: ConstructorOf<ChatLog>;

    /**
     * @defaultValue `CombatTracker`
     */
    combat: ConstructorOf<CombatTracker>;

    /**
     * @defaultValue `CompendiumDirectory`
     */
    compendium: ConstructorOf<CompendiumDirectory>;

    /**
     * @defaultValue `SceneControls`
     */
    controls: ConstructorOf<SceneControls>;

    /**
     * @defaultValue `Hotbar`
     */
    hotbar: ConstructorOf<Hotbar>;

    /**
     * @defaultValue `ItemDirectory`
     */
    items: ConstructorOf<ItemDirectory>;

    /**
     * @defaultValue `JournalDirectory`
     */
    journal: ConstructorOf<JournalDirectory>;

    /**
     * @defaultValue `MacroDirectory`
     */
    macros: ConstructorOf<MacroDirectory>;

    /**
     * @defaultValue `MainMenu`
     */
    menu: ConstructorOf<MainMenu>;

    /**
     * @defaultValue `SceneNavigation`
     */
    nav: ConstructorOf<SceneNavigation>;

    /**
     * @defaultValue `Notifications`
     */
    notifications: ConstructorOf<Notifications>;

    /**
     * @defaultValue `Pause`
     */
    pause: ConstructorOf<Pause>;

    /**
     * @defaultValue `PlayerList`
     */
    players: ConstructorOf<PlayerList>;

    /**
     * @defaultValue `PlaylistDirectory`
     */
    playlists: ConstructorOf<PlaylistDirectory>;

    /**
     * @defaultValue `SceneDirectory`
     */
    scenes: ConstructorOf<SceneDirectory>;

    /**
     * @defaultValue `Settings`
     */
    settings: ConstructorOf<Settings>;

    /**
     * @defaultValue `Sidebar`
     */
    sidebar: ConstructorOf<Sidebar>;

    /**
     * @defaultValue `RollTableDirectory`
     */
    tables: ConstructorOf<RollTableDirectory>;

    /**
     * @defaultValue `CameraViews`
     */
    webrtc: ConstructorOf<CameraViews>;
  };

  /**
   * Available Weather Effects implementations
   */
  weatherEffects: {
    leaves: any; // TODO: ConstructorOf<AutumnLeavesWeatherEffect>
    rain: any; // TODO: ConstructorOf<RainWeatherEffect>
    snow: any; // TODO: ConstructorOf<SnowWeatherEffect>
  } & Partial<Record<string, any>>; // TODO: ConstructorOf<SpecialEffect>

  /**
   * Configuration for the WebRTC implementation class
   */
  WebRTC: {
    /**
     * @defaultValue `EasyRTCClient`
     */
    clientClass: any; // TODO: ConstructorOf<EasyRTCClient>

    /**
     * @defaultValue `50`
     */
    detectPeerVolumeInterval: number;

    /**
     * @defaultValue `20`
     */
    detectSelfVolumeInterval: number;

    /**
     * @defaultValue `25`
     */
    emitVolumeInterval: number;

    /**
     * @defaultValue `2`
     */
    speakingThresholdEvents: number;

    /**
     * @defaultValue `10`
     */
    speakingHistoryLength: number;
  };
} & Record<string, unknown>;

declare namespace Config {
  interface Permission {
    label: string;
    hint: string;
    disableGM: boolean;
    defaultRole: Const.UserRoles;
  }
}
