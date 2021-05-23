/**
 * Initialized in
 * - `/game`: after "setup", before "ready" hook
 * - `/stream`: as `{ ready: false }`
 * @defaultValue `null`
 */
declare let canvas: Canvas | { ready: false } | null;

declare let game: Game;

/**
 * Initialized in
 * - `/game`: after "setup", before "ready" hook
 * @defaultValue `null`
 */
declare let keyboard: KeyboardManager | null;

/**
 * @defaultValue `null`
 */
declare let socket: SocketIOClient.Socket | null;

/**
 * Each of thses are initialized depending on the current view. The views are the following:
 * - `/license`
 * - `/game`
 * - `/setup`
 * - `/stream`
 * - `/players`
 * - `/join`
 */
declare const ui: {
  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  actors?: ActorDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  chat?: ChatLog;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  combat?: CombatTracker;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  compendium?: CompendiumDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  controls?: SceneControls;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  hotbar?: Hotbar;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  items?: ItemDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  journal?: JournalDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  macros?: MacroDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  menu?: MainMenu;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  nav?: SceneNavigation;

  /**
   * Initialized in
   * - `/license`
   * - `/game`: after "setup", before "ready" hook
   * - `/setup`
   * - `/players`
   * - `/join`
   */
  notifications?: Notifications;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  pause?: Pause;

  /**
   * Initialized in
   * - `/players`: as `UserManagement`
   */
  players?: UserManagement;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  playlists?: PlaylistDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  scenes?: SceneDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  settings?: ClientSettings;

  /**
   * Initialized in
   * - `/setup`
   */
  setup?: SetupConfigurationForm;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  sidebar?: Sidebar;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  tables?: RollTableDirectory;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   */
  webrtc?: CameraViews;

  /**
   * @defaultValue `{}`
   */
  windows: Record<number, Application>;
};

/**
 * The core Game instance which encapsulates the data, settings, and states relevant for managing the game experience.
 * The singleton instance of the Game class is available as the global variable `game`.
 */
declare class Game {
  /**
   * Establish a live connection to the game server through the socket.io URL
   * @param sessionId - The client session ID with which to establish the connection
   * @returns A promise which resolves to the connected socket, if successful
   */
  static connect(sessionId: string): Promise<SocketIOClient.Socket>;

  /**
   * Fetch World data and return a Game instance
   * @returns A Promise which resolves to the created Game instance
   */
  static create(): Promise<Game>;

  /**
   * Retrieve the cookies which are attached to the client session
   * @returns The session cookies
   */
  static getCookies(): Record<string, string>;

  /**
   * Request setup data from server and return it
   */
  static getSetupData(socket: SocketIOClient.Socket): Promise<Game.Data>;

  /**
   * Request World data from server and return it
   */
  static getWorldData(socket: SocketIOClient.Socket): Promise<Game.Data>;

  /**
   * Get the current World status upon initial connection.
   */
  static getWorldStatus(socket: SocketIOClient.Socket): Promise<boolean>;

  /**
   * General game-state socket listeners and event handlers
   */
  static socketListeners(socket: SocketIOClient.Socket): void;

  /**
   * @param view      - The named view which is active for this game instance.
   * @param data      - An object of all the World data vended by the server when the client first connects
   * @param sessionId - The ID of the currently active client session retrieved from the browser cookie
   * @param socket    - The open web-socket which should be used to transact game-state data
   */
  constructor(view: Game['view'], data: Game['data'], sessionId: Game['sessionId'], socket: Game['socket']);

  /**
   * Allow properties to be added dynamically
   */
  [key: string]: unknown;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  actors?: Actors;

  /**
   * A singleton instance of the Audio Helper class
   */
  audio: AudioHelper;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  combats?: CombatEncounters;

  /**
   * The object of world data passed from the server
   */
  data: Game.Data;

  /**
   * Whether the Game is running in debug mode
   */
  debug: boolean;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  folders?: Folders;

  /**
   * Localization support
   */
  i18n: Localization;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  items?: Items;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  journal?: Journal;

  /**
   * The Keyboard Manager
   * @defaultValue `null`
   */
  keyboard?: KeyboardManager;

  /**
   * A flag for whether texture assets for the game canvas are currently loading
   */
  loading: boolean;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  macros?: Macros;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  messages?: Messages;

  /**
   * A mapping of installed modules
   */
  modules: Map<string, Game.Module>;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  packs?: Collection<Compendium>;

  /**
   * The user role permissions setting
   * @remarks This is not yet initialized in the "setup" hook, but is initialized in the "ready" hook.
   * @defaultValue `null`
   */
  permissions?: Game.Permissions;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  playlists?: Playlists;

  /**
   * A flag for whether the Game has successfully reached the "ready" hook
   */
  ready: boolean;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  scenes?: Scenes;

  /**
   * The client session id which is currently active
   */
  sessionId: string;

