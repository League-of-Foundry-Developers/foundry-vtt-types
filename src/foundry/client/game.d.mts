import type { Socket } from "socket.io-client";
import type {
  ConfiguredDocumentClassForName,
  ConfiguredModule,
  DocumentConstructor,
  ModuleRequiredOrOptional,
} from "../../types/helperTypes.d.mts";
import type { StoredDocument, ValueOf } from "../../types/utils.d.mts";

type EarlierEvents = {
  none: never;
  init: "none";
  i18nInit: "none" | "init";
  setup: "none" | "init" | "i18nInit";
  ready: "none" | "init" | "i18nInit" | "setup";
};

type InitializationEvent = keyof EarlierEvents;

// Must be called with all hooks in a union.
// Do not increase the complexity of this type. If you do Game related types may get complex enough to complain about not being statically known.
type GameInitialized<Data, MustRun extends InitializationEvent, RunEvents extends InitializationEvent, D = undefined> =
  Extract<RunEvents, MustRun> extends never ? D : Data;

type HooksRan<T extends InitializationEvent> = EarlierEvents[T] | T;

// May be called with just one hook.
type MaybeInitialized<
  Data,
  MustRun extends InitializationEvent,
  RunEvents extends InitializationEvent,
> = GameInitialized<Data, MustRun, HooksRan<RunEvents>, Data | undefined>;

declare class InternalGame<RunEvents extends InitializationEvent> {
  /**
   * @param view      - The named view which is active for this game instance.
   * @param data      - An object of all the World data vended by the server when the client first connects
   * @param sessionId - The ID of the currently active client session retrieved from the browser cookie
   * @param socket    - The open web-socket which should be used to transact game-state data
   */
  constructor(view: Game["view"], data: Game.Data, sessionId: Game["sessionId"], socket: Game["socket"]);

  /**
   * The named view which is currently active.
   * Game views include: join, setup, players, license, game, stream
   */
  readonly view: Game.View;

  /**
   * The object of world data passed from the server
   */
  readonly data: Game.Data;

  /**
   * The Release data for this version of Foundry
   */
  readonly release: foundry.config.ReleaseData;

  /**
   * The id of the active World user, if any
   */
  readonly userId: string | null;

  /**
   * The game World which is currently active.
   */
  readonly world: World;

  /**
   * The System which is used to power this game World.
   */
  readonly system: System;

  /**
   * A Map of active Modules which are currently eligible to be enabled in this World.
   * The subset of Modules which are designated as active are currently enabled.
   */
  readonly modules: Game.ModuleCollection;

  /**
   * A mapping of WorldCollection instances, one per primary Document type.
   * @remarks Initialized just before the `"setup"` hook event is called.
   */
  readonly collections: GameInitialized<
    foundry.utils.Collection<WorldCollection<DocumentConstructor, string>>,
    "setup",
    RunEvents
  >;

  /**
   * A mapping of CompendiumCollection instances, one per Compendium pack.
   * @remarks Initialized just before the `"setup"` hook event is called.
   */
  readonly packs: GameInitialized<
    foundry.utils.Collection<CompendiumCollection<CompendiumCollection.Metadata>>,
    "setup",
    RunEvents
  >;

  /**
   * A singleton web Worker manager.
   */
  readonly workers: WorkerManager;

  /**
   * Localization support
   * @remarks Initialized just before the `"i18nInit"` hook event.
   */
  readonly i18n: GameInitialized<Localization, "i18nInit", RunEvents>;

  /**
   * The Keyboard Manager
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly keyboard: GameInitialized<KeyboardManager, "ready", RunEvents>;

  /**
   * The Mouse Manager
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly mouse: GameInitialized<MouseManager, "ready", RunEvents>;

  /**
   * The Gamepad Manager
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly gamepad: GameInitialized<GamepadManager, "ready", RunEvents>;

  /**
   * The New User Experience manager.
   */
  readonly nue: NewUserExperience;

  /**
   * The user role permissions setting
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly permissions: GameInitialized<Game.Permissions, "setup", RunEvents>;

  /**
   * The client session id which is currently active
   */
  readonly sessionId: string;

  /**
   * Client settings which are used to configure application behavior
   * @remarks Settings are registered between `"init"` and `"i18nInit"` hook events.
   */
  readonly settings: ClientSettings;

  /**
   * Client keybindings which are used to configure application behavior
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly keybindings: GameInitialized<ClientKeybindings, "ready", RunEvents>;

  /**
   * A reference to the open Socket.io connection
   */
  readonly socket: io.Socket;

  /**
   * A singleton GameTime instance which manages the progression of time within the game world.
   */
  readonly time: GameTime;

  /**
   * A singleton reference to the Canvas object which may be used.
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly canvas: GameInitialized<Canvas, "ready", RunEvents>;

  /**
   * A singleton instance of the Audio Helper class
   */
  readonly audio: AudioHelper;

