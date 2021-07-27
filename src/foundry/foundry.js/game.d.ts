import { ConfiguredDocumentClass, ConfiguredDocumentClassForName, DocumentConstructor } from '../../types/helperTypes';

declare global {
  /**
   * The core Game instance which encapsulates the data, settings, and states relevant for managing the game experience.
   * The singleton instance of the Game class is available as the global variable game.
   */
  class Game {
    /**
     * @param view      - The named view which is active for this game instance.
     * @param data      - An object of all the World data vended by the server when the client first connects
     * @param sessionId - The ID of the currently active client session retrieved from the browser cookie
     * @param socket    - The open web-socket which should be used to transact game-state data
     */
    constructor(view: Game['view'], data: Game.ConstructorData, sessionId: Game['sessionId'], socket: Game['socket']);

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
     * The id of the active World user, if any
     */
    userId: string | null;

    /**
     * The game World which is currently active
     */
    world: this['data']['world'];

    /**
     * The System which is used to power this game world
     */
    system: this['data']['system'];

    /**
     * A Map of active modules which are currently enabled in this World
     * @remarks
     * - This is actually defined twice. The second time it has the documentation "A mapping of installed modules".
     * - This includes _all_ modules that are installed, not only those that are enabled.
     */
    modules: Map<string, this['data']['modules'][number]>;

    /**
     * A mapping of WorldCollection instances, one per primary Document type.
     */
    collections: foundry.utils.Collection<WorldCollection<DocumentConstructor, string>>;

    /**
     * A mapping of CompendiumCollection instances, one per Compendium pack.
     */
    packs: foundry.utils.Collection<CompendiumCollection<CompendiumCollection.Metadata>>;

    /**
     * Localization support
     */
    i18n: Localization;

    /**
     * The Keyboard Manager
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     * @defaultValue `null`
     */
    keyboard: KeyboardManager | null;

    /**
     * The user role permissions setting
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     * @defaultValue `null`
     */
    permissions: Game.Permissions | null;

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
    socket: io.Socket | null;

    /**
     * A singleton GameTime instance which manages the progression of time within the game world.
     */
    time: GameTime;

    /**
     * A singleton reference to the Canvas object which may be used.
     */
    canvas: Canvas;

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
     * @defaultValue `false`
     */
    debug: boolean;

    /**
     * A flag for whether texture assets for the game canvas are currently loading
     * @defaultValue `false`
     */
    loading: boolean;

    /**
     * A flag for whether the Game has successfully reached the "ready" hook
     * @defaultValue `false`
     */
    ready: boolean;

    /**
     * Fetch World data and return a Game instance
     * @param view      - The named view being created
     * @param sessionId - The current sessionId of the connecting client
     * @returns A Promise which resolves to the created Game instance
     */
    static create(view: string, sessionId: string | null): Promise<Game>;

    /**
     * Establish a live connection to the game server through the socket.io URL
     * @param sessionId - The client session ID with which to establish the connection
     * @returns A promise which resolves to the connected socket, if successful
     */
    static connect(sessionId: string): Promise<io.Socket>;

    /**
     * Retrieve the cookies which are attached to the client session
     * @returns The session cookies
     */
    static getCookies(): Record<string, string>;

    /**
     * Request World data from server and return it
     */
    static getWorldData(socket: io.Socket): Promise<Game.Data>;

    /**
     * Get the current World status upon initial connection.
     */
    static getWorldStatus(socket: io.Socket): Promise<boolean>;

    /**
     * Configure package data that is currently enabled for this world
     */
    setupPackages(data: Game.Data): void;

    /**
     * Return the named scopes which can exist for packages.
     * Scopes are returned in the prioritization order that their content is loaded.
     * @returns An array of string package scopes
     */
    getPackageScopes(): string[];

    /**
     * Initialize the Game for the current window location
     */
    initialize(): void;

    /**
     * Display certain usability error messages which are likely to result in the player having a bad experience.
     */
    protected _displayUsabilityErrors(): void;

    /**
     * Shut down the currently active Game. Requires GameMaster user permission.
     * @returns A Promise which resolves to the response object from the server
     * @remarks The documentation is a lie, it returns `Promise<void>`, see https://gitlab.com/foundrynet/foundryvtt/-/issues/5573
     */
    shutDown(): Promise<void>;

    /**
     * Fully set up the game state, initializing Entities, UI applications, and the Canvas
     */
    setupGame(): Promise<void>;

    /**
     * Initialize game state data by creating WorldCollection instances for every primary Document type
     */
    initializeEntities(): void;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    users?: ConfiguredCollectionClassForName<'User'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    folders?: ConfiguredCollectionClassForName<'Folder'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    actors?: ConfiguredCollectionClassForName<'Actor'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    items?: ConfiguredCollectionClassForName<'Item'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    scenes?: ConfiguredCollectionClassForName<'Scene'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    combats?: ConfiguredCollectionClassForName<'Combat'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    journal?: ConfiguredCollectionClassForName<'JournalEntry'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    macros?: ConfiguredCollectionClassForName<'Macro'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    playlists?: ConfiguredCollectionClassForName<'Playlist'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    tables?: ConfiguredCollectionClassForName<'RollTable'>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    messages?: ConfiguredCollectionClassForName<'ChatMessage'>;

    /**
     * Initialize the Compendium packs which are present within this Game
     * Create a Collection which maps each Compendium pack using it's collection ID
     */
    initializePacks(): Promise<this['packs']>;

    /**
     * Initialize the WebRTC implementation
     */
    initializeRTC(): Promise<boolean>;

    /**
     * @remarks Initialized between the `'setup'` and `'ready'` hook events.
     */
    webrtc?: AVMaster;

    /**
     * Initialize core UI elements
     */
    initializeUI(): void;

    /**
     * Initialize the game Canvas
     */
    initializeCanvas(): Promise<void>;

    /**
     * Ensure that necessary fonts have loaded and are ready for use
     * Enforce a maximum timeout in milliseconds.
     * Proceed with rendering after that point even if fonts are not yet available.
     * @param ms - The timeout to delay
     */
    protected _checkFontsReady(ms: number): Promise<void>;

    /**
     * Initialize Keyboard and Mouse controls
     */
    initializeKeyboard(): void;

    /**
     * Register core game settings
     */
    registerSettings(): void;

    /**
     * Is the current session user authenticated as an application administrator?
     */
    get isAdmin(): boolean;

    /**
     * The currently connected User entity, or null if Users is not yet initialized
     */
    get user(): StoredDocument<InstanceType<ConfiguredDocumentClass<typeof User>>> | null;

    /**
     * A convenience accessor for the currently viewed Combat encounter
     */
    get combat(): CombatEncounters['viewed'];

    /**
     * A state variable which tracks whether or not the game session is currently paused
     */
    get paused(): boolean;

    /**
     * A convenient reference to the currently active canvas tool
     */
    get activeTool(): string;

    /**
     * Toggle the pause state of the game
     * Trigger the `pauseGame` Hook when the paused state changes
     * @param pause - The desired pause state. When true, the game will be paused, when false the game will be un-paused.
     * @param push  - Push the pause state change to other connected clients? Requires an GM user.
     *                (default: `false`)
     */
    togglePause(pause: boolean, push?: boolean): void;

    /**
     * Log out of the game session by returning to the Join screen
     */
    logOut(): void;

    /**
     * Activate Socket event listeners which are used to transact game state data with the server
     */
    activateSocketListeners(): void;

    /**
     * Activate Event Listeners which apply to every Game View
     */
    activateListeners(): void;

    /**
     * Support mousewheel control for range type input elements
     * @param event - A Mouse Wheel scroll event
     */
    protected static _handleMouseWheelInputChange(event: WheelEvent): void;

    /**
     * On left mouse clicks, check if the element is contained in a valid hyperlink and open it in a new tab.
     */
    protected _onClickHyperlink(event: MouseEvent): void;

    /**
     * Prevent starting a drag and drop workflow on elements within the document unless the element has the draggable
     * attribute explicitly defined or overrides the dragstart handler.
     * @param event - The initiating drag start event
     */
    protected _onPreventDragstart(event: DragEvent): boolean;

    /**
     * Disallow dragging of external content onto anything but a file input element
     * @param event - The requested drag event
     */
    protected _onPreventDragover(event: DragEvent): void;

    /**
     * Disallow dropping of external content onto anything but a file input element
     * @param event - The requested drag event
     */
    protected _onPreventDrop(event: DragEvent): void;

    /**
     * On a left-click event, remove any currently displayed inline roll tooltip
     * @param event - The mousedown pointer event
     */
    protected _onPointerDown(event: PointerEvent): void;

    /**
     * Fallback handling for mouse-up events which aren't handled further upstream.
     * @param event - The mouseup pointer event
     */
    protected _onPointerUp(event: PointerEvent): void;

    /**
     * Handle resizing of the game window
     * Reposition any active UI windows
     */
    protected _onWindowResize(event: UIEvent): void;

    /**
     * Handle window unload operations to clean up any data which may be pending a final save
     * @param event - The window unload event which is about to occur
     */
    protected _onWindowBeforeUnload(event: Event): Promise<void>;

    /**
     * Handle cases where the browser window loses focus to reset detection of currently pressed keys
     * @param event - The originating window.blur event
     */
    protected _onWindowBlur(event: FocusEvent): void;

    /**
     * @param event - (unused)
     */
    protected _onWindowPopState(event: PopStateEvent): void;

    /**
     * Initialize elements required for the current view
     */
    protected _initializeView(): Promise<void>;

    /**
     * Initialization steps for the primary Game view
     */
    protected _initializeGameView(): Promise<void>;

    /**
     * Initialization steps for the Stream helper view
     */
    protected _initializeStreamView(): Promise<void>;
  }

  namespace Game {
    interface Language {
      lang: string;
      name: string;
      path: string;
    }

    interface PackageData<T> {
      type: 'world' | 'system' | 'module';
      data: T;
      id: string;
      path: string;
      scripts: string[];
      esmodules: string[];
      styles: string[];
      languages: Language[];
      packs: {
        name: string;
        label: string;
        path: string;
        private: boolean;
        entity: foundry.CONST.CompendiumEntityType;
        system?: string;
        absPath: string;
        package: string;
      };
      locked: boolean;
      availability: number;
      unavailable: boolean;
      _systemUpdateCheckTime: number;
    }

    interface WorldData<T> extends PackageData<T> {
      type: 'world';
    }

    interface SystemData<T> extends PackageData<T> {
      type: 'system';
      template: {
        Actor?: {
          types: string[];
          templates?: Partial<Record<string, unknown>>;
        } & Partial<Record<string, unknown>>;
        Item?: {
          types: string[];
          templates?: Partial<Record<string, unknown>>;
        } & Partial<Record<string, unknown>>;
      };
      entityTypes: { [Key in foundry.CONST.EntityType | 'Setting' | 'FogExploration']: string[] };
      model: {
        Actor: Partial<Record<string, Partial<Record<string, unknown>>>>;
        Item: Partial<Record<string, Partial<Record<string, unknown>>>>;
      };
    }

    interface ModuleData<T> extends PackageData<T> {
      type: 'module';
      active: boolean;
    }

    type Data = {
      userId: string;
      version: string;
      world: WorldData<foundry.packages.WorldData>;
      system: SystemData<foundry.packages.SystemData>;
      modules: ModuleData<foundry.packages.ModuleData>[];
      paused: boolean;
      addresses: {
        local: string;
        remote: string;
      };
      files: {
        storages: ('public' | 'data' | 's3')[];
        s3?: {
          endpoint: {
            protocol: string;
            host: string;
            port: number;
            hostname: string;
            pathname: string;
            path: string;
            href: string;
          };
          buckets: string[];
        };
      };
      options: {
        language: string;
        port: number;
        routePrefix: string | null;
        updateChannel: string;
        demo: boolean;
      };
      activeUsers: string[];
      packs: {
        name: string;
        label: string;
        path: string;
        private: boolean;
        entity: foundry.CONST.CompendiumEntityType;
        system?: string;
        package: string;
        index: { name: string; type: string; _id: string }[];
      };
      coreUpdate: string | null;
      systemUpdate: string | null;
    } & {
      [DocumentType in
        | foundry.CONST.EntityType
        | 'Setting' as ConfiguredDocumentClassForName<DocumentType>['metadata']['collection']]?: InstanceType<
        ConfiguredDocumentClassForName<DocumentType>
      >['data']['_source'][];
    };

    type ConstructorData = Omit<Data, 'world' | 'system' | 'modules'> & {
      world: WorldData<foundry.packages.WorldData['_source']>;
      system: SystemData<foundry.packages.SystemData['_source']>;
      modules: ModuleData<foundry.packages.ModuleData['_source']>[];
    };

    type Permissions = {
      [Key in keyof typeof foundry.CONST.USER_PERMISSIONS]: foundry.CONST.UserRole[];
    };

    type View = ValueOf<typeof foundry.CONST.GAME_VIEWS>;
  }
}

type ConfiguredCollectionClassForName<Name extends foundry.CONST.EntityType> = InstanceType<CONFIG[Name]['collection']>;
