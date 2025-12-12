import type { Socket } from "socket.io-client";
import type { ValueOf, FixedInstanceType, InitializationHook, InitializedOn, EmptyObject, GetKey } from "#utils";
import type BasePackage from "#common/packages/base-package.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

import AVMaster = foundry.av.AVMaster;
import Module = foundry.packages.Module;
import type ClientDatabaseBackend from "#client/data/client-backend.mjs";

// Must be called with all hooks in a union.
// Do not increase the complexity of this type. If you do Game related types may get complex enough to complain about not being statically known.
type SimpleInitializedOn<
  InitializedTo,
  MustRun extends InitializationHook,
  RunHooks extends InitializationHook,
  BeforeInitialization = undefined,
> = Extract<RunHooks, MustRun> extends never ? BeforeInitialization : InitializedTo;

/**
 * @privateRemarks In v12 many of these properties were mistakenly stripped of their readonly quality;
 *                 This is preserved in the types despite them being technically writable.
 *                 See https://github.com/foundryvtt/foundryvtt/issues/11813
 */
declare class InternalGame<RunEvents extends InitializationHook> {
  /**
   * @param view      - The named view which is active for this game instance.
   * @param data      - An object of all the World data vended by the server when the client first connects
   * @param sessionId - The ID of the currently active client session retrieved from the browser cookie
   * @param socket    - The open web-socket which should be used to transact game-state data
   */
  constructor(view: Game["view"], data: Game.Data, sessionId: Game["sessionId"], socket: Game["socket"]);

  /**
   * The named view which is currently active.
   * @remarks The full type includes `"join"|"setup"|"players"|"license"` but these views do not run package code.
   */
  readonly view: Game.View;

  /**
   * The object of world data passed from the server
   */
  readonly data: Game.Data;

  /**
   * The client session id which is currently active.
   */
  readonly sessionId: string;

  /**
   * A reference to the open Socket.io connection
   */
  readonly socket: io.Socket;

  /**
   * The id of the active World user, if any
   */
  readonly userId: string | null;

  /**
   * The game World which is currently active.
   */
  readonly world: foundry.packages.World;

  /**
   * The System which is used to power this game World.
   */
  readonly system: foundry.packages.System;

  /**
   * A Map of active Modules which are currently eligible to be enabled in this World.
   * The subset of Modules which are designated as active are currently enabled.
   */
  readonly modules: Game.ModuleCollection;

  /**
   * A mapping of CompendiumCollection instances, one per Compendium pack.
   * @remarks Initialized just before the `"setup"` hook event is called.
   */
  readonly packs: SimpleInitializedOn<foundry.documents.collections.CompendiumPacks, "setup", RunEvents>;

  /**
   * A registry of document sub-types and their respective data models.
   */
  get model(): Game.Model;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "Game#template is deprecated and will be removed in Version 14. Use cases for Game#template should be refactored to instead use System#documentTypes or Game#model"
   */
  get template(): Game.Data["template"];

  /**
   * A registry of document types supported by the active world.
   */
  get documentTypes(): {
    [K in Document.Type]: Game.Model.TypeNames<K>[];
  };

  /**
   * The global document index.
   * @remarks Initialized just before the `"setup"` hook event is called.
   */
  readonly documentIndex: SimpleInitializedOn<foundry.helpers.DocumentIndex, "setup", RunEvents>;

  /**
   * The UUID redirects tree.
   * @remarks Initialized just before the `"ready"` hook event is called.
   */
  readonly compendiumUUIDRedirects: foundry.utils.StringTree<string[]>;

  /**
   * A mapping of WorldCollection instances, one per primary Document type.
   * @remarks Initialized just before the `"setup"` hook event is called.
   */
  // TODO: Make this a fake Collection subclass like game.modules, return the specific `.Implementation`s for the known keys
  readonly collections: SimpleInitializedOn<Game.WorldCollectionsCollection, "setup", RunEvents>;

