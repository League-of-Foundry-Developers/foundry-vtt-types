/**
 * A simple event framework used throughout Foundry Virtual Tabletop.
 * When key actions or events occur, a "hook" is defined where user-defined callback functions can execute.
 * This class manages the registration and execution of hooked callback functions.
 */
declare class Hooks {
  /**
   * Register a callback handler which should be triggered when a hook is triggered.
   *
   * @param hook - The unique name of the hooked event
   * @param fn   - The callback function which should be triggered when the hook event occurs
   * @returns An ID number of the hooked function which can be used to turn off the hook later
   */
  static on<K extends keyof Hooks.StaticCallbacks>(hook: K, fn: Hooks.StaticCallbacks[K]): number;
  static on<H extends Hooks.DynamicCallbacks>(hook: string, fn: H): number;
  static on<H extends (...args: any) => any>(hook: string, fn: H): number;

  /**
   * Register a callback handler for an event which is only triggered once the first time the event occurs.
   * After a "once" hook is triggered the hook is automatically removed.
   *
   * @param hook - The unique name of the hooked event
   * @param fn   - The callback function which should be triggered when the hook event occurs
   * @returns An ID number of the hooked function which can be used to turn off the hook later
   */
  static once<K extends keyof Hooks.StaticCallbacks>(
    hook: K,
    fn: Hooks.StaticCallbacks[K]
  ): ReturnType<typeof Hooks['on']>;
  static once<H extends Hooks.DynamicCallbacks>(hook: string, fn: H): ReturnType<typeof Hooks['on']>;
  static once<H extends (...args: any) => any>(hook: string, fn: H): ReturnType<typeof Hooks['on']>;

  /**
   * Unregister a callback handler for a particular hook event
   *
   * @param hook - The unique name of the hooked event
   * @param fn   - The function, or ID number for the function, that should be turned off
   */
  static off<K extends keyof Hooks.StaticCallbacks>(hook: K, fn: number | Hooks.StaticCallbacks[K]): void;
  static off<H extends Hooks.DynamicCallbacks>(hook: string, fn: number | H): void;
  static off<H extends (...args: any) => any>(hook: string, fn: number | H): void;

  /**
   * Call all hook listeners in the order in which they were registered
   * Hooks called this way can not be handled by returning false and will always trigger every hook callback.
   *
   * @param hook - The hook being triggered
   * @param args - Arguments passed to the hook callback functions
   */
  static callAll<K extends keyof Hooks.StaticCallbacks>(
    hook: K,
    ...args: Parameters<Hooks.StaticCallbacks[K]>
  ): true | undefined;
  static callAll<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): true | undefined;
  static callAll<H extends (...args: any) => any>(hook: string, ...args: Parameters<H>): true | undefined;

  /**
   * Call hook listeners in the order in which they were registered.
   * Continue calling hooks until either all have been called or one returns `false`.
   *
   * Hook listeners which return `false` denote that the original event has been adequately handled and no further
   * hooks should be called.
   *
   * @param hook - The hook being triggered
   * @param args - Arguments passed to the hook callback functions
   */
  static call<K extends keyof Hooks.StaticCallbacks>(
    hook: K,
    ...args: Parameters<Hooks.StaticCallbacks[K]>
  ): boolean | undefined;
  static call<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): boolean | undefined;
  static call<H extends (...args: any) => any>(hook: string, ...args: Parameters<H>): boolean | undefined;

  /**
   * Call a hooked function using provided arguments and perhaps unregister it.
   */
  protected static _call<K extends keyof Hooks.StaticCallbacks>(
    hook: K,
    fn: Hooks.StaticCallbacks[K],
    ...args: Parameters<Hooks.StaticCallbacks[K]>
  ): ReturnType<Hooks.StaticCallbacks[K]> | undefined;
  protected static _call<H extends Hooks.DynamicCallbacks>(
    hook: string,
    fn: H,
    ...args: Parameters<H>
  ): ReturnType<H> | undefined;
  protected static _call<H extends (...args: any) => any>(
    hook: string,
    fn: H,
    ...args: Parameters<H>
  ): ReturnType<H> | undefined;

  /**
   * @defaultValue `{}`
   */
  protected static _hooks: Record<string, (...args: any) => any>;

  /**
   * @defaultValue `[]`
   */
  protected static _once: Array<(...args: any) => any>;

  /**
   * @defaultValue `{}`
   */
  protected static _ids: Record<number, Array<(...args: any) => any>>;

  /**
   * @defaultValue `1`
   */
  protected static _id: number;
}

