import type { EditorState, Plugin } from "prosemirror-state";
import {
  ConfiguredDocumentClass,
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName,
  DocumentConstructor,
  ToObjectFalseType
} from "../../../types/helperTypes";
import { DocumentModificationOptions } from "../../common/abstract/document.mjs";
import { EffectChangeData } from "../../common/data/data.mjs/effectChangeData";
import { DropData } from "../data/abstract/client-document";

declare global {
  /**
   * A simple event framework used throughout Foundry Virtual Tabletop.
   * When key actions or events occur, a "hook" is defined where user-defined callback functions can execute.
   * This class manages the registration and execution of hooked callback functions.
   */
  class Hooks {
    /**
     * A mapping of hook events which have functions registered to them.
     */
    static get events(): Hooks.HookedFunction[];

    /**
     * Register a callback handler which should be triggered when a hook is triggered.
     *
     * @param hook    - The unique name of the hooked event
     * @param fn      - The callback function which should be triggered when the hook event occurs
     * @param options - Options which customize hook registration
     * @returns An ID number of the hooked function which can be used to turn off the hook later
     */
    static on<K extends keyof Hooks.StaticCallbacks>(
      hook: K,
      fn: Hooks.StaticCallbacks[K],
      options?: Hooks.OnOptions
    ): number;
    static on<H extends Hooks.DynamicCallbacks>(hook: string, fn: H, options?: Hooks.OnOptions): number;
    static on<H extends (...args: any) => any>(hook: string, fn: H, options?: Hooks.OnOptions): number;

    /**
     * Register a callback handler for an event which is only triggered once the first time the event occurs.
     * An alias for Hooks.on with `{once: true}`
     * @param hook - The unique name of the hooked event
     * @param fn   - The callback function which should be triggered when the hook event occurs
     * @returns An ID number of the hooked function which can be used to turn off the hook later
     */
    static once<K extends keyof Hooks.StaticCallbacks>(
      hook: K,
      fn: Hooks.StaticCallbacks[K]
    ): ReturnType<typeof Hooks["on"]>;
    static once<H extends Hooks.DynamicCallbacks>(hook: string, fn: H): ReturnType<typeof Hooks["on"]>;
    static once<H extends (...args: any) => any>(hook: string, fn: H): ReturnType<typeof Hooks["on"]>;

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
    static callAll<K extends keyof Hooks.StaticCallbacks>(hook: K, ...args: Parameters<Hooks.StaticCallbacks[K]>): true;
    static callAll<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): true;
    static callAll<H extends (...args: any) => any>(hook: string, ...args: Parameters<H>): true;

    /**
     * Call hook listeners in the order in which they were registered.
     * Continue calling hooks until either all have been called or one returns false.
     *
     * Hook listeners which return false denote that the original event has been adequately handled and no further
     * hooks should be called.
     *
     * @param hook - The hook being triggered
     * @param args - Arguments passed to the hook callback functions
     */
    static call<K extends keyof Hooks.StaticCallbacks>(hook: K, ...args: Parameters<Hooks.StaticCallbacks[K]>): boolean;
    static call<H extends Hooks.DynamicCallbacks>(hook: string, ...args: Parameters<H>): boolean;
    static call<H extends (...args: any) => any>(hook: string, ...args: Parameters<H>): boolean;

    /**
     * Notify subscribers that an error has occurred within foundry.
     * @param location - The method where the error was caught.
     * @param error    - The error.
     * @param options  - Additional options to configure behaviour.
     */
    static onError(
      location: string,
      error: Error,
      {
        msg,
        notify,
        log,
        ...data
      }?: {
        /**
         * Additional data to pass to the hook subscribers.
         * @defaultValue `{}`
         */
        [key: string]: unknown;

        /**
         * A message which should prefix the resulting error or notification.
         * @defaultValue `""`
         */
        msg?: string | undefined;

        /**
         * The level at which to log the error to console (if at all).
         * @defaultValue `null`
         */
        notify?: keyof NonNullable<typeof ui["notifications"]> | null | undefined;

        /**
         * The level at which to spawn a notification in the UI (if at all).
         * @defaultValue `null`
         */
        log?: keyof typeof console | null | undefined;
      }
    ): void;
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
   * Hooks.on("updateWorldTime", (worldTime, dt) => {
   *   worldTime; // number
   *   dt; // number
   *   // [...]
   * })
   * ```
   *
   * @example Using a callback with a dynamic name and generic parameter
   * ```typescript
   * Hooks.on<Hooks.CloseApplication<FormApplication>>("closeFormApplication", (app, jq) => {
   *   app; // FormApplication
   *   jq; // JQuery
   *   // [...]
   * })
   * ```
   *
   * @example Using the `error` callback type
   * ```typescript
   * Hooks.on("error", (...args) => {
   *   if (args[0] === "Canvas#draw")
   *     args[2].layer // CanvasLayer
   *   // [...]
   * })
   * ```
   */
  namespace Hooks {
    interface HookedFunction {
      hook: string;
      id: number;
      fn: Function;
      once: boolean;
    }

    interface OnOptions {
      /** Only trigger the hooked function once */
      once?: boolean;
    }

    interface StaticCallbacks {
      /**
       * A hook event that fires when a custom active effect is applied.
       * @param actor  - The actor the active effect is being applied to
       * @param change - The change data being applied
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link ActiveEffect#_applyCustom}
       */
      applyActiveEffect: (
        actor: InstanceType<ConfiguredDocumentClass<typeof Actor>>,
        change: EffectChangeData
      ) => boolean | void;

      /**
       * A hook event that fires immediately prior to PIXI Application construction with the configuration parameters.
       * @param canvasConfig - Canvas configuration parameters that will be used
       * @remarks This is called by {@link Hooks.callAll}.
       */
      canvasConfig: (canvasConfig: ConstructorParameters<typeof PIXI.Application>[0]) => void;

      /**
       * A hook event that fires when the Canvas is initialized.
       * @param canvas - the Canvas
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Canvas#draw}
       */
      canvasInit: (canvas: Canvas) => void;

      /**
       * A hook event that fires when the Canvas is panned.
       * @param canvas - The canvas
       * @param view   - The applied translate/transform
       * @remarks When called during animated panning, the callback is called on every tick.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Canvas#pan}
       * @see {@link Canvas#animatePan}
       */
      canvasPan: (canvas: Canvas, view: CanvasViewPosition) => void;

      /**
       * A hook event that fires when the Canvas is ready.
       * @param canvas - the canvas
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link Canvas#draw}
       */
      canvasReady: (canvas: Canvas) => boolean | void;

      /**
       * A hook event that fires when the Sidebar tab is changed.
       * @param app - The SidebarTab application which is now active
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Sidebar#_onChangeTab}
       */
      changeSidebarTab: (app: SidebarTab) => void;

      /**
       * A hook event that fires when a chat bubble is rendered.
       * @param token   - The speaking token
       * @param html    - The HTML for the chat bubble
       * @param message - The spoken message text
       * @param options - additional options
       * @remarks This is called when creating a {@link ChatBubble}, but before displaying it.
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the chat bubble being shown.
       * @see {@link ChatBubbles#say}
       */
      chatBubble: (
        token: Token,
        html: JQuery,
        message: string,
        options: {
          /** Whether to style the speech bubble as an emote */
          emote: boolean;
        }
      ) => boolean | void;

      /**
       * A hook event that fires when a user sends a message through the ChatLog.
       * @param chatLog  - The ChatLog instance
       * @param message  - The trimmed message content
       * @param chatData - The basic chat data
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the chat message from being created.
       * @see {@link ChatLog#processMessage}
       */
      chatMessage: (
        chatLog: ChatLog,
        message: string,
        chatData: {
          /** The User sending the message */
          user: string;

          /** The identified speaker data, see {@link ChatMessage.getSpeaker} */
          speaker: ReturnType<ConfiguredDocumentClass<typeof ChatMessage>["getSpeaker"]>;
        }
      ) => boolean | void;

      /**
       * A hook event that fires when the SceneNavigation menu is expanded or collapsed.
       * @param nav       - The SceneNavigation application
       * @param collapsed - Whether the navigation is now collapsed or not
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link SceneNavigation#expand}
       * @see {@link SceneNavigation#collapse}
       */
      collapseSceneNavigation: (nav: SceneNavigation, collapsed: boolean) => void;

      /**
       * A hook event that fires when the Sidebar is collapsed or expanded.
       * @param sidebar   - The Sidebar application
       * @param collapsed - Whether the Sidebar is now collapsed or not
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Sidebar#expand}
       * @see {@link Sidebar#collapse}
       */
      collapseSidebar: (sidebar: Sidebar, collapsed: boolean) => void;

      /**
       * A hook event that fires whenever a ProseMirror editor is created.
       * The hook provides the ProseMirror instance UUID, a list of plugins, and an object containing the provisional
       * editor state, and a reference to the menu plugin.
       * Hooked functions may append their own plugins or replace the state or menu plugin by replacing their references
       * in the final argument.
       *
       * @param uuid    - A UUID that uniquely identifies this ProseMirror instance.
       * @param plugins - A list of plugins that will be loaded.
       * @param options - The provisional EditorState and ProseMirrorMenuPlugin.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link ProseMirrorEditor.create}
       */
      createProseMirrorEditor: (uuid: string, plugins: Record<string, Plugin>, options: { state: EditorState }) => void;

      /**
       * A hook event that fires when Cards are dealt from a deck to other hands
       * @param origin             - The origin Cards document
       * @param destinations       - An array of destination Cards documents
       * @param context            - Additional context which describes the operation
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the operation.
       */
      dealCards: (
        origin: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
        destinations: InstanceType<ConfiguredDocumentClassForName<"Cards">>[],
        context: Cards.DealContext
      ) => boolean | void;

      /**
       * A hook event that fires when some useful data is dropped onto an ActorSheet.
       * @param actor - The Actor
       * @param sheet - The ActorSheet application
       * @param data  - The data that has been dropped onto the sheet
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the Document being created.
       * @see {@link ActorSheet#_onDrop}
       */
      dropActorSheetData: (
        actor: InstanceType<ConfiguredDocumentClass<typeof Actor>>,
        sheet: ActorSheet,
        data: ActorSheet.DropData
      ) => boolean | void;

      /**
       * A hook event that fires when some useful data is dropped onto the Canvas.
       * @param canvas - The Canvas
       * @param data   - The data that has been dropped onto the Canvas
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the Document being created.
       * @see {@link Canvas#_onDrop}
       */
      dropCanvasData: (
        canvas: Canvas,
        data: TokenLayer.DropData | NotesLayer.DropData | MapLayer.DropData
      ) => boolean | void;

      /**
       * A hook event that fires when some useful data is dropped onto a RollTableConfig.
       * @param table  - The RollTable
       * @param config - The RollTableConfig application
       * @param data   - The data dropped onto the RollTableConfig
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the Document being created.
       * @see {@link RollTableConfig#_onDrop}
       */
      dropRollTableSheetData: (
        table: InstanceType<ConfiguredDocumentClass<typeof RollTable>>,
        config: RollTableConfig,
        data: object
      ) => boolean | void;

      /**
       * A hook event that fires whenever foundry experiences an error.
       *
       * @param location - The method where the error was caught.
       * @param err      - The error.
       * @param data     - Additional data that might be provided, based on the nature of the error.
       *                   (default: `{}`)
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Hooks.onError}
       */
      error: (...args: ValueOf<ErrorCallbackParameters>) => void;

      /**
       * A hook event that fires when the Scene controls are initialized.
       * @param controls - The SceneControl configurations
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link SceneControls#_getControlButtons}
       */
      getSceneControlButtons: (controls: SceneControl[]) => void;

      /**
       * A hook event that fires when the context menu for a SceneNavigation entry is constructed.
       * @param html         - The HTML element to which the context options are attached
       * @param entryOptions - The context menu entries
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link SceneNavigation#activateListeners}
       */
      getSceneNavigationContext: (html: JQuery, entryOptions: ContextMenuEntry[]) => boolean | void;

      /**
       * A hook event that fires when the context menu for a PlayersList entry is constructed.
       * @param html         - The HTML element to which the context options are attached
       * @param entryOptions - The context menu entries
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link PlayerList#activateListeners}
       */
      getUserContextOptions: (html: JQuery, entryOptions: ContextMenuEntry[]) => boolean | void;

      /**
       * A hook event that fires whenever data is dropped into a Hotbar slot.
       * The hook provides a reference to the Hotbar application, the dropped data, and the target slot.
       * Default handling of the drop event can be prevented by returning false within the hooked function.
       * @param hotbar - The Hotbar application instance
       * @param data   - The dropped data object
       * @param slot   - The target hotbar slot
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the Document being created.
       * @see {@link Hotbar#_onDrop}
       */
      hotbarDrop: (
        hotbar: Hotbar,
        data: DropData<InstanceType<ConfiguredDocumentClass<typeof Macro>>>,
        slot: number
      ) => boolean | void;

      /**
       * A hook event that fires once Localization translations have been loaded and are ready for use.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Localization#initialize}
       */
      i18nInit: () => void;

      /**
       * A hook event that fires as Foundry is initializing, right before any initialization tasks have begun.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#initialize}
       */
      init: () => void;

      /**
       * A hook event that fires after LightSource shaders have initialized.
       * @param source - The LightSource being initialized
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link LightSource#_initializeShaders}
       */
      initializeLightSourceShaders: (source: LightSource) => void;

      /**
       * A hook event that fires when the LightingLayer is refreshed.
       * @param layer - the LightingLayer
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link LightingLayer#refresh}
       */
      lightingRefresh: (layer: LightingLayer) => void;

      /**
       * A hook event that fires when a token's resource bar attribute has been modified.
       * @param data    - A object describing the modification
       * @param updates - The update delta that will be applied to the Token's actor
       * @returns whether the Actor should be updated
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link Actor#modifyTokenAttribute}
       * @see {@link Actor#update}
       */
      modifyTokenAttribute: (
        data: {
          /** The attribute path */
          attribute: string;

          /** The target attribute value */
          value: number;

          /** Whether the number represents a relative change (true) or an absolute change (false) */
          isDelta: boolean;

          /** Whether the new value is part of an attribute bar, or just a direct value */
          isBar: boolean;
        },
        updates: Record<string, number>
      ) => boolean;

      /**
       * A hook event that fires when Cards are passed from one stack to another
       * @param origin      - The origin Cards document
       * @param destination - The destination Cards document
       * @param context     - Additional context which describes the operation
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the operation.
       */
      passCards: (
        origin: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
        destination: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
        context: Cards.DealContext
      ) => boolean | void;

      /**
       * A hook event that fires when the game is paused or un-paused.
       * @param paused - Is the game now paused (true) or un-paused (false)
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#togglePause}
       */
      pauseGame: (paused: boolean) => void;

      /**
       * A hook event that fires when the game is fully ready.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#setupGame}
       */
      ready: () => void;

      /**
       * A hook event that fires for each ChatMessage which is rendered for addition to the ChatLog.
       * This hook allows for final customization of the message HTML before it is added to the log.
       * @param message - The ChatMessage document being rendered
       * @param html    - The pending HTML as a jQuery object
       * @param data    - The input data provided for template rendering
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link ChatMessage#render}
       */
      renderChatMessage: (
        message: ChatMessage,
        html: JQuery,
        data: {
          message: ToObjectFalseType<InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>>;
          user: Game["user"];
          author: InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>["user"];
          alias: InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>["alias"];
          cssClass: string;
          isWhisper: boolean;
          whisperTo: string;
          borderColor?: string;
        }
      ) => boolean | void;

      /**
       * A hook event that fires when a stack of Cards are returned to the decks they originally came from.
       * @param origin   - The origin Cards document.
       * @param returned - The cards being returned.
       * @param context  - Additional context which describes the operation.
       */
      returnCards: (
        origin: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
        returned: InstanceType<ConfiguredDocumentClassForName<"Card">>[],
        context: Cards.ReturnContext
      ) => boolean | void;

      /**
       * A hook event that fires when the AV settings are changed.
       * @param settings - The AVSettings manager
       * @param changed  - The delta of the settings that have been changed
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link AVSettings#_onSettingsChanged}
       */
      rtcSettingsChanged: (settings: AVSettings, changed: DeepPartial<AVSettings.Settings>) => void;

      /**
       * A hook event that fires when Foundry has finished initializing but
       * before the game state has been set up. Fires before any Documents, UI
       * applications, or the Canvas have been initialized.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#setupGame}
       */
      setup: () => void;

      /**
       * A hook event that fires when the SightLayer has been refreshed.
       * @param layer - The SightLayer
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link SightLayer#restrictVisibility}
       */
      sightRefresh: (layer: SightLayer) => void;

      /**
       * A hook event that fires when a token is targeted or un-targeted.
       * @param user     - The User doing the targeting
       * @param token    - The targeted Token
       * @param targeted - Whether the Token has been targeted or untargeted
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link UserTargets#_hook}
       */
      targetToken: (
        user: InstanceType<ConfiguredDocumentClass<typeof User>>,
        token: ConfiguredObjectClassForName<"Token">,
        targeted: boolean
      ) => void;

      /**
       * A hook event that fires whenever the contents of a Compendium pack were modified.
       * This hook fires for all connected clients after the update has been processed.
       *
       * @param pack      - The Compendium pack being modified
       * @param documents - The locally-cached Documents which were modified in the operation
       * @param options   - Additional options which modified the modification request
       * @param userId    - The ID of the User who triggered the modification workflow
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link CompendiumCollection#_onModifyContents}
       */
      updateCompendium: (
        pack: CompendiumCollection<any>,
        documents: foundry.abstract.Document<any, any>[],
        options: DocumentModificationOptions,
        userId: string
      ) => void;

      /**
       * A hook event that fires when the World time has been updated.
       * @param worldTime - The new canonical World time
       * @param delta     - The time delta
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link GameTime#onUpdateWorldTime}
       */
      updateWorldTime: (worldTime: number, delta: number) => void;
    }

    /**
     * A hook event that fires whenever this Application is closed.
     * @param app   - The Application instance being closed
     * @param html  - The application HTML when it is closed
     * @typeParam A - the type of the Application
     * @remarks The name for this hook is dynamically created by joining "close" with the type name of the Application.
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link Application#close}
     */
    type CloseApplication<A extends Application = Application> = (app: A, html: JQuery) => boolean | void;

    /**
     * A hook event that fires when any PlaceableObject is selected or
     * deselected. Substitute the PlaceableObject name in the hook event to
     * target a specific PlaceableObject type, for example "controlToken".
     * @param object     - The PlaceableObject
     * @param controlled - Whether the PlaceableObject is selected or not
     * @typeParam P      - the type of the PlaceableObject
     * @remarks The name for this hook is dynamically created by joining "control" and the type name of the
     * PlaceableObject.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link PlaceableObject#control}
     * @see {@link PlaceableObject#release}
     */
    type ControlPlaceableObject<P extends PlaceableObject = PlaceableObject> = (object: P, controlled: boolean) => void;

    /**
     * A hook event that fires for every embedded Document type after conclusion of a creation workflow.
     * Substitute the Document name in the hook event to target a specific type, for example "createToken".
     * This hook fires for all connected clients after the creation has been processed.
     *
     * @param document - The new Document instance which has been created
     * @param options  - Additional options which modified the creation request
     * @param userId   - The ID of the User who triggered the creation workflow
     * @typeParam D    - the type of the Document constructor
     * @remarks The name for this hook is dynamically created by joining "create" and the type name of the Document.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link ClientDatabaseBackend#_postCreateDocumentCallbacks}
     * @see {@link TokenDocument#_onUpdateTokenActor}
     */
    type CreateDocument<D extends DocumentConstructor = DocumentConstructor> = (
      document: InstanceType<ConfiguredDocumentClass<D>>,
      options: DocumentModificationOptions,
      userId: string
    ) => void;

    /**
     * A hook event that fires for every Document type after conclusion of an deletion workflow.
     * Substitute the Document name in the hook event to target a specific Document type, for example "deleteActor".
     * This hook fires for all connected clients after the deletion has been processed.
     *
     * @param document - The existing Document which was deleted
     * @param options  - Additional options which modified the deletion request
     * @param userId   - The ID of the User who triggered the deletion workflow
     * @typeParam D    - the type of the Document constructor
     * @remarks The name for this hook is dynamically created by joining "delete" with the type name of the Document.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link ClientDatabaseBackend#_postDeleteDocumentCallbacks}
     * @see {@link TokenDocument#_onUpdateTokenActor}
     */
    type DeleteDocument<D extends DocumentConstructor = DocumentConstructor> = (
      document: InstanceType<ConfiguredDocumentClass<D>>,
      options: DocumentModificationOptions,
      userId: string
    ) => void;

    /**
     * A hook event that fires whenever this Application is first rendered to add buttons to its header.
     * @param app     - The Application instance being rendered
     * @param buttons - The array of header buttons which will be displayed
     * @typeParam A   - the type of the Application
     * @remarks The name for this hook is dynamically created by joining "get" with the type name of the Application and
     * "HeaderButtons".
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link Application#_getHeaderButtons}
     */
    type GetApplicationHeaderButtons<A extends Application = Application> = (
      app: A,
      buttons: Application.HeaderButton[]
    ) => boolean | void;

    /**
     * A hook event that fires when the context menu for entries in an Application is constructed. Substitute the
     * Application name in the hook event to target a specific Application, for example
     * "getActorDirectoryEntryContext".
     * @param html         - The HTML element to which the context options are attached
     * @param entryOptions - The context menu entries
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link ContextMenu.create}
     */
    type GetEntryContext = (html: JQuery, entryOptions: ContextMenuEntry[]) => boolean | void;

    /**
     * A hook event that fires when the context menu for a Sound in the PlaylistDirectory is constructed.
     * @param html         - The HTML element to which the context options are attached
     * @param entryOptions - The context menu entries
     * @remarks The name for this hook is dynamically created by joining "get" with the type name of the PlaylistDirectory
     * and "SoundContext".
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link PlaylistDirectory#_contextMenu}
     */
    type GetPlaylistDirectorySoundContext = (html: JQuery, entryOptions: ContextMenuEntry[]) => boolean | void;

    /**
     * A hook event that fires when the context menu for folders in a SidebarTab
     * is constructed. Substitute the SidebarTab name in the hook event to target
     * a specific SidebarTab, for example "getActorDirectoryFolderContext".
     * @param html         - The HTML element to which the context options are attached
     * @param entryOptions - The context menu entries
     * @remarks The name for this hook is dynamically created by joining "get" with the type name of the SidebarDirectory
     * and "FolderContext".
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link SidebarDirectory#_contextMenu}
     */
    type GetSidebarDirectoryFolderContext = (html: JQuery, entryOptions: ContextMenuEntry[]) => boolean | void;

    /**
     * A hook event that fires when the user modifies a global volume slider.
     * The hook name needs to be customized to include the type of global volume being changed, one of:
     * `globalPlaylistVolumeChanged`, `globalAmbientVolumeChanged`, or `globalInterfaceVolumeChanged`.
     * @param volume - The new volume level
     * @remarks The name for this hook is dynamically created by joining the name of the volume with "Changed".
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link AudioHelper#_onChangeGlobalVolume}
     */
    type GlobalVolumeChanged = (volume: number) => void;

    /**
     * A hook event that fires when any PlaceableObject is hovered over or out.
     * Substitute the PlaceableObject name in the hook event to target a specific
     * PlaceableObject type, for example "hoverToken".
     * @param object - The PlaceableObject
     * @param hover  - Whether the PlaceableObject is hovered over or not
     * @typeParam P  - the type of the PlaceableObject
     * @remarks The name for this hook is dynamically created by joining "hover" and the type name of the PlaceableObject.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link PlaceableObject#_onHoverIn}
     * @see {@link PlaceableObject#_onHoverOut}
     */
    type HoverPlaceableObject<P extends PlaceableObject = PlaceableObject> = (object: P, hover: boolean) => void;

    /**
     * A hook event that fires when any PlaceableObject is pasted onto the
     * Scene. Substitute the PlaceableObject name in the hook event to target a
     * specific PlaceableObject type, for example "pasteToken".
     * @param copied     - The PlaceableObjects that were copied
     * @param createData - The new objects that will be added to the Scene
     * @typeParam P      - the type of the PlaceableObject
     * @remarks The name for this hook is dynamically created by joining "paste" with the type name of the
     * PlaceableObject.
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link PlaceablesLayer#pasteObjects}
     */
    type PastePlaceableObject<P extends PlaceableObject = PlaceableObject> = (
      copied: P[],
      createData: Array<P["document"]["data"]["_source"]>
    ) => boolean | void;

    /**
     * A hook event that fires for every Document type before execution of a creation workflow. Substitute the
     * Document name in the hook event to target a specific Document type, for example "preCreateActor". This hook
     * only fires for the client who is initiating the creation request.
     *
     * The hook provides the pending document instance which will be used for the Document creation. Hooked functions
     * may modify that data or prevent the workflow entirely by explicitly returning false.
     *
     * @param document - The pending document which is requested for creation
     * @param data     - The initial data object provided to the document creation request
     * @param options  - Additional options which modify the creation request
     * @param userId   - The ID of the requesting user, always game.user.id
     * @typeParam D    - the type of the Document constructor
     * @returns Explicitly return false to prevent creation of this Document
     * @remarks The name for this hook is dynamically created by joining "preCreate" with the name of the Document.
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link ClientDatabaseBackend#_preCreateDocumentArray}
     * @see {@link TokenDocument#_preUpdateTokenActor}
     */
    type PreCreateDocument<D extends DocumentConstructor = DocumentConstructor> = (
      document: InstanceType<ConfiguredDocumentClass<D>>,
      data: ConstructorParameters<D>[0],
      options: DocumentModificationOptions,
      userId: string
    ) => boolean | void;

    /**
     * A hook event that fires for every Document type before execution of a deletion workflow. Substitute the
     * Document name in the hook event to target a specific Document type, for example "preDeleteActor". This hook
     * only fires for the client who is initiating the update request.
     *
     * The hook provides the Document instance which is requested for deletion. Hooked functions may prevent the
     * workflow entirely by explicitly returning false.
     *
     * @param document - The Document instance being deleted
     * @param options  - Additional options which modify the deletion request
     * @param userId   - The ID of the requesting user, always game.user.id
     * @typeParam D    - the type of the Document constructor
     * @returns Explicitly return false to prevent deletion of this Document
     * @remarks The name for this hook is dynamically created by joining "preDelete" with the type name of the Document.
     * @remarks This is called by {@link Hooks.call}.
     * @see {@link ClientDatabaseBackend#_preDeleteDocumentArray}.
     * @see {@link TokenDocument#_preUpdateTokenActor}
     */
    type PreDeleteDocument<D extends DocumentConstructor = DocumentConstructor> = (
      document: InstanceType<ConfiguredDocumentClass<D>>,
      options: DocumentModificationOptions,
      userId: string
    ) => boolean | void;

    /**
     * A hook event that fires for every Document type before execution of an update workflow. Substitute the Document
     * name in the hook event to target a specific Document type, for example "preUpdateActor". This hook only fires
     * for the client who is initiating the update request.
     *
     * The hook provides the differential data which will be used to update the Document. Hooked functions may modify
     * that data or prevent the workflow entirely by explicitly returning false.
     *
     * @param document - The Document instance being updated
     * @param change   - Differential data that will be used to update the document
     * @param options  - Additional options which modify the update request
     * @param userId   - The ID of the requesting user, always game.user.id
     * @typeParam D    - the type of the Document constructor
     * @returns Explicitly return false to prevent update of this Document
     * @remarks The name for this hook is dynamically created by joining "preUpdate" with the type name of the Document.
     * @remarks This is called {@link Hooks.call}.
     * @see {@link ClientDatabaseBackend#_preUpdateDocumentArray}
     * @see {@link TokenDocument#_preUpdateTokenActor}
     */
    type PreUpdateDocument<D extends DocumentConstructor = DocumentConstructor> = (
      document: InstanceType<ConfiguredDocumentClass<D>>,
      change: DeepPartial<ConstructorParameters<D>[0]>,
      options: DocumentModificationOptions,
      userId: string
    ) => boolean | void;

    /**
     * A hook event that fires whenever this Application is rendered.
     * The hook provides the pending application HTML which will be added to the DOM.
     * Hooked functions may modify that HTML or attach interactive listeners to it.
     *
     * @param app   - The Application instance being rendered
     * @param html  - The inner HTML of the document that will be displayed and may be modified
     * @param data  - The object of data used when rendering the application
     * @typeParam A - the type of the Application
     * @remarks The name for this hook is dynamically created by joining "render" with the type name of the Application.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Application#_render}
     */
    type RenderApplication<A extends Application = Application> = (
      app: A,
      html: JQuery,
      data: ReturnType<A["getData"]> extends Promise<infer T> ? T : ReturnType<A["getData"]>
    ) => boolean | void;

    /**
     * A hook event that fires for every Document type after conclusion of an update workflow.
     * Substitute the Document name in the hook event to target a specific Document type, for example "updateActor".
     * This hook fires for all connected clients after the update has been processed.
     *
     * @param document - The existing Document which was updated
     * @param change   - Differential data that was used used to update the document
     * @param options  - Additional options which modified the update request
     * @param userId   - The ID of the User who triggered the update workflow
     * @typeParam D    - the type of the Document constructor
     * @remarks The name for this hook is dynamically created by joining "update" with the type name of the Document.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link ClientDatabaseBackend#_postUpdateDocumentCallbacks}
     * @see {@link TokenDocument#_onUpdateTokenActor}
     */
    type UpdateDocument<D extends DocumentConstructor = DocumentConstructor> = (
      document: InstanceType<ConfiguredDocumentClass<D>>,
      change: DeepPartial<ConstructorParameters<D>[0]>,
      options: DocumentModificationOptions,
      userId: string
    ) => void;

    type DynamicCallbacks =
      | CloseApplication
      | ControlPlaceableObject
      | CreateDocument
      | DeleteDocument
      | GetApplicationHeaderButtons
      | GetEntryContext
      | GetPlaylistDirectorySoundContext
      | GetSidebarDirectoryFolderContext
      | HoverPlaceableObject
      | PastePlaceableObject
      | PreCreateDocument
      | PreDeleteDocument
      | PreUpdateDocument
      | RenderApplication
      | UpdateDocument;

    interface ErrorCallbackParameters {
      "Canvas#draw": [location: "Canvas#draw", err: Error, data: { layer: CanvasLayer }];
      "Application#render": [location: "Application#render", err: Error, data: Application.RenderOptions];
      "Localization#_loadTranslationFile": [
        location: "Localization#_loadTranslationFile",
        err: Error,
        data: { src: string }
      ];
      "ClientDatabaseBackend#_preCreateDocumentArray": [
        location: "ClientDatabaseBackend#_preCreateDocumentArray",
        err: Error,
        data: { id: string }
      ];
      "ClientDatabaseBackend#_preUpdateDocumentArray": [
        location: "ClientDatabaseBackend#_preUpdateDocumentArray",
        err: Error,
        data: { id: string }
      ];
      "WorldCollection#_initialize": [location: "WorldCollection#_initialize", err: Error, data: { id: string }];
      "ClientDocumentMixin#_initialize": [
        location: "ClientDocumentMixin#_initialize",
        err: Error,
        data: { id: string }
      ];
      "Actor#getTokenImages": [location: "Actor#getTokenImages", err: Error, data: Record<string, never>];
      "Macro#executeChat": [location: "Macro#executeChat", err: Error, data: { command: string }];
      "ChatMessage#roll": [location: "ChatMessage#roll", err: Error, data: { command: string }];
      "DefaultTokenConfig#_updateObject": [
        location: "DefaultTokenConfig#_updateObject",
        err: Error,
        data: Record<string, never>
      ];
      "SceneConfig#_updateObject": [location: "SceneConfig#_updateObject", err: Error, data: { scene: string }];
      "SidebarDirectory.setupFolders": [
        location: "SidebarDirectory.setupFolders",
        err: Error,
        data: Record<string, never>
      ];
      "Sidebar#_render": [location: "Sidebar#_render", err: Error, data: { name: string }];
      "Game#initializeCanvas": [location: "Game#initializeCanvas", err: Error, data: Record<string, never>];
      "EmbeddedCollection#_initialize": [
        location: "EmbeddedCollection#_initialize",
        err: Error,
        data: { id: string; documentName: string }
      ];
    }
  }
}
