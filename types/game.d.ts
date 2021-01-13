/**
 * @defaultValue `null`
 */
declare let canvas: Canvas | null

/**
 * @defaultValue `null`
 */
declare let game: Game | null

/**
 * @defaultValue `null`
 */
declare let keyboard: KeyboardManager | null

/**
 * @defaultValue `null`
 */
declare let socket: SocketIOClient.Socket | null

declare let ui: {
  actors?: ActorDirectory
  chat?: ChatLog
  combat?: CombatTracker
  compendium?: CompendiumDirectory
  controls?: SceneControls
  hotbar?: Hotbar
  items?: ItemDirectory
  journal?: JournalDirectory
  macros?: MacroDirectory
  menu?: MainMenu
  nav?: SceneNavigation
  notifications?: Notifications
  pause?: Pause
  players?: PlayerList
  playlists?: PlaylistDirectory
  scenes?: SceneDirectory
  settings?: Settings
  sidebar?: Sidebar
  tables?: RollTableDirectory
  webrtc?: CameraViews

  /**
   * @defaultValue `{}`
   */
  windows: Record<number, Application>
}

/**
 * The core Game instance which encapsulates the data, settings, and states
 * relevant for managing the game experience.
 * The singleton instance of the Game class is available as the global variable
 * `game`.
 */
declare class Game {
  actors?: Actors

  /**
   * A singleton instance of the Audio Helper class
   */
  audio: AudioHelper

  combats?: CombatEncounters

  /**
   * The object of world data passed from the server
   */
  data: Game.WorldData

  /**
   * Whether the Game is running in debug mode
   */
  debug: boolean

  folders?: Folders

  /**
   * Localization support
   */
  i18n: Localization

  items?: Items

  journal?: Journal

  /**
   * The Keyboard Manager
   * @defaultValue `null`
   */
  keyboard?: KeyboardManager

  /**
   * A flag for whether texture assets for the game canvas are currently loading
   */
  loading: boolean

  macros?: Macros

  messages?: Messages

  /**
   * A mapping of installed modules
   */
  modules: Map<string, Game.Module>

  packs?: Collection<Compendium>

  /**
   * The user role permissions setting
   * @defaultValue `null`
   */
  permissions?: Game.Permissions

  playlists?: Playlists

  /**
   * A flag for whether the Game has successfully reached the "ready" hook
   */
  ready: boolean

  scenes?: Scenes

  /**
   * The client session id which is currently active
   */
  sessionId: string

  /**
   * Client settings which are used to configure application behavior
   */
  settings: ClientSettings

  /**
   * A reference to the open Socket.io connection
   */
  socket: SocketIOClient.Socket

  tables?: RollTables

  /**
   * A singleton GameTime instance which manages the progression of time within
   * the game world.
   */
  time: GameTime

  /**
   * The id of the active World user, if any
   */
  userId: string | null

  users?: Users

  /**
   * A singleton instance of the Video Helper class
   */
  video: VideoHelper

  /**
   * The named view which is currently active.
   * Game views include: join, setup, players, license, game, stream
   */
  view: Game.View

  webrtc?: AVMaster

  /**
   * @param view - The named view which is active for this game instance.
   * @param data - An object of all the World data vended by the server when the
   *               client first connects
   * @param sessionId - The ID of the currently active client session retrieved
   *                    from the browser cookie
   * @param socket - The open web-socket which should be used to transact
   *                 game-state data
   */
  constructor (
    view: Game.View,
    data: Game.WorldData,
    sessionId: string,
    socket: SocketIOClient.Socket
  )

  /**
   * A convenient reference to the currently active canvas tool
   */
  get activeTool (): string

  /**
   * A convenience accessor for the currently viewed Combat encounter
   */
  get combat (): Combat

  /**
   * Is the current session user authenticated as an application administrator?
   */
  get isAdmin (): boolean

  /**
   * A state variable which tracks whether or not the game session is currently
   * paused
   */
  get paused (): boolean

  /**
   * Metadata regarding the game System which powers this World
   */
  get system (): any // TODO: update when System is typed

  /**
   * The currently connected User entity, or null if Users is not yet
   * initialized
   */
  get user (): User | null

  /**
   * Metadata regarding the current game World
   */
  get world (): any // TODO: update when World is typed

  /**
   * Establish a live connection to the game server through the socket.io URL
   * @param sessionId - The client session ID with which to establish the
   *                    connection
   * @returns A promise which resolves to the connected socket, if successful
   */
  static connect (sessionId: string): Promise<SocketIOClient.Socket>

  /**
   * Fetch World data and return a Game instance
   * @returns A Promise which resolves to the created Game instance
   */
  static create (): Promise<Game>

  /**
   * Retrieve the cookies which are attached to the client session
   * @returns The session cookies
   */
  static getCookies (): Record<string, string>

  /**
   * Request setup data from server and return it
   */
  static getSetupData (socket: SocketIOClient.Socket): Promise<Game.WorldData>

  /**
   * Request World data from server and return it
   */
  static getWorldData (socket: SocketIOClient.Socket): Promise<Game.WorldData>

  /**
   * Get the current World status upon initial connection.
   */
  static getWorldStatus (socket: SocketIOClient.Socket): Promise<boolean>

  /**
   * General game-state socket listeners and event handlers
   */
  static socketListeners (socket: SocketIOClient.Socket): void

  /**
   * Ensure that necessary fonts have loaded and are ready for use
   * Enforce a maximum timeout in milliseconds.
   * Proceed with rendering after that point even if fonts are not yet
   * available.
   * @param ms - The timeout to delay
   * @internal
   */
  _checkFontsReady (ms: number): Promise<void>