/**
 * This namespace contains typescript specific type definitions for the {@link Hooks} callback functions. It contains an
 * interface ({@link Hooks.StaticCallbacks}) for callbacks with static names. There are more function types in the
 * namespace for the dynamic hooks, whose names are generated at runtime. There is also a union of all of the dynamic
 * hooks ({@link Hooks.DynamicCallbacks}).
 *
 * Callback types remarked to be called with {@link Hooks.callAll} do not care about the return value of the callback.
 * Callback types remarked to be called with {@link Hooks.call} do care about the return value and will stop executing
 * remaining callbacks if `false` is returned. If a callback type does not have such a remark, pay attention to the
 * return value documentation.
 *
 * @example Using a callback type with a static name
 * ```typescript
 * Hooks.on('updateWorldTime', (worldTime, dt) => {
 *   // [...]
 * })
 * ```
 *
 * @example Using a callback with a dynamic name
 * ```typescript
 * Hooks.on<Hooks.GetCompendiumDirectoryEntryContext>('getJournalEntryContext', (jq, entryOptions) => {
 *   // [...]
 * })
 * ```
 *
 * @example Using a callback with a dynamic name and generic parameter
 * ```typescript
 * Hooks.on<Hooks.CloseApplication<FormApplication>>('closeFormApplication', (app, jq) => {
 *   // [...]
 * })
 * ```
 */
declare namespace Hooks {
  interface StaticCallbacks {
    /**
     * Inside Hooks.Callbacks
     * @param actor  - the Actor to whom this effect should be applied
     * @param change - the change data being applied
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link ActiveEffect#_applyCustom}
     */
    applyActiveEffect: (actor: Actor, change: ActiveEffect.Change) => unknown;

    /**
     * This is called before a {@link Canvas} is drawn.
     * @param canvas - the Canvas
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Canvas#draw}
     */
    canvasInit: (canvas: Canvas) => unknown;

    /**
     * This is called when a {@link Canvas} is panned. When called during animated panning, the callback is called on
     * every tick.
     * @param canvas - the Canvas
     * @param view   - the CanvasView
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Canvas#pan}
     * @see {@link Canvas#animatePan}
     */
    canvasPan: (canvas: Canvas, view: Canvas.View) => unknown;

    /**
     * This is called after a {@link Canvas} is done initializing.
     * @param canvas - the Canvas
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Canvas#draw}
     */
    canvasReady: (canvas: Canvas) => unknown;

    /**
     * This is called when creating a {@link ChatBubble}, but before displaying it.
     * @param token   - the speaking token
     * @param jq      - the JQuery for the chat bubble
     * @param message - the spoken message text
     * @param options - additional options
     * @param emote   - whether to style the speech bubble as an emote
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link ChatBubbles#say}
     */
    chatBubble: (
      token: Token,
      jq: JQuery,
      message: string,
      options: {
        emote: boolean;
      }
    ) => unknown;

    /**
     * This is called first when processing a chat message.
     * @param chatLog  - the ChatLog
     * @param message  - the original string of the message content
     * @param chatData - the ChatData
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link ChatLog#processMessage}
     */
    chatMessage: (chatLog: ChatLog, message: string, chatData: ChatMessage.ChatData) => unknown;

    /**
     * This is called after the {@link SceneNavigation} is expanded or collapsed.
     * @param nav       - the SceneNavigation
     * @param collapsed - whether the navigation is collapsed
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link SceneNavigation#expand}
     * @see {@link SceneNavigation#collapse}
     */
    collapseSceneNavigation: (nav: SceneNavigation, collapsed: boolean) => unknown;

    /**
     * This is called during the drop portion of a drag-and-drop event on an actor sheet.
     * @param actor - the Actor the sheet belongs to
     * @param sheet - the ActorSheet, the data was dropped on
     * @param data  - the dropped data, already parsed as an object via JSON
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link ActorSheet#_onDrop}
     */
    dropActorSheetData: (actor: Actor, sheet: ActorSheet, data: ActorSheet.DropData.Combined) => unknown;

    /**
     * This is called during the drop portion of a drag-and-drop event on a canvas.
     * @param canvas - the Canvas the data has been dropped on
     * @param data   - the dropped data, already parsed as an object via JSON
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link Canvas#_onDrop}
     */
    dropCanvasData: (
      canvas: Canvas,
      data: TokenLayer.DropData | NotesLayer.DropData | User.DropData | TilesLayer.DropData
    ) => unknown;