  /**
   * The collection of Actor documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly actors: SimpleInitializedOn<ConfiguredCollectionClassForName<"Actor">, "setup", RunEvents>;

  /**
   * The collection of Cards documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly cards: SimpleInitializedOn<ConfiguredCollectionClassForName<"Cards">, "setup", RunEvents>;

  /**
   * The collection of Combat documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly combats: SimpleInitializedOn<ConfiguredCollectionClassForName<"Combat">, "setup", RunEvents>;

  /**
   * The collection of Folder documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly folders: SimpleInitializedOn<ConfiguredCollectionClassForName<"Folder">, "setup", RunEvents>;

  /**
   * The collection of Item documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly items: SimpleInitializedOn<ConfiguredCollectionClassForName<"Item">, "setup", RunEvents>;

  /**
   * The collection of JournalEntry documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly journal: SimpleInitializedOn<ConfiguredCollectionClassForName<"JournalEntry">, "setup", RunEvents>;

  /**
   * The collection of Macro documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly macros: SimpleInitializedOn<ConfiguredCollectionClassForName<"Macro">, "setup", RunEvents>;

  /**
   * The collection of ChatMessage documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly messages: SimpleInitializedOn<ConfiguredCollectionClassForName<"ChatMessage">, "setup", RunEvents>;

  /**
   * The collection of Playlist documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly playlists: SimpleInitializedOn<ConfiguredCollectionClassForName<"Playlist">, "setup", RunEvents>;

  /**
   * The collection of Scene documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly scenes: SimpleInitializedOn<ConfiguredCollectionClassForName<"Scene">, "setup", RunEvents>;

  /**
   * The collection of RollTable documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly tables: SimpleInitializedOn<ConfiguredCollectionClassForName<"RollTable">, "setup", RunEvents>;

  /**
   * The collection of User documents which exists in the World.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly users: SimpleInitializedOn<ConfiguredCollectionClassForName<"User">, "setup", RunEvents>;

  /**
   * The Release data for this version of Foundry
   */
  readonly release: foundry.config.ReleaseData;

  /**
   * Returns the current version of the Release, usable for comparisons using isNewerVersion
   */
  get version(): string;

  /**
   * Whether the Game is running in debug mode
   * @defaultValue `false`
   */
  readonly debug: boolean;

  /**
   * A flag for whether texture assets for the game canvas are currently loading
   * @defaultValue `false`
   */
  readonly loading: boolean;

  /**
   * The user role permissions setting
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly permissions: SimpleInitializedOn<Game.Permissions, "setup", RunEvents>;

  /**
   * A flag for whether the Game has successfully reached the "ready" hook
   * @defaultValue `false`
   */
  readonly ready: SimpleInitializedOn<true, "ready", RunEvents, false>;

  /**
   * The singleton compendium art manager.
   * @remarks Initialized just before the `"setup"` hook event.
   */
  readonly compendiumArt: foundry.helpers.media.CompendiumArt;

  /**
   * A singleton instance of the Audio Helper class
   */
  readonly audio: foundry.audio.AudioHelper;

  /**
   * A singleton reference to the Canvas object which may be used.
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly canvas: SimpleInitializedOn<Canvas, "ready", RunEvents>;

  /**
   * The singleton Clipboard Helper.
   */
  readonly clipboard: foundry.helpers.interaction.ClipboardHelper;

  /**
   * Localization support
   * @remarks Initialized just before the `"i18nInit"` hook event.
   */
  readonly i18n: SimpleInitializedOn<foundry.helpers.Localization, "i18nInit", RunEvents>;

  /**
   * The singleton instance of the ClientIssues manager.
   */
  readonly issues: foundry.helpers.ClientIssues;

  /**
   * The Gamepad Manager
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly gamepad: SimpleInitializedOn<foundry.helpers.interaction.GamepadManager, "ready", RunEvents>;

  /**
   * The Keyboard Manager
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly keyboard: SimpleInitializedOn<foundry.helpers.interaction.KeyboardManager, "ready", RunEvents>;

  /**
   * Client keybindings which are used to configure application behavior
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly keybindings: SimpleInitializedOn<foundry.helpers.interaction.ClientKeybindings, "ready", RunEvents>;

  /**
   * The Mouse Manager
   * @remarks Initialized just before the `"ready"` hook event.
   */
  readonly mouse: SimpleInitializedOn<foundry.helpers.interaction.MouseManager, "ready", RunEvents>;

  /**
   * The New User Experience manager.
   * @remarks Initialized just after the `"ready"` hook event.
   */
  readonly nue: foundry.nue.NewUserExperienceManager;

  /**
   * Client settings which are used to configure application behavior
   * @remarks Settings are registered between `"init"` and `"i18nInit"` hook events.
   */
  readonly settings: foundry.helpers.ClientSettings;

  /**
   * A singleton GameTime instance which manages the progression of time within the game world.
   */
  readonly time: foundry.helpers.GameTime;

