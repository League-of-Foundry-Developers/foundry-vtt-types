import { ConfiguredDocumentClass } from '../common/abstract/helperTypes';

declare global {
  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * - `/stream`: as `{ ready: false }`
   * @defaultValue `null`
   */
  let canvas: Canvas | { ready: false } | null;

  let game: Game;

  /**
   * Initialized in
   * - `/game`: after "setup", before "ready" hook
   * @defaultValue `null`
   */
  let keyboard: KeyboardManager | null;

  /**
   * @defaultValue `null`
   */
  let socket: SocketIOClient.Socket | null;

  /**
   * Each of thses are initialized depending on the current view. The views are the following:
   * - `/license`
   * - `/game`
   * - `/setup`
   * - `/stream`
   * - `/players`
   * - `/join`
   */
  const ui: {
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
  class Game {
    /**
     * @param view      - The named view which is active for this game instance.
     * @param data      - An object of all the World data vended by the server when the client first connects
     * @param sessionId - The ID of the currently active client session retrieved from the browser cookie
     * @param socket    - The open web-socket which should be used to transact game-state data
     */
    constructor(view: Game['view'], data: Game['data'], sessionId: Game['sessionId'], socket: Game['socket']);

    /**
     * The named view which is currently active.
     * Game views include: join, setup, players, license, game, stream
     */
    view: Game.View;

    /**
     * The object of world data passed from the server
     */
    data: Game.Data;

    /**
     * Localization support
     */
    i18n: Localization;

    /**
     * The Keyboard Manager
     * @defaultValue `null`
     */
    keyboard?: KeyboardManager;

    /**
     * A mapping of installed modules
     */
    modules: Map<string, Game.Module>;

    /**
     * The user role permissions setting
     * @remarks This is not yet initialized in the "setup" hook, but is initialized in the "ready" hook.
     * @defaultValue `null`
     */
    permissions?: Game.Permissions;

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
     * A singleton GameTime instance which manages the progression of time within the game world.
     */
    time: GameTime;

    /**
     * The id of the active World user, if any
     */
    userId: string | null;

    /**
     * A singleton instance of the Audio Helper class
     */
    audio: AudioHelper;

    /**
     * A singleton instance of the Video Helper class
     */
    video: VideoHelper;

    /**
     * Whether the Game is running in debug mode
     */
    debug: boolean;

    /**
     * A flag for whether texture assets for the game canvas are currently loading
     */
    loading: boolean;

    /**
     * A flag for whether the Game has successfully reached the "ready" hook
     */
    ready: boolean;

    /**
     * Allow properties to be added dynamically
     */
    [key: string]: unknown;

    /* -------------------------------------------- */

    /**
     * Fetch World data and return a Game instance
     * @returns A Promise which resolves to the created Game instance
     */
    static create(): Promise<Game>;

    /* -------------------------------------------- */

    /**
     * Establish a live connection to the game server through the socket.io URL
     * @param sessionId - The client session ID with which to establish the connection
     * @returns A promise which resolves to the connected socket, if successful
     */
    static connect(sessionId: string): Promise<SocketIOClient.Socket>;

    /* -------------------------------------------- */

    /**
     * Retrieve the cookies which are attached to the client session
     * @returns The session cookies
     */
    static getCookies(): Record<string, string>;

    /* -------------------------------------------- */

    /**
     * Get the current World status upon initial connection.
     */
    static getWorldStatus(socket: SocketIOClient.Socket): Promise<boolean>;

    /* -------------------------------------------- */

    /**
     * Request World data from server and return it
     */
    static getWorldData(socket: SocketIOClient.Socket): Promise<Game.Data>;

    /* -------------------------------------------- */

    /**
     * Request setup data from server and return it
     */
    static getSetupData(socket: SocketIOClient.Socket): Promise<Game.Data>;

    /* -------------------------------------------- */

    /**
     * Initialize the Game for the current window location
     */
    initialize(): void;

    /* -------------------------------------------- */

    /**
     * Display certain usability error messages which are likely to result in the player having a bad experience.
     */
    protected _displayUsabilityErrors(): void;

    /* -------------------------------------------- */

    /**
     * Shut down the currently active Game. Requires GameMaster user permission.
     * @returns A Promise which resolves to the response object from the server
     */
    shutDown(): Promise<void>;

    /* -------------------------------------------- */
    /*  Primary Game Initialization
  /* -------------------------------------------- */

    /**
     * Fully set up the game state, initializing Entities, UI applications, and the Canvas
     */
    setupGame(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialize game state data by creating EntityCollection instances for every Entity types
     */
    initializeEntities(): void;

    /* -------------------------------------------- */

    /**
     * Initialize the Compendium packs which are present within this Game
     * Create a Collection which maps each Compendium pack using it's collection ID
     */
    initializePacks(
      config?: Record<string, { locked?: boolean; private?: boolean }>
    ): Promise<foundry.utils.Collection<Compendium>>;

    /* -------------------------------------------- */

    /**
     * Initialize the WebRTC implementation
     */
    initializeRTC(): Promise<boolean>;

    /* -------------------------------------------- */

    /**
     * Initialize core UI elements
     */
    initializeUI(): void;

    /* -------------------------------------------- */

    /**
     * Initialize the game Canvas
     */
    initializeCanvas(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Ensure that necessary fonts have loaded and are ready for use
     * Enforce a maximum timeout in milliseconds.
     * Proceed with rendering after that point even if fonts are not yet available.
     * @param ms - The timeout to delay
     */
    protected _checkFontsReady(ms: number): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialize Keyboard and Mouse controls
     */
    initializeKeyboard(): void;

    /* -------------------------------------------- */

    /**
     * Register core game settings
     */
    registerSettings(): void;

    /* -------------------------------------------- */
    /*  Properties                                  */
    /* -------------------------------------------- */

    /**
     * Is the current session user authenticated as an application administrator?
     */
    get isAdmin(): boolean;

    /* -------------------------------------------- */

    /**
     * The currently connected User entity, or null if Users is not yet initialized
     */
    get user(): InstanceType<ConfiguredDocumentClass<typeof User>> | null;

    /* -------------------------------------------- */

    /**
     * Metadata regarding the current game World
     */
    get world(): Game.World;

    /* -------------------------------------------- */

    /**
     * Metadata regarding the game System which powers this World
     */
    get system(): Game.System;

    /* -------------------------------------------- */

    /**
     * A convenience accessor for the currently viewed Combat encounter
     */
    get combat(): Combat;

    /* -------------------------------------------- */

    /**
     * A state variable which tracks whether or not the game session is currently paused
     */
    get paused(): boolean;

    /* -------------------------------------------- */

    /**
     * A convenient reference to the currently active canvas tool
     */
    get activeTool(): string;

    /* -------------------------------------------- */
    /*  Methods                                     */
    /* -------------------------------------------- */

    /**
     * Toggle the pause state of the game
     * Trigger the `pauseGame` Hook when the paused state changes
     * @param pause - The new pause state
     * @param push - Push the pause state change to other connected clients?
     *               (default: `false`)
     */
    togglePause(pause: boolean, push?: boolean): void;

    /* -------------------------------------------- */

    /**
     * Log out of the game session by returning to the Join screen
     */
    logOut(): void;

    /* -------------------------------------------- */
    /*  Socket Listeners and Handlers               */
    /* -------------------------------------------- */

    /**
     * Open socket listeners which transact game state data
     */
    openSockets(): void;

    /* -------------------------------------------- */

    /**
     * General game-state socket listeners and event handlers
     */
    static socketListeners(socket: SocketIOClient.Socket): void;

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers                */
    /* -------------------------------------------- */

    /**
     * Activate Event Listeners which apply to every Game View
     */
    activateListeners(): void;

    /* -------------------------------------------- */

    /**
     * On left mouse clicks, check if the element is contained in a valid hyperlink and open it in a new tab.
     */
    protected _onClickHyperlink(event: MouseEvent): void;

    /* -------------------------------------------- */

    /**
     * Prevent starting a drag and drop workflow on elements within the document unless the element has the draggable
     * attribute explicitly defined or overrides the dragstart handler.
     * @param event - The initiating drag start event
     */
    protected _onPreventDragstart(event: DragEvent): boolean;

    /* -------------------------------------------- */

    /**
     * Disallow dragging of external content onto anything but a file input element
     * @param event - The requested drag event
     */
    protected _onPreventDragover(event: DragEvent): void;

    /* -------------------------------------------- */

    /**
     * Disallow dropping of external content onto anything but a file input element
     * @param event - The requested drag event
     */
    protected _onPreventDrop(event: DragEvent): void;

    /* -------------------------------------------- */

    /**
     * On a left-click event, remove any currently displayed inline roll tooltip
     * @param event - The originating left-click event
     */
    protected _onLeftClick(event: MouseEvent): void;

    /* -------------------------------------------- */

    /**
     * Handle resizing of the game window
     * Reposition any active UI windows
     * @param event - (unused)
     */
    protected _onWindowResize(event?: any): void;

    /* -------------------------------------------- */

    /**
     * Handle window unload operations to clean up any data which may be pending a final save
     * @param event - The window unload event which is about to occur
     *                (unused)
     */
    protected _onWindowBeforeUnload(event?: any): void;

    /* -------------------------------------------- */

    /**
     * Handle cases where the browser window loses focus to reset detection of currently pressed keys
     * @param event - The originating window.blur event
     */
    protected _onWindowBlur(event: Event): void;

    /* -------------------------------------------- */

    /**
     * @param event - (unused)
     */
    protected _onWindowPopState(event?: any): void;

    /* -------------------------------------------- */
    /*  View Initialization Functions
  /* -------------------------------------------- */

    /**
     * Initialization steps for the primary Game view
     */
    protected _initializeGameView(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialization steps for the game setup view
     */
    protected _initializeLicenseView(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialization steps for the game setup view
     */
    protected _initializeSetupView(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialization steps for the Stream helper view
     */
    protected _initializeStreamView(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialize the Player Management View
     */
    protected _initializePlayersView(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialization steps specifically for the game setup view
     * This view is unique because a Game object does not exist for a non-authenticated player
     */
    protected _initializeJoinView(): Promise<void>;

    /* -------------------------------------------- */

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     * - `/players`
     */
    users?: Users;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    messages?: Messages;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    scenes?: Scenes;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    actors?: Actors;

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
    playlists?: Playlists;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    combats?: CombatEncounters;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    tables?: RollTables;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    folders?: Folders;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    packs?: foundry.utils.Collection<Compendium>;

    /**
     * Initialized in
     * - `/game`: after "setup", before "ready" hook
     * - `/stream`
     */
    webrtc?: AVMaster;
  }

  namespace Game {
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
        availability: foundry.CONST.PackageAvailabilityCode;
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
      [permissionName: string]: foundry.CONST.UserRole[];
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
        availability: foundry.CONST.PackageAvailabilityCode;
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
        availability: foundry.CONST.PackageAvailabilityCode;
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
}