    /**
     * This is called during the drop portion of a drag-and-drop event on a roll table.
     * @param document - the Entity the table belongs to
     * @param config - the RollTableConfig
     * @param data   - the dropped data, already parsed as an object via JSON
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link RollTableConfig#_onDrop}
     */
    dropRollTableSheetData: (document: Entity, config: RollTableConfig, data: object) => unknown;

    /**
     * This is called after the initial {@link SceneControls} have been set up.
     * @param controls - the created controls
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link SceneControls#_getControlButtons}
     */
    getSceneControlButtons: (controls: SceneControl[]) => unknown;

    /**
     * This is called after getting the {@link ContextMenu} options for the {@link SceneNavigation}, but before creating
     * the ContextMenu.
     * @param jq             - the JQuery of the ContextMenu parent element
     * @param contextOptions - the already created ContextMenu.Items
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link SceneNavigation#activateListeners}
     */
    getSceneNavigationContext: (jq: JQuery, contextOptions: ContextMenu.Item[]) => unknown;

    /**
     * This is called after getting the {@link ContextMenu} options for a {@link PlayerList} user, but before creating
     * the ContextMenu.
     * @param jq             - the JQuery of the ContextMenu parent element
     * @param contextOptions - the already created ContextMenu.Items
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link PlayerList#activateListeners}
     */
    getUserContextOptions: (jq: JQuery, contextOptions: ContextMenu.Item[]) => unknown;

    /**
     * A hook event that fires whenever data is dropped into a Hotbar slot.
     * The hook provides a reference to the Hotbar application, the dropped data, and the target slot.
     * Default handling of the drop event can be prevented by returning false within the hooked function.
     *
     * @param hotbar -       The Hotbar application instance
     * @param data -         The dropped data object
     * @param slot -         The target hotbar slot
     */
    hotbarDrop: (hotbar: Hotbar, data: Hotbar.DropData, slot: string) => unknown;

    /**
     * This is called before the {@link Game} is initialized for the current window location.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Game#initialize}
     */
    init: () => unknown;

    /**
     * This is called when initializing shaders for a {@link PointSource}.
     * @param pointSource   - the PointSource to initialize shaders for
     * @param animationType - a key used in `CONFIG.Canvas.lightAnimations`
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link PointSource#_initializeShaders}
     */
    initializePointSourceShaders: (pointSource: PointSource, animationType: string) => unknown;

    /**
     * This is called after refreshing the {@link LightingLayer}.
     * @param layer - the LightingLayer
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link LightingLayer#refresh}
     */
    lightingRefresh: (lighting: LightingLayer) => unknown;

    /**
     * This is called when the values of a {@link Token} are updated and before updating the values of the associated
     * {@link Actor}.
     * @param updateInfo - the raw update information
     * @param attribute  - the attribute path
     * @param isBar      - whether the new value is part of an attribute bar, or just a direct value
     * @param isDelta    - whether the number represents a relative change (true) or an absolute change (false)
     * @param value      - the target attribute value
     * @param update     - the same object data, that will be passed to {@link Actor#update}
     * @returns whether the Actor should be updated
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link Actor#modifyTokenAttribute}
     * @see {@link Actor#update}
     */
    modifyTokenAttribute: (
      updateInfo: {
        attribute: string;
        isBar: boolean;
        isDelta: boolean;
        value: number;
      },
      updates: Record<string, number>
    ) => boolean;

    /**
     * This is called after the {@link Game} pause is toggled
     * @param paused - the new paused value of the Game
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Game#togglePause}
     */
    pauseGame: (paused: boolean) => unknown;

    /**
     * This is called after the {@link Game} is fully set up.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Game#setupGame}
     */
    ready: () => unknown;

    /**
     * This is called as last step when rendering a {@link ChatMessage}.
     * @param message     - the ChatMessage
     * @param jq          - the JQuery of the rendered ChatMessage
     * @param messageData - the data of the message
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link ChatMessage#render}
     */
    renderChatMessage: (message: ChatMessage, jq: JQuery, messageData: ChatMessage.MessageData) => unknown;

    /**
     * This is called after {@link AVSettings} are changed.
     * @param settings - the AVSettings
     * @param changed  - an object reflecting the changed settings
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link AVSettings#_onSettingsChanged}
     */
    rtcSettingsChanged: (settings: DeepPartial<AVSettings.Settings>, changed: object) => unknown;