  /**
   * Display certain usability error messages which are likely to result in the
   * player having a bad experience.
   * @internal
   */
  _displayUsabilityErrors (): void

  /**
   * Initialization steps for the primary Game view
   * @internal
   */
  _initializeGameView (): Promise<void>

  /**
   * Initialization steps specifically for the game setup view
   * This view is unique because a Game object does not exist for a
   * non-authenticated player
   * @internal
   */
  _initializeJoinView (): Promise<void>

  /**
   * Initialization steps for the game setup view
   * @internal
   */
  _initializeLicenseView (): Promise<void>

  /**
   * Initialize the Player Management View
   * @internal
   */
  _initializePlayersView (): Promise<void>

  /**
   * Initialization steps for the game setup view
   * @internal
   */
  _initializeSetupView (): Promise<void>

  /**
   * Initialization steps for the Stream helper view
   * @internal
   */
  _initializeStreamView (): Promise<void>

  /**
   * On left mouse clicks, check if the element is contained in a valid
   * hyperlink and open it in a new tab.
   * @internal
   */
  _onClickHyperlink (event: MouseEvent): void

  /**
   * On a left-click event, remove any currently displayed inline roll tooltip
   * @param event - The originating left-click event
   * @internal
   */
  _onLeftClick (event: MouseEvent): void

  /**
   * Disallow dragging of external content onto anything but a file input
   * element
   * @param event - The requested drag event
   * @internal
   */
  _onPreventDragover (event: DragEvent): void

  /**
   * Prevent starting a drag and drop workflow on elements within the document
   * unless the element has the draggable attribute explicitly defined or
   * overrides the dragstart handler.
   * @param event - The initiating drag start event
   * @internal
   */
  _onPreventDragstart (event: DragEvent): boolean

  /**
   * Disallow dropping of external content onto anything but a file input
   * element
   * @param event - The requested drag event
   * @internal
   */
  _onPreventDrop (event: DragEvent): void

  /**
   * Handle window unload operations to clean up any data which may be pending a
   * final save
   * @param event - The window unload event which is about to occur
   *                (unused)
   * @internal
   */
  _onWindowBeforeUnload (event: any): void

  /**
   * Handle cases where the browser window loses focus to reset detection of
   * currently pressed keys
   * @param event - The originating window.blur event
   * @internal
   */
  _onWindowBlur (event: Event): void

  /**
   * @param event - (unused)
   */
  _onWindowPopState (event: any): void

  /**
   * Handle resizing of the game window
   * Reposition any active UI windows
   * @param event - (unused)
   * @internal
   */
  _onWindowResize (event: any): void

  /**
   * Activate Event Listeners which apply to every Game View
   */
  activateListeners (): void

  /**
   * Initialize the Game for the current window location
   */
  initialize (): void

  /**
   * Initialize the game Canvas
   */
  initializeCanvas (): Promise<void>

  /**
   * Initialize game state data by creating EntityCollection instances for every
   * Entity types
   */
  initializeEntities (): void

  /**
   * Initialize Keyboard and Mouse controls
   */
  initializeKeyboard (): void

  /**
   * Initialize the Compendium packs which are present within this Game
   * Create a Collection which maps each Compendium pack using it's collection
   * ID
   */
  initializePacks (
    config?: Record<string, { locked?: boolean, private?: boolean }>
  ): Promise<Collection<Compendium>>

  /**
   * Initialize the WebRTC implementation
   */
  initializeRTC (): Promise<boolean>

  /**
   * Initialize core UI elements
   */
  initializeUI (): void

  /**
   * Log out of the game session by returning to the Join screen
   */
  logOut (): void

  /**
   * Open socket listeners which transact game state data
   */
  openSockets (): void

  /**
   * Register core game settings
   */
  registerSettings (): void

  /**
   * Fully set up the game state, initializing Entities, UI applications, and
   * the Canvas
   */
  setupGame (): Promise<void>

  /**
   * Shut down the currently active Game. Requires GameMaster user permission.
   * @returns A Promise which resolves to the response object from the server
   */
  shutDown (): Promise<void>

  /**
   * Toggle the pause state of the game
   * Trigger the `pauseGame` Hook when the paused state changes
   * @param pause - The new pause state
   * @param push - Push the pause state change to other connected clients?
   *               (default: `false`)
   */
  togglePause (pause: boolean, push?: boolean): void
}

declare namespace Game {
  interface Permissions {
    [permissionName: string]: ConstTypes.UserRoles[]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum View {
    Game = 'game',
    Join = 'join',
    License = 'license',
    Players = 'players',
    Setup = 'setup',
    Stream = 'stream'
  }

  interface WorldData {
    actors?: Actor[]
    addresses?: {
      local?: string
      remote?: string
    }
    combat?: Combat[]
    coreUpdate?: any // TODO: update later
    files?: {
      s3?: any // TODO: update later
      storages?: string[]
    }
    folders?: Folder[]
    items?: Item[]
    journal?: Journal[]
    macros?: Macro[]
    messages?: any // TODO: update when Message is typed
    modules?: Module[]
    options?: {
      language?: string
      port?: number
      routePrefix?: string
      updateChannel?: string
    }
    packs?: any // TODO: update when Pack is typed
    paused?: boolean
    playlists?: Playlist[]
    scenes?: Scene[]
    settings?: WorldSettingsStorage.Setting[]
    system?: any // TODO: update when System is typed
    tables?: any // TODO: update when Table is typed
    userId?: string
    users?: User[]
    version?: string
    world?: any // TODO: update when World is typed
  }

  interface Module {
    active: boolean
    data: {
    }
    esmodules: string[]
    id: string
    languages: any[] // TODO: update later
    packs: any[] // TODO: update later
    path: string
    scripts: string[]
    styles: string[]
  }
}
