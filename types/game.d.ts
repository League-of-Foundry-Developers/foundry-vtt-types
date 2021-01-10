// @TODO: Add types

declare let socket: SocketIOClient.Socket
declare let canvas: any
declare let keyboard: any
declare let game: Game
declare let ui: {
  actors: ActorDirectory
  combat: CombatTracker
  notifications: Notifications
  tables: RollTableDirectory
  windows: Record<number, Application>
}

/**
 * The core Game instance which encapsulates the data, settings, and states relevant for managing the game experience.
 * The singleton instance of the Game class is available as the global variable `game`.
 *
 * @param worldData - An object of all the World data vended by the server when the client first connects
 * @param userId - The ID of the currently active user, retrieved from their session cookie
 * @param socket - The open web-socket which should be used to transact game-state data
 */
declare class Game {
  // Added so developers can easily add system/module specific stuff to the game object
  [key: string]: any;

  actors: Actors

  /** A singleton instance of the Audio Helper class */
  audio: AudioHelper

  combats: CombatEncounters

  /** The object of world data passed from the server */
  data: any

  /** Whether the Game is running in debug mode */
  debug: boolean

  folders: Folders

  /** Localization support */
  i18n: Localization

  items: Items

  journal: Journal

  /** The Keyboard Manager */
  keyboard: KeyboardManager

  /**
   * A flag for whether texture assets for the game canvas are currently loading
   */
  loading: boolean

  macros: Macros

  messages: Messages

  /** A mapping of installed modules */
  modules: Map<any, any>

  packs: Collection<any>

  /** The user role permissions setting */
  permissions: any

  playlists: Playlists

  /** A flag for whether the Game has successfully reached the "ready" hook */
  ready: boolean

  scenes: Scenes

  /** The client session id which is currently active */
  sessionId: string

  /** Client settings which are used to configure application behavior */
  settings: ClientSettings

  /** A reference to the open Socket.io connection */
  socket: SocketIOClient.Socket

  tables: RollTables

  /** The id of the active game user */
  userId: string

  users: Users

  /** A singleton instance of the Video Helper class */
  video: VideoHelper

  constructor (
    worldData: object,
    userId: string,
    socket: SocketIOClient.Socket
  );

  /**
   * A convenient reference to the currently active canvas tool
   */
  get activeTool (): string;

  /**
   * A convenience accessor for the currently active Combat encounter
   */
  get combat (): Combat;

  /**
   * A state variable which tracks whether or not the game session is currently paused
   */
  get paused (): boolean;

  /**
   * Metadata regarding the game System which powers this World
   */
  get system (): any;

  /**
   * The currently connected User
   */
  get user (): User;

  /**
   * Metadata regarding the current game World
   */
  get world (): any;

  static clearCookies (): boolean;

  /**
   * Fetch World data and return a Game instance
   * @returns A Promise which resolves to the created Game instance
   */
  static create (): Promise<Game>;

  static getCookies (): object;

  /**
   * Request setup data from server and return it
   */
  static getSetupData (socket: SocketIOClient.Socket): Promise<any>;

  /**
   * Request World data from server and return it
   */
  static getWorldData (socket: SocketIOClient.Socket): Promise<any>;

  /**
   * General game-state socket listeners and event handlers
   */
  static socketListeners (socket: SocketIOClient.Socket): void;

  /**
   * Activate Event Listeners which apply to every Game View
   */
  activateListeners (): void;

  /**
   * Initialize the Game for the current window location
   */
  initialize (): Promise<void>;

  /**
   * Initialize the game Canvas
   */
  initializeCanvas (): Promise<void>;

  /**
   * Initialize game state data by creating Collections for all Entity types
   */
  initializeEntities (): void;

  /**
   * Initialize Keyboard and Mouse controls
   */
  initializeKeyboard (): void;

  /**
   * Initialization actions for compendium packs
   */
  initializePacks (config: any): Promise<void>;

  /**
   * Initialize the WebRTC implementation
   */
  initializeRTC (): void;

  /**
   * Initialize core UI elements
   */
  initializeUI (): void;

  /**
   * Open socket listeners which transact game state data
   */
  openSockets (): void;

  /**
   * Register core game settings
   */
  registerSettings (): void;

  /**
   * Fully set up the game state, initializing Entities, UI applications, and the Canvas
   */
  setupGame (): Promise<void>;

  /**
   * Toggle the pause state of the game
   * Trigger the `pauseGame` Hook when the paused state changes
   * @param pause - The new pause state
   * @param push - Push the pause state change to other connected clients?
   */
  togglePause (pause: boolean, push?: boolean): void;
}