    /**
     * This is called before the {@link Game} is fully set up.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Game#setupGame}
     */
    setup: () => unknown;

    /**
     * This is called when expanding or collapsing a {@link Sidebar}.
     * @param sidebar   - the Sidebar
     * @param collapsed - whether the Sidebar is collapsed
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Sidebar#expand}
     * @see {@link Sidebar#collapse}
     */
    collapseSidebar: (sidebar: Sidebar, collapsed: boolean) => unknown;

    /**
     * This is called after refreshing the {@link SightLayer}.
     * @param layer - the SightLayer
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link SightLayer#restrictVisibility}
     */
    sightRefresh: (layer: SightLayer) => unknown;

    /**
     * This is called after the targeted state for a {@link Token} changed.
     * @param user     - the User that caused the targeted state change
     * @param token    - the Token for which the targeted state changed
     * @param targeted - whether the Token is targeted
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link UserTargets#_hook}
     */
    targetToken: (user: User, token: Token, targeted: boolean) => unknown;

    /**
     * This is called when the official world time changes.
     * @param worldTime - the new world time
     * @param dt        - the time advance delta, in seconds
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link GameTime#onUpdateWorldTime}
     */
    updateWorldTime: (worldTime: number, dt: number) => unknown;
  }

  /**
   * A hook event that fires whenever this Application is closed.
   *
   * @param app -                    The Application instance being closed
   * @param html -                      The application HTML when it is closed
   */
  type CloseApplication<A extends Application = Application> = (app: A, jq: JQuery) => unknown;

  /**
   * This is called after assuming or releasing control over a {@link PlaceableObject}.
   * @param object     - the PlaceableObject
   * @param controlled - whether the PlaceableObject is controlled
   * @typeParam P      - the type of the PlaceableObject
   * @remarks The name for this hook is dynamically created by joining 'control' and the type name of the
   * PlaceableObject.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link PlaceableObject#control}
   * @see {@link PlaceableObject#release}
   */
  type ControlPlaceableObject<P extends PlaceableObject = PlaceableObject> = (
    object: P,
    controlled: boolean
  ) => unknown;

  /**
   * A hook event that fires for every embedded Document type after conclusion of a creation workflow.
   * Substitute the Document name in the hook event to target a specific type, for example "createToken".
   * This hook fires for all connected clients after the creation has been processed.
   *
   * @param document -    The new Document instance which has been created
   * @param options -       Additional options which modified the creation request
   * @param userId -        The ID of the User who triggered the creation workflow
   */
  type CreateDocument<D extends Entity = Entity> = (
    document: D,
    options: Entity.CreateOptions,
    userId: number
  ) => unknown;

  /**
   * A hook event that fires for every Document type after conclusion of an deletion workflow.
   * Substitute the Document name in the hook event to target a specific Document type, for example "deleteActor".
   * This hook fires for all connected clients after the deletion has been processed.
   *
   * @param document -     The existing Document which was deleted
   * @param options -        Additional options which modified the deletion request
   * @param userId -         The ID of the User who triggered the deletion workflow
   */
  type DeleteDocument<D extends Entity = Entity> = (
    document: D,
    options: Entity.DeleteOptions,
    userId: number
  ) => unknown;

  /**
   * This is called when creating {@link Application.HeaderButton}s for an {@link Application}. This is called once for
   * each Application class in the inheritance chain.
   * @param app     - the Application
   * @param buttons - the Array of HeaderButtons
   * @typeParam A   - the type of the Application
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the Application and
   * 'HeaderButtons'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link Application#_getHeaderButtons}
   */
  type GetApplicationHeaderButtons<A extends Application = Application> = (
    app: A,
    buttons: Application.HeaderButton[]
  ) => unknown;

  /**
   * This is called after getting the {@link ContextMenu} options for a {@link ChatLog}, but before creating the
   * ContextMenu.
   * @param jq           - the JQuery of the ContextMenu parent element
   * @param entryOptions - the already created ContextMenuOptions
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the ChatLog and
   * 'EntryContext'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link ChatLog#_contextMenu}
   */
  type GetChatLogEntryContext = (jq: JQuery, entryOptions: ContextMenu.Item[]) => unknown;