  /**
   * A singleton instance of the TooltipManager class
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly tooltip: SimpleInitializedOn<foundry.helpers.interaction.TooltipManager, "setup", RunEvents>;

  /**
   * A singleton instance of the Tour collection class
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly tours: SimpleInitializedOn<foundry.nue.ToursCollection, "setup", RunEvents>;

  /**
   * A singleton instance of the Video Helper class
   * @remarks Initialized just before the `"setup"` hook events is called.
   */
  readonly video: SimpleInitializedOn<foundry.helpers.media.VideoHelper, "setup", RunEvents>;

  /**
   * A singleton web Worker manager.
   */
  readonly workers: foundry.helpers.WorkerManager;

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

  /**
   * Return the named scopes which can exist for packages.
   * Scopes are returned in the prioritization order that their content is loaded.
   * @returns An array of string package scopes
   */
  getPackageScopes(): ClientDatabaseBackend.FlagScopes[];

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
   * Initialize configuration state.
   */
  initializeConfig(): void;

  /**
   * Initialize game state data by creating WorldCollection instances for every primary Document type
   */
  initializeDocuments(): void;

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
  webrtc: SimpleInitializedOn<AVMaster, "ready", RunEvents>;

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
   *
   * @remarks Initialized just before the `"setup"` hook event.
   */
  get user(): SimpleInitializedOn<User.Stored, "setup", RunEvents, null>;

  /**
   * A convenience accessor for the currently viewed Combat encounter
   */
  get combat(): foundry.documents.collections.CombatEncounters["viewed"];

  /**
   * A state variable which tracks whether the game session is currently paused
   */
  get paused(): boolean;

  /**
   * A convenient reference to the currently active canvas tool
   */
  get activeTool(): string;

  /**
   * Toggle the pause state of the game, triggering the {@link hookEvents.pauseGame} hook when the paused
   * state changes.
   * @param pause   - The desired pause state; true for paused, false for un-paused
   * @param options - Additional options which modify the pause operation
   * @returns The new paused state
   */
  togglePause(pause: boolean, options?: Game.TogglePauseOptions): void;

  /**
   * @deprecated "You are passing the legacy `push` boolean to `Game#togglePause`. This is replaced by the `broadcast` option, for example `game.togglePause(true, {broadcast: true})`" (since v13 until v15)
   */
  togglePause(pause: boolean, push?: boolean): void;

  /**
   * Open Character sheet for current token or controlled actor
   * @returns The ActorSheet which was toggled, or null if the User has no character
   */
  toggleCharacterSheet(): foundry.appv1.sheets.ActorSheet.Any | foundry.applications.sheets.ActorSheetV2.Any | null;

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

/**
 * The core Game instance which encapsulates the data, settings, and states relevant for managing the game experience.
 * The singleton instance of the Game class is available as the global variable game.
 */
declare class Game extends InternalGame<any> {}

declare global {
  // These helper types show `Game` at different points in its life cycle.
  // They're merged with `Game` to preserve the invariant `XYZGame instanceof Game`.
  // They're interfaces for easier user declaration merges as well as to give intellisense better names to use as the expanded type is intimidating.

  interface InitGame extends _InitGame {}
  interface I18nInitGame extends _I18nInitGame {}
  interface SetupGame extends _SetupGame {}
  interface ReadyGame extends _ReadyGame {}
}

declare namespace Game {
  /**
   * The special interface for {@linkcode Game.modules | game.modules}.
   *
   * This is a {@linkcode Collection} at runtime, not a subclass, but the type of its `get` method is overridden here to provide specificity
   * where we can know which types certain keys refer to due to fvtt-types's configuration interfaces {@linkcode ModuleConfig} and
   * {@linkcode RequiredModules}.
   */
  interface ModuleCollection extends Collection<foundry.packages.Module, ModuleCollectionMethods> {
    /**
     * @remarks Gets the module requested for by ID.
     *
     * Go to definition doesn't work here, see {@linkcode ModuleCollectionMethods.get}.
     * @see {@linkcode ModuleConfig} to add custom properties to modules, for example APIs.
     * @see {@linkcode RequiredModules} to remove `undefined` from the return type for a given module
     * @param id - The module ID to look up
     *
     * @privateRemarks The `Methods` hack does not pass through JSDoc, so we have this otherwise unnecessary override here.
     */
    get: ModuleCollectionMethods["get"];
  }