  /**
   * A singleton instance of the Video Helper class
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly video: GameInitialized<VideoHelper, "setup", RunEvents>;

  /**
   * A singleton instance of the TooltipManager class
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly tooltip: GameInitialized<TooltipManager, "setup", RunEvents>;

  /**
   * A singleton instance of the Tour collection class
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly tours: GameInitialized<Tours, "setup", RunEvents>;

  /**
   * The global document index.
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly documentIndex: GameInitialized<DocumentIndex, "setup", RunEvents>;

  /**
   * The singleton instance of the ClientIssues manager.
   */
  readonly issues: ClientIssues;

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
  ready: GameInitialized<true, "ready", RunEvents, false>;

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
   * @param socket - The active socket connection
   * @param view   - The view for which data is being requested
   */
  static getData(socket: Socket, view: string): Promise<unknown>;

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

  // Following three fields are initialized in setupPackages

  documentTypes: Game.Data["documentTypes"];

  template: Game.Data["template"];

  model: Game.Data["model"];

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
   * Shut down the currently active Game. Requires GameMaster user permission.
   */
  shutDown(): Promise<void>;

  /**
   * Fully set up the game state, initializing Documents, UI applications, and the Canvas
   */
  setupGame(): Promise<void>;

  /**
   * Initialize game state data by creating WorldCollection instances for every primary Document type
   */
  initializeDocuments(): void;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  users: GameInitialized<ConfiguredCollectionClassForName<"User">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  folders: GameInitialized<ConfiguredCollectionClassForName<"Folder">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  actors: GameInitialized<ConfiguredCollectionClassForName<"Actor">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  items: GameInitialized<ConfiguredCollectionClassForName<"Item">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  scenes: GameInitialized<ConfiguredCollectionClassForName<"Scene">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  combats: GameInitialized<ConfiguredCollectionClassForName<"Combat">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  journal: GameInitialized<ConfiguredCollectionClassForName<"JournalEntry">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  macros: GameInitialized<ConfiguredCollectionClassForName<"Macro">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  playlists: GameInitialized<ConfiguredCollectionClassForName<"Playlist">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  tables: GameInitialized<ConfiguredCollectionClassForName<"RollTable">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  cards: GameInitialized<ConfiguredCollectionClassForName<"Cards">, "setup", RunEvents>;

  /**
   * @remarks Initialized just before the `"setup"` hook event.
   */
  messages: GameInitialized<ConfiguredCollectionClassForName<"ChatMessage">, "setup", RunEvents>;

  /**
   * Initialize the Compendium packs which are present within this Game
   * Create a Collection which maps each Compendium pack using it's collection ID
   */
  initializePacks(): Promise<this["packs"]>;

  /**
   * Initialize the WebRTC implementation
   */
  initializeRTC(): Promise<boolean>;

  /**
   * @remarks Initialized just before the `"ready"` hook event.
   */
  webrtc: GameInitialized<AVMaster, "ready", RunEvents>;

  /**
   * Initialize core UI elements
   */
  initializeUI(): void;

  /**
   * Initialize the game Canvas
   */
  initializeCanvas(): Promise<void>;

  /**
   * Initialize Keyboard controls
   */
  initializeKeyboard(): void;

  /**
   * Initialize Mouse controls
   */
  initializeMouse(): void;

  /**
   * Initialize Gamepad controls
   */
  initializeGamepads(): void;

  /**
   * Register core game settings
   */
  registerSettings(): void;

  /**
   * Register core Tours
   */
  registerTours(): Promise<void>;

  /**
   * Is the current session user authenticated as an application administrator?
   */
  get isAdmin(): boolean;

  /**
   * The currently connected User entity, or null if Users is not yet initialized
   */
  get user(): StoredDocument<User.ConfiguredInstance> | null;

  /**
   * A convenience accessor for the currently viewed Combat encounter
   */
  get combat(): CombatEncounters["viewed"];

  /**
   * A state variable which tracks whether the game session is currently paused
   */
  get paused(): boolean;

  /**
   * A convenient reference to the currently active canvas tool
   */
  get activeTool(): string;

  /**
   * Toggle the pause state of the game
   * Trigger the `pauseGame` Hook when the paused state changes
   * @param pause - The desired pause state; true for paused, false for un-paused
   * @param push  - Push the pause state change to other connected clients? Requires an GM user.
   *                (default: `false`)
   * @returns The new paused state
   */
  togglePause(pause: boolean, push?: boolean): void;

  /**
   * Open Character sheet for current token or controlled actor
   * @returns The ActorSheet which was toggled, or null if the User has no character
   */
  toggleCharacterSheet(): ActorSheet | null;

  /**
   * Log out of the game session by returning to the Join screen
   */
  logOut(): void;