  /**
   * This is called after getting the {@link ContextMenu} options for a {@link CombatTracker} entry, but before creating
   * the ContextMenu.
   * @param jq           - the JQuery of the ContextMenu parent element
   * @param entryOptions - the already created ContextMenuOptions
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the CombatTracker and
   * 'EntryContext'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link CombatTracker#_contextMenu}
   */
  type GetCombatTrackerEntryContext = (jq: JQuery, entryOptions: ContextMenu.Item[]) => unknown;

  /**
   * This is called after getting the {@link ContextMenu} options for a {@link CompendiumDirectory} entry, but before
   * creating the ContextMenu.
   * @param jq           - the JQuery of the ContextMenu parent element
   * @param entryOptions - the already created ContextMenuOptions
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the
   * CompendiumDirectory and 'EntryContext'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link CompendiumDirectory#_contextMenu}
   */
  type GetCompendiumDirectoryEntryContext = (jq: JQuery, entryOptions: ContextMenu.Item[]) => unknown;

  /**
   * This is called after getting the {@link ContextMenu} options for a {@link PlaylistDirectory} sound, but before
   * creating the ContextMenu.
   * @param jq           - the JQuery of the ContextMenu parent element
   * @param entryOptions - the already created ContextMenuOptions
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the PlaylistDirectory
   * and 'SoundContext'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link PlaylistDirectory#_contextMenu}
   */
  type GetPlaylistDirectorySoundContext = (jq: JQuery, entryOptions: ContextMenu.Item[]) => unknown;

  /**
   * This is called after getting the {@link ContextMenu} options for a {@link SidebarDirectory} entry, but before
   * creating the ContextMenu.
   * @param jq           - the JQuery of the ContextMenu parent element
   * @param entryOptions - the already created ContextMenuOptions
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the SidebarDirectory
   * and 'EntryContext'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link SidebarDirectory#_contextMenu}
   */
  type GetSidebarDirectoryEntryContext = (jq: JQuery, entryOptions: ContextMenu.Item[]) => unknown;

  /**
   * This is called after getting the {@link ContextMenu} options for a {@link SidebarDirectory} folder, but before
   * creating the ContextMenu.
   * @param jq            - the JQuery of the ContextMenu parent element
   * @param folderOptions - the already created ContextMenuOptions
   * @remarks The name for this hook is dynamically created by joining 'get' with the type name of the SidebarDirectory
   * and 'FolderContext'.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link SidebarDirectory#_contextMenu}
   */
  type GetSidebarDirectoryFolderContext = (jq: JQuery, folderOptions: ContextMenu.Item[]) => unknown;

  /**
   * A hook event that fires when the user modifies a global volume slider.
   * The hook name needs to be customized to include the type of global volume being changed, one of:
   * `globalPlaylistVolumeChanged`, `globalAmbientVolumeChanged`, or `globalInterfaceVolumeChanged`.
   *
   * @param volume -    The new volume level
   */
  type GlobalVolumeChanged = (volume: number) => unknown;

  /**
   * This is called when the user mouse is entering or leaving a hover state over a {@link PlaceableObject}.
   * @param object - the PlaceableObject
   * @param hover  - whether the mouse is hovering over the PlaceableObject
   * @typeParam P  - the type of the PlaceableObject
   * @remarks The name for this hook is dynamically created by joining 'hover' and the type name of the PlaceableObject.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link PlaceableObject#_onHoverIn}
   * @see {@link PlaceableObject#_onHoverOut}
   */
  type HoverPlaceableObject<P extends PlaceableObject = PlaceableObject> = (object: P, hover: boolean) => unknown;

  /**
   * This is called after copying {@link PlaceableObject}s in a copy-paste action, but before embedding them into the
   * {@link PlaceablesLayer}.
   * @param copied - the originally copied PlaceableObjects
   * @param pasted - the pasted copies with new coordinates
   * @param P      - the type of the PlaceableObject
   * @remarks The name for this hook is dynamically created by joining 'paste' with the type name of the
   * PlaceableObject.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link PlaceablesLayer#pasteObjects}
   */
  type PastePlaceableObject<P extends PlaceableObject = PlaceableObject> = (copied: P[], pasted: P[]) => unknown;

  /**
   * This is called after copying {@link Wall}s in a copy-paste action, but before embedding them into the {@link
   * WallsLayer}.
   * @param copied - the originally copied Walls
   * @param pasted - the pasted copies with new coordiantes
   * @param W      - the type of the Wall
   * @remarks The name for this hook is dynamically created by joining 'paste' with the type name of the Wall.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link WallsLayer#pasteObjects}
   */
  type PasteWall<W extends Wall = Wall> = (copied: W[], pasted: W[]) => unknown;