  /**
   * Methods for the {@linkcode ModuleCollection} fake class. Only `#get` needs a type override, the rest is inherited.
   */
  interface ModuleCollectionMethods extends Omit<Collection.Methods<foundry.packages.Module>, "get"> {
    get<T extends string, Options extends Collection.GetOptions | undefined = undefined>(
      id: T,
      options?: Options,
    ): _ModuleCollectionGetReturn<T, Options>;
  }

  /** @internal */
  type _ModuleCollectionGetReturn<
    Name extends string,
    Options extends Collection.GetOptions | undefined = undefined,
  > = Name extends keyof RequiredModules ? _Module<Name> : Collection.GetReturn<_MaybeActiveModule<Name>, Options>;

  /** @internal */
  type _Module<Name extends string> =
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    { active: true } & Module & GetKey<ModuleConfig, Name, {}>;

  /** @internal */
  type _MaybeActiveModule<Name extends string> =
    | _Module<Name>
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    | ({ active: false } & Module & { [K in keyof GetKey<ModuleConfig, Name, {}>]?: never });

  /**
   * The type for {@linkcode Game.collections | game.collections} after initialization.
   *
   * This is a {@linkcode Collection} at runtime, not a subclass, but the type of its `get` method is overridden here to return the
   * Foundry-provided {@linkcode WorldCollection}s for their known keys.
   */
  interface WorldCollectionsCollection extends Collection<WorldCollection.Any, WorldCollectionsCollectionMethods> {
    /**
     * @remarks Returns the appropriate {@linkcode WorldCollection} implementation
     * when passed a key in {@linkcode CONST.WORLD_DOCUMENT_TYPES}.
     *
     * Go to definition breaks here, see {@linkcode WorldCollectionsCollectionMethods.get}.
     */
    get: WorldCollectionsCollectionMethods["get"];
  }

  interface WorldCollectionsCollectionMethods extends Omit<Collection.Methods<WorldCollection.Any>, "get"> {
    get<Key extends string, Options extends Collection.GetOptions | undefined>(
      key: Key,
      options?: Options,
    ): _WorldCollectionsCollectionGetReturn<Key, Options>;
  }

  /** @internal */
  type _WorldCollectionsCollectionGetReturn<
    Key extends string,
    Options extends Collection.GetOptions | undefined,
  > = Key extends CONST.WORLD_DOCUMENT_TYPES
    ? WorldCollection.ForName<Key>
    : Collection._GetReturn<WorldCollection.Any, Options>;

  namespace Model {
    /**
     * Get the configured core and system type names for a specific document type.
     *
     * Because of module subtypes, extra types of the form `${moduleName}.${subtype}` are
     * possible when `hasTypeData` is true.
     *
     * @template DocumentName - the type of the Document this data is for
     */
    type TypeNames<DocumentType extends Document.Type> = Document.SubTypesOf<DocumentType>;
  }

  /** @internal */
  type _Model = {
    [DocumentType in Document.Type]: DocumentType extends Document.WithSystem
      ? _ModelType<DocumentType>
      : { base: EmptyObject };
  };

  /** @internal */
  type _ModelType<DocumentType extends Document.WithSystem> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect._ModelMap : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta._ModelMap : never)
    | (DocumentType extends "Actor" ? Actor._ModelMap : never)
    | (DocumentType extends "Card" ? Card._ModelMap : never)
    | (DocumentType extends "Cards" ? Cards._ModelMap : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage._ModelMap : never)
    | (DocumentType extends "Combat" ? Combat._ModelMap : never)
    | (DocumentType extends "Combatant" ? Combatant._ModelMap : never)
    | (DocumentType extends "CombatantGroup" ? CombatantGroup._ModelMap : never)
    | (DocumentType extends "Item" ? Item._ModelMap : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage._ModelMap : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior._ModelMap : never);

  interface Model extends _Model {}

  interface PackageWarning {
    /** @remarks The ID of the package, matches this objects key in {@linkcode Game.Data.packageWarnings} */
    id: string;

    /** @remarks From limited empirical sampling, only `false` if the package lacks a manifest */
    reinstallable: boolean;

    /**
     * @remarks Not included if the package itself lacks a manifest (e.g JB2A patreon pack).
     * Never seen explicitly `undefined`, only omitted, during testing.
     */
    manifest?: string | undefined;

    /** @remarks Presumably `"world" | "system" | "module"`, but difficult to confirm. */
    type: string;

    /**
     * Error messages.
     */
    error: string[];

    /**
     * Warning messages.
     */
    warning: string[];
  }

