// @TODO: Assign class types

declare const CONFIG: {
  [key: string]: any;

  /**
   * Configuration for the default Actor entity class
   */
  Actor: {
    collection: Actors;
    entityClass: typeof Actor;
    sheetClasses: typeof ActorSheet;
    typeLabels: any;
  };

  Dice: {
    terms: {
      c: typeof Coin;
      d: typeof Die;
      f: typeof FateDie;
    };
  };

  /**
   * Configuration for the default Item entity class
   */
  Item: {
    collection: Items;
    entityClass: typeof Item;
    sheetClasses: typeof ItemSheet;
    typeLabels: any;
  };

  /**
   * Configuration for the JournalEntry entity
   */
  JournalEntry: {
    entityClass: typeof JournalEntry;
    noteIcons: {
      [key: string]: string;
      Anchor: string;
    };
    sheetClass: typeof JournalSheet;
    sidebarIcon: string;
  };

  /**
   * Configuration for the default Playlist entity class
   */
  Playlist: {
    entityClass: any;
    sheetClass: any;
    sidebarIcon: string;
  };

  /**
   * Configuration for RollTable random draws
   */
  RollTable: {
    entityClass: any;
    resultIcon: string;
    sheetClass: any;
    sidebarIcon: string;
  };

  /**
   * Configuration for the default Scene entity class
   */
  Scene: {
    collection: Scenes;
    entityClass: typeof Scene;
    notesClass: any;
    sheetClass: any;
    sidebarIcon: string;
  };

  /**
   * The control icons used for rendering common HUD operations
   */
  controlIcons: {
    [key: string]: string;
    combat: string;
    defeated: string;
    down: string;
    effects: string;
    lock: string;
    up: string;
    visibility: string;
  };

  /**
   * Configure debugging flags to display additional information
   */
  debug: {
    hooks: boolean;
    sight: boolean;
  };

  /**
   * The default font family used for text labels on the PIXI Canvas
   */
  defaultFontFamily: string;

  /**
   * Suggested font families that are displayed wherever a choice is presented
   */
  fontFamilies: string[];

  /**
   * Maximum canvas zoom scale
   */
  maxCanvasZoom: number;

  /**
   * A mapping of core audio effects used which can be replaced by systems or mods
   */
  sounds: {
    combat: string;
    dice: string;
    lock: string;
    notification: string;
  };

  /**
   * An array of status effect icons which can be applied to Tokens
   */
  statusEffects: object[];

  /**
   * Define the set of supported languages for localization
   */
  supportedLanguages: {
    [key: string]: string;
    en: string;
  };

  /**
   * Available Weather Effects implemntations
   */
  weatherEffects: any;
};