  /**
   * A hook event that fires for every Document type before execution of a creation workflow. Substitute the
   * Document name in the hook event to target a specific Document type, for example "preCreateActor". This hook
   * only fires for the client who is initiating the creation request.
   *
   * The hook provides the pending document instance which will be used for the Document creation. Hooked functions
   * may modify that data or prevent the workflow entirely by explicitly returning false.
   *
   * @param document -    The pending document which is requested for creation
   * @param data -          The data object which will be used for document creation
   * @param options -       Additional options which modify the creation request
   * @param userId -        The ID of the requesting user, always game.user.id
   * @returns         Explicitly return false to prevent creation of this Document
   */
  type PreCreateDocument<D extends Entity = Entity> = (
    document: D,
    data: D['_data'],
    options: Entity.CreateOptions,
    userId: number
  ) => boolean;

  /**
   * A hook event that fires for every Document type before execution of a deletion workflow. Substitute the
   * Document name in the hook event to target a specific Document type, for example "preDeleteActor". This hook
   * only fires for the client who is initiating the update request.
   *
   * The hook provides the Document instance which is requested for deletion. Hooked functions may prevent the
   * workflow entirely by explicitly returning false.
   *
   * @param document -     The Document instance being deleted
   * @param options -        Additional options which modify the deletion request
   * @param userId -         The ID of the requesting user, always game.user.id
   * @returns         Explicitly return false to prevent deletion of this Document
   */
  type PreDeleteDocument<D extends Entity = Entity> = (
    document: D,
    options: Entity.DeleteOptions,
    userId: number
  ) => boolean;

  /**
   * A hook event that fires for every Document type before execution of an update workflow. Substitute the Document
   * name in the hook event to target a specific Document type, for example "preUpdateActor". This hook only fires
   * for the client who is initiating the update request.
   *
   * The hook provides the differential data which will be used to update the Document. Hooked functions may modify
   * that data or prevent the workflow entirely by explicitly returning false.
   *
   * @param document -   The Document instance being updated
   * @param change -       Differential data that will be used to update the document
   * @param options -      Additional options which modify the update request
   * @param userId -       The ID of the requesting user, always game.user.id
   * @returns         Explicitly return false to prevent update of this Document
   */
  type PreUpdateDocument<D extends Entity = Entity> = (
    document: D,
    data: DeepPartial<D['_data']>,
    options: Entity.UpdateOptions,
    userId: number
  ) => boolean;

  /**
   * This is called as last step when rendering an {@link Application}. This is called once for each Application class
   * in the inheritance chain.
   * @param app   - the rendered Application
   * @param jq    - the JQuery of the inner HTML of the app
   * @param data  - the data to render with the application
   * @typeParam D - the type of the Application data
   * @typeParam A - the type of the Application
   * @remarks The name for this hook is dynamically created by joining 'render' with the type name of the Application.
   * @remarks This is called by {@link Hooks.callAll}.
   * @see {@link Application#_render}
   */
  type RenderApplication<D = object, A extends Application = Application> = (app: A, jq: JQuery, data: D) => unknown;

  /**
   * A hook event that fires for every Document type after conclusion of an update workflow.
   * Substitute the Document name in the hook event to target a specific Document type, for example "updateActor".
   * This hook fires for all connected clients after the update has been processed.
   *
   * @param document -    The existing Document which was updated
   * @param change -        Differential data that was used used to update the document
   * @param options -       Additional options which modified the update request
   * @param userId -        The ID of the User who triggered the update workflow
   */
  type UpdateDocument<D extends Entity = Entity> = (
    document: D,
    change: DeepPartial<D['_data']>,
    options: Entity.UpdateOptions,
    userId: number
  ) => unknown;

  type DynamicCallbacks =
    | CloseApplication
    | ControlPlaceableObject
    | CreateDocument
    | DeleteDocument
    | GetApplicationHeaderButtons
    | GetChatLogEntryContext
    | GetCombatTrackerEntryContext
    | GetCompendiumDirectoryEntryContext
    | GetPlaylistDirectorySoundContext
    | GetSidebarDirectoryEntryContext
    | GetSidebarDirectoryFolderContext
    | GlobalVolumeChanged
    | HoverPlaceableObject
    | PastePlaceableObject
    | PasteWall
    | PreCreateDocument
    | PreDeleteDocument
    | PreUpdateDocument
    | RenderApplication
    | UpdateDocument;
}