  /** @internal */
  type _Data = {
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
    modules: foundry.packages.Module["_source"][];
    options: {
      language: string;
      port: number;
      routePrefix: string | null;
      updateChannel: string;
    };
    packageWarnings: Record<string, PackageWarning>;
    packs: Array<Data.Pack>;
    paused: boolean;
    release: foundry.config.ReleaseData["_source"];
    system: foundry.packages.System["_source"];
    systemUpdate: {
      hasUpdate: boolean;
      version: string;
    };
    // TODO: I think this is only for configurable types
    template: Record<Document.Type, DocumentTemplate> | null;
    // TODO: This is also inheriting the configured types,
    // but is only filled in if there's `template.json`
    model: Model;
    userId: string;
    world: foundry.packages.World["_source"];
  } & {
    [DocumentType in  // eslint-disable-next-line @typescript-eslint/no-deprecated
      | foundry.CONST.DOCUMENT_TYPES
      | "Setting" as Document.ImplementationClassFor<DocumentType>["metadata"]["collection"]]?: FixedInstanceType<
      Document.ImplementationClassFor<DocumentType>
    >["_source"][];
  };

  interface Data extends _Data {}

  namespace Data {
    interface Pack extends BasePackage.SocketCompendiumData {
      /**
       * @remarks Not all packs are required to specify a `system`, and those that don't will not have this key in their data,
       * presumably because the socket eats the `undefined`-valued property.
       *
       * Of packs with a `system`, only ones where it matches the current world's are sent to clients.
       */
      system?: foundry.packages.System.Id;

      packageName: BasePackage["_source"]["id"];
      packageType: BasePackage["type"];

      /** @remarks In the format `${package.id}.${pack.name}` */
      id: string;

      /**
       * @privateRemarks For some reason {@linkcode BasePackage.Schema.path} is `required: false`, so the `UndefinedToOptional` on
       * {@linkcode BasePackage.SocketCompendiumData} makes it optional here, but a `path` will always be in the metadata sent by
       * the server.
       */
      path: string;

      /**
       * @remarks This property is deleted right before `setup` is called, most likely inadvertently.
       * This is ultimately because `CompendiumCollection` is passed a reference to an object in
       * `game.data.packs` and calls `delete metadata.index` and `delete metadata.folders`.
       *
       * Specifically `Game#setupGame` calls `Game#setupPacks` and initializes `CompendiumCollection`
       * with `new CompendiumCollection(metadata)` where `metadata` is defined from
       * `for ( const metadata of this.data.packs ) {`.
       */
      // TODO(LukeAbby): Technically should be updated with compendium index types.
      // It's probably not worth it because it is deleted after setup.
      index?: { _id: string; uuid: string } & Record<string, unknown>;

      /**
       * @remarks This property is deleted after `setup`, most likely inadvertently.
       * This is ultimately because `CompendiumCollection` is passed a reference to an object in
       * `game.data.packs` and calls `delete metadata.index` and `delete metadata.folders`.
       *
       * Specifically `Game#setupGame` calls `Game#setupPacks` and initializes `CompendiumCollection`
       * with `new CompendiumCollection(metadata)` where `metadata` is defined from
       * `for ( const metadata of this.data.packs ) {`.
       */
      // TODO(LukeAbby): Technically a bit underspecified; may be more specific, though unlikely.
      folders?: Folder.Source[];
    }
  }

  type Permissions = {
    [Key in keyof typeof foundry.CONST.USER_PERMISSIONS]: foundry.CONST.USER_ROLES[];
  };

  type View = ValueOf<typeof foundry.CONST.GAME_VIEWS>;

  interface TogglePauseOptions {
    /**
     * Broadcast the pause state change to other connected clients?
     * Broadcasting to other clients can only be done by a GM user.
     * @defaultValue `false`
     */
    broadcast?: boolean | undefined;

    /**
     * The ID of the user who triggered the pause operation. This is
     * populated automatically by the game server.
     */
    userId?: string | undefined;
  }
}

declare global {
  /**
   * @defaultValue `undefined`
   * Initialized just before the `"init"` hook event.
   */
  let canvas: InitializedOn<Canvas, "init">;
}

type ConfiguredCollectionClassForName<Name extends CONST.WORLD_DOCUMENT_TYPES> = FixedInstanceType<
  CONFIG[Name]["collection"]
>;

interface DocumentTemplate {
  htmlFields: string[];
  types: string[];
}

export default Game;