  /**
   * Client settings which are used to configure application behavior
   */
  settings: ClientSettings;

  /**
   * A reference to the open Socket.io connection
   */
  socket: SocketIOClient.Socket;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  tables?: RollTables;

  /**
   * A singleton GameTime instance which manages the progression of time within the game world.
   */
  time: GameTime;

  /**
   * The id of the active World user, if any
   */
  userId: string | null;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   * - `/players`
   */
  users?: Users;

  /**
   * A singleton instance of the Video Helper class
   */
  video: VideoHelper;

  /**
   * The named view which is currently active.
   * Game views include: join, setup, players, license, game, stream
   */
  view: Game.View;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`
   */
  webrtc?: AVMaster;

  /**
   * A convenient reference to the currently active canvas tool
   */
  get activeTool(): string;

  /**
   * A convenience accessor for the currently viewed Combat encounter
   */
  get combat(): Combat;

  /**
   * Is the current session user authenticated as an application administrator?
   */
  get isAdmin(): boolean;

  /**
   * A state variable which tracks whether or not the game session is currently paused
   */
  get paused(): boolean;

  /**
   * Metadata regarding the game System which powers this World
   */
  get system(): Game.System;

  /**
   * The currently connected User entity, or null if Users is not yet initialized
   */
  get user(): User | null;

  /**
   * Metadata regarding the current game World
   */
  get world(): Game.World;

  /**
   * Activate Event Listeners which apply to every Game View
   */
  activateListeners(): void;

  /**
   * Initialize the Game for the current window location
   */
  initialize(): void;

  /**
   * Initialize the game Canvas
   */
  initializeCanvas(): Promise<void>;

  /**
   * Initialize game state data by creating EntityCollection instances for every Entity types
   */
  initializeEntities(): void;

  /**
   * Initialize Keyboard and Mouse controls
   */
  initializeKeyboard(): void;

  /**
   * Initialize the Compendium packs which are present within this Game
   * Create a Collection which maps each Compendium pack using it's collection ID
   */
  initializePacks(config?: Record<string, { locked?: boolean; private?: boolean }>): Promise<Collection<Compendium>>;

  /**
   * Initialize the WebRTC implementation
   */
  initializeRTC(): Promise<boolean>;

  /**
   * Initialize core UI elements
   */
  initializeUI(): void;

  /**
   * Log out of the game session by returning to the Join screen
   */
  logOut(): void;

  /**
   * Open socket listeners which transact game state data
   */
  openSockets(): void;

  /**
   * Register core game settings
   */
  registerSettings(): void;

  /**
   * Fully set up the game state, initializing Entities, UI applications, and the Canvas
   */
  setupGame(): Promise<void>;

  /**
   * Shut down the currently active Game. Requires GameMaster user permission.
   * @returns A Promise which resolves to the response object from the server
   */
  shutDown(): Promise<void>;

  /**
   * Toggle the pause state of the game
   * Trigger the `pauseGame` Hook when the paused state changes
   * @param pause - The new pause state
   * @param push - Push the pause state change to other connected clients?
   *               (default: `false`)
   */
  togglePause(pause: boolean, push?: boolean): void;

  /**
   * Ensure that necessary fonts have loaded and are ready for use
   * Enforce a maximum timeout in milliseconds.
   * Proceed with rendering after that point even if fonts are not yet available.
   * @param ms - The timeout to delay
   */
  protected _checkFontsReady(ms: number): Promise<void>;

  /**
   * Display certain usability error messages which are likely to result in the player having a bad experience.
   */
  protected _displayUsabilityErrors(): void;

  /**
   * Initialization steps for the primary Game view
   */
  protected _initializeGameView(): Promise<void>;

  /**
   * Initialization steps specifically for the game setup view
   * This view is unique because a Game object does not exist for a non-authenticated player
   */
  protected _initializeJoinView(): Promise<void>;

  /**
   * Initialization steps for the game setup view
   */
  protected _initializeLicenseView(): Promise<void>;

  /**
   * Initialize the Player Management View
   */
  protected _initializePlayersView(): Promise<void>;

  /**
   * Initialization steps for the game setup view
   */
  protected _initializeSetupView(): Promise<void>;

  /**
   * Initialization steps for the Stream helper view
   */
  protected _initializeStreamView(): Promise<void>;

  /**
   * On left mouse clicks, check if the element is contained in a valid hyperlink and open it in a new tab.
   */
  protected _onClickHyperlink(event: MouseEvent): void;

  /**
   * On a left-click event, remove any currently displayed inline roll tooltip
   * @param event - The originating left-click event
   */
  protected _onLeftClick(event: MouseEvent): void;

  /**
   * Disallow dragging of external content onto anything but a file input element
   * @param event - The requested drag event
   */
  protected _onPreventDragover(event: DragEvent): void;

  /**
   * Prevent starting a drag and drop workflow on elements within the document unless the element has the draggable
   * attribute explicitly defined or overrides the dragstart handler.
   * @param event - The initiating drag start event
   */
  protected _onPreventDragstart(event: DragEvent): boolean;

  /**
   * Disallow dropping of external content onto anything but a file input element
   * @param event - The requested drag event
   */
  protected _onPreventDrop(event: DragEvent): void;

  /**
   * Handle window unload operations to clean up any data which may be pending a final save
   * @param event - The window unload event which is about to occur
   *                (unused)
   */
  protected _onWindowBeforeUnload(event?: any): void;

  /**
   * Handle cases where the browser window loses focus to reset detection of currently pressed keys
   * @param event - The originating window.blur event
   */
  protected _onWindowBlur(event: Event): void;

  /**
   * @param event - (unused)
   */
  protected _onWindowPopState(event?: any): void;

  /**
   * Handle resizing of the game window
   * Reposition any active UI windows
   * @param event - (unused)
   */
  protected _onWindowResize(event?: any): void;
}

declare namespace Game {
  interface Data {
    actors?: Actor[];
    addresses?: {
      local?: string;
      remote?: string;
    };
    adminKey?: string;
    combat?: Combat[];
    coreUpdate?: any; // TODO: update later
    files?: {
      s3?: any; // TODO: update later
      storages?: string[];
    };
    folders?: Folder[];
    items?: Item[];
    journal?: Journal[];
    languages?: Language[];
    macros?: Macro[];
    messages?: ChatMessage[];
    modules?: Module[];
    options?: {
      language?: string;
      port?: number;
      routePrefix?: string;
      updateChannel?: string;
    };
    packs?: Pack[];
    paused?: boolean;
    playlists?: Playlist[];
    scenes?: Scene[];
    settings?: WorldSettingsStorage.Setting[];
    system?: string;
    systems?: System[];
    tables?: RollTable[];
    userId?: string;
    users?: User[];
    version?: string;
    world?: string;
    worlds?: World[];
  }

  interface Language {
    lang: string;
    name: string;
    path: string;
  }

  interface Module {
    active: boolean;
    data: Module.Data;
    esmodules: string[];
    id: string;
    languages: Language[];
    packs: Pack[];
    path: string;
    scripts: string[];
    styles: string[];
  }

  namespace Module {
    interface Data {
      // TODO: complete later
      availability: Const.PackageAvailabilityCode;
    }
  }

  interface Pack {
    absPath?: string;
    entity: string;
    label: string;
    name: string;
    package?: string;
    path: string;
    system: string;
  }

  interface Permissions {
    [permissionName: string]: Const.UserRole[];
  }

  interface System {
    data: System.Data;
    entityTypes: Record<string, string[]>; // TODO: make this more precise
    esmodules: string[];
    gridUnits: string;
    id: string;
    languages: Language[];
    model: {
      Actor: Record<string, unknown>;
      Item: Record<string, unknown>;
    };
    packs: Pack[];
    path: string;
    scripts: string[];
    styles: string[];
    template: {
      Actor: Record<string, unknown>;
      Item: Record<string, unknown>;
    };
  }

  namespace System {
    interface Data {
      author: string;
      authors: string[];
      availability: Const.PackageAvailabilityCode;
      bugs: string;
      changelog: string;
      compatibleCoreVersion: string;
      description: string;
      download: string;
      esmodules: string[];
      gridDistance: number;
      gridUnits: string;
      keywords: any[]; // TODO: type later
      languages: Language[];
      license: string;
      manifest: string;
      minimumCoreVersion: string;
      name: string;
      packs: Pack[];
      primaryTokenAttribute: string;
      readme: string;
      scripts: string[];
      secondaryTokenAttribute: string | null;
      socket: boolean;
      styles: string[];
      title: string;
      unavailable: boolean;
      url: string;
      version: string;
    }
  }

  type View = 'game' | 'join' | 'license' | 'players' | 'setup' | 'stream';

  interface World {
    active: boolean;
    data: World.Data;
    esmodules: string[];
    id: string;
    languages: Language[];
    modules: Module[];
    packs: Pack[];
    path: string;
    scritps: string[];
    shortDesc: string;
    styles: string[];
    system: System;
  }

  namespace World {
    interface Data {
      authors: string[];
      availability: Const.PackageAvailabilityCode;
      background: string;
      bugs: string;
      changelog: string;
      compatibleCoreVersion: string;
      coreVersion: string;
      description: string;
      download: string;
      esmodules: string[];
      keywords: any[]; // TODO: type later
      languages: Language[];
      license: string;
      manifest: string;
      minimumCoreVersion: string;
      name: string;
      nextSession: string | null;
      packs: Pack[];
      readme: string;
      scripts: string[];
      socket: boolean;
      styles: string[];
      system: string;
      systemVersion: string;
      title: string;
      unavailable: boolean;
      url: string;
      version: string;
    }
  }
}