  /**
   * Scale the base font size according to the user's settings.
   * @param index - Optionally supply a font size index to use, otherwise use the user's setting.
   *                Available font sizes, starting at index 1, are: 8, 10, 12, 14, 16, 18, 20, 24, 28, and 32.
   */
  scaleFonts(index?: number): void;

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
   * Handle resizing of the game window by adjusting the canvas and repositioning active interface applications.
   * @param event - The window resize event which has occurred
   * @internal
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

type _InitGame = Game & InternalGame<"init">;
type _I18nInitGame = Game & InternalGame<"init" | "i18nInit">;
type _SetupGame = Game & InternalGame<"init" | "i18nInit" | "setup">;
type _ReadyGame = Game & InternalGame<"init" | "i18nInit" | "setup" | "ready">;

declare global {
  /**
   * The core Game instance which encapsulates the data, settings, and states relevant for managing the game experience.
   * The singleton instance of the Game class is available as the global variable game.
   */
  class Game extends InternalGame<any> {}

  // These helper types show `Game` at different points in its life cycle.
  // They're merged with `Game` to preserve the invariant `XYZGame instanceof Game`.
  // They're interfaces for easier user declaration merges as well as to give intellisense better names to use as the expanded type is intimidating.

  interface InitGame extends _InitGame {}
  interface I18nInitGame extends _I18nInitGame {}
  interface SetupGame extends _SetupGame {}
  interface ReadyGame extends _ReadyGame {}

  interface HotReloadData {
    /** The type of package which was modified */
    packageType: string;

    /** The id of the package which was modified */
    packageId: string;

    /** The updated stringified file content */
    content: string;

    /** The relative file path which was modified */
    path: string;

    /** The file extension which was modified, e.g. "js", "css", "html" */
    extension: string;
  }

  namespace Game {
    interface ModuleCollection extends Collection<Module> {
      /**
       * Gets the module requested for by ID
       * @see {@link ModuleConfig} to add custom properties to modules like APIs.
       * @see {@link RequiredModules} to remove `undefined` from the return type for a given module
       * @param id - The module ID to look up
       */
      get<T extends string>(id: T): (Module & ConfiguredModule<T>) | Exclude<ModuleRequiredOrOptional<T>, undefined>;
    }

    type Data = {
      activeUsers: string[];
      addresses: {
        local: string;
        remote?: string | undefined;
        remoteIsAccessible: boolean | null;
      };
      coreUpdate: {
        channel: string | null;
        couldReachWebsite: boolean;
        hasUpdate: boolean;
        slowResponse: boolean;
        version: string | null;
        willDisableModules: boolean;
      };
      demoMode: boolean;
      files: {
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
        } | null;
        storages: ("public" | "data" | "s3")[];
      };
      modules: Module["_source"][];
      options: {
        language: string;
        port: number;
        routePrefix: string | null;
        updateChannel: string;
      };
      packageWarnings: Record<string, unknown>;
      packs: Array<
        PackageCompendiumData & {
          /** @deprecated since v11 */
          private?: boolean;
          system?: string;
          type: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
        }
      >;
      paused: boolean;
      release: foundry.config.ReleaseData["_source"];
      system: System["_source"];
      systemUpdate: {
        hasUpdate: boolean;
        version: string;
      };
      // TODO: I think this is only for configurable types
      template: Record<foundry.CONST.DOCUMENT_TYPES, DocumentTemplate>;
      documentTypes: Record<foundry.CONST.DOCUMENT_TYPES, string[]>;
      // TODO: This is also inheriting the configured types,
      // but is only filled in if there's `template.json`
      model: Record<foundry.CONST.DOCUMENT_TYPES, Record<string, object>>;
      userId: string;
      world: World["_source"];
    } & {
      [DocumentType in
        | foundry.CONST.DOCUMENT_TYPES
        | "Setting" as ConfiguredDocumentClassForName<DocumentType>["metadata"]["collection"]]?: InstanceType<
        ConfiguredDocumentClassForName<DocumentType>
      >["_source"][];
    };

    type Permissions = {
      [Key in keyof typeof foundry.CONST.USER_PERMISSIONS]: foundry.CONST.USER_ROLES[];
    };

    type View = ValueOf<typeof foundry.CONST.GAME_VIEWS>;
  }

  /**
   * @defaultValue `undefined`
   * Initialized just before the `"init"` hook event.
   */
  let canvas: MaybeInitialized<Canvas, "init", keyof AssumeHookRan>;

  /**
   * @defaultValue `undefined`
   * Initialized just before the `"ready"` hook event.
   */
  let keyboard: MaybeInitialized<KeyboardManager, "ready", keyof AssumeHookRan>;
}

type ConfiguredCollectionClassForName<Name extends foundry.CONST.DOCUMENT_TYPES> = InstanceType<
  CONFIG[Name]["collection"]
>;

type DocumentTemplate = {
  htmlFields: string[];
  types: string[];
};
