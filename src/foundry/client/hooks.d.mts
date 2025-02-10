import type { EditorState, Plugin } from "prosemirror-state";
import type { DeepPartial, EmptyObject, FixedInstanceType, ValueOf } from "fvtt-types/utils";
import type Document from "../common/abstract/document.d.mts";
import type { EffectChangeData } from "../common/documents/_types.d.mts";
import type { ProseMirrorDropDown } from "../common/prosemirror/menu.d.mts";
import type ProseMirrorMenu from "../common/prosemirror/menu.d.mts";
import type PointVisionSource from "../client-esm/canvas/sources/point-vision-source.d.mts";
import type RenderedEffectSource from "../client-esm/canvas/sources/rendered-effect-source.d.mts";
import type { CompendiumArtInfo } from "../client-esm/helpers/_types.d.mts";

declare global {
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
    interface OnOptions {
      /** Only trigger the hooked function once */
      once?: boolean;
    }

    interface StaticCallbacks {
      /** Core lifecycle */

      /**
       * A hook event that fires as Foundry is initializing, right before any initialization tasks have begun.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#initialize}
       */
      init: () => void;

      /**
       * A hook event that fires once Localization translations have been loaded and are ready for use.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Localization#initialize}
       */
      i18nInit: () => void;

      /**
       * A hook event that fires when Foundry has finished initializing but
       * before the game state has been set up. Fires before any Documents, UI
       * applications, or the Canvas have been initialized.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#setupGame}
       */
      setup: () => void;

      /**
       * A hook event that fires when the game is fully ready.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#setupGame}
       */
      ready: () => void;

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

      /** Game */

      /**
       * A hook event that fires when the game is paused or un-paused.
       * @param paused - Is the game now paused (true) or un-paused (false)
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Game#togglePause}
       */
      pauseGame: (paused: boolean) => void;

      /**
       * A hook event that fires when the World time has been updated.
       * @param worldTime - The new canonical World time
       * @param delta     - The time delta
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link GameTime#onUpdateWorldTime}
       */
      updateWorldTime: (worldTime: number, delta: number) => void;

      /** CanvasLifecycle */

      /**
       * A hook event that fires immediately prior to PIXI Application construction with the configuration parameters.
       * @param canvasConfig - Canvas configuration parameters that will be used to initialize the PIXI.Application
       * @remarks This is called by {@link Hooks.callAll}.
       */
      canvasConfig: (canvasConfig: ConstructorParameters<typeof PIXI.Application>[0]) => void;

      /**
       * A hook event that fires when the Canvas is initialized.
       * @param canvas - the Canvas instance being initialized
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Canvas#draw}
       */
      canvasInit: (canvas: Canvas) => void;

      /**
       * A hook event that fires when the Canvas is panned.
       * @param canvas - The Canvas instance
       * @param view   - The applied camera position
       * @remarks When called during animated panning, the callback is called on every tick.
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Canvas#pan}
       * @see {@link Canvas#animatePan}
       */
      canvasPan: (canvas: Canvas, view: Canvas.ViewPosition) => void;

      /**
       * A hook event that fires when the Canvas is ready.
       * @param canvas - The Canvas which is now ready for use
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link Canvas#draw}
       */
      canvasReady: (canvas: Canvas) => boolean | void;

      /**
       * A hook event that fires when the Canvas is deactivated.
       * @param canvas - The Canvas instance being deactivated
       * @remarks This is called by {@link Hooks.callAll}.
       */
      canvasTearDown: (canvas: Canvas) => void;

      /**
       * A hook event that fires when the Canvas is beginning to draw the canvas groups.
       * @param canvas - The Canvas instance being drawn
       * @remarks This is called by {@link Hooks.callAll}.
       */
      canvasDraw: (canvas: Canvas) => void;

      /**
       * A hook event that fires when some useful data is dropped onto the Canvas.
       * @param canvas - The Canvas
       * @param data   - The data that has been dropped onto the Canvas
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the Document being created.
       * @see {@link Canvas#_onDrop}
       */
      dropCanvasData: (canvas: Canvas, data: TokenLayer.DropData | NotesLayer.DropData) => boolean | void;

      /**
       * A hook event that fires when objects are highlighted on the canvas.
       * Callers may use this hook to apply their own modifications or enhancements to highlighted objects.
       * @param active - Is the highlight state now active
       * @see {@link Canvas#highlightObjects}
       */
      highlightObjects: (active: boolean) => void;

      /** Application */

      /**
       * A hook event that fires when the Scene controls are initialized.
       * @param controls - The SceneControl configurations
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link SceneControls#_getControlButtons}
       */
      getSceneControlButtons: (controls: SceneControl[]) => void;

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
      hotbarDrop: (hotbar: Hotbar, data: Document.DropData<Macro.ConfiguredInstance>, slot: number) => boolean | void;

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
       * A hook event that fires when the Sidebar tab is changed.
       * @param app - The SidebarTab application which is now active
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link Sidebar#_onChangeTab}
       */
      changeSidebarTab: (app: SidebarTab) => void;

      /** Active Effects */

      /**
       * A hook event that fires when a custom active effect is applied.
       * @param actor  - The actor the active effect is being applied to
       * @param change - The change data being applied
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link ActiveEffect#_applyCustom}
       */
      applyActiveEffect: (actor: Actor.ConfiguredInstance, change: ActiveEffect.EffectChangeData) => boolean | void;

      /** Compendium */

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
        pack: CompendiumCollection.Any,
        documents: Document.Any[],
        options: Document.OnUpdateOptions<Document.Any["documentName"]>,
        userId: string,
      ) => void;

      /** Token */

      /**
       * A hook event that fires when a token {@link Token} should apply a specific status effect.
       * @param token    - The token affected
       * @param statusId - The status effect ID being applied, from CONFIG.specialStatusEffects.
       * @param active   - Is the special status effect now active?
       */
      applyTokenStatusEffect: (token: Token.ConfiguredInstance, statusId: string, active: boolean) => void;

      /**
       * A hook event that fires when a chat bubble is initially configured.
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
        },
      ) => boolean | void;

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
        updates: Record<string, number>,
      ) => boolean;

      /**
       * A hook event that fires when a token is targeted or un-targeted.
       * @param user     - The User doing the targeting
       * @param token    - The targeted Token
       * @param targeted - Whether the Token has been targeted or untargeted
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link UserTargets#_hook}
       */
      targetToken: (
        user: User.ConfiguredInstance,
        token: Document.ConfiguredObjectClassForName<"Token">,
        targeted: boolean,
      ) => void;

      /** Note */

      /**
       * A hook event that fires whenever a map note is double-clicked.
       * The hook provides the note placeable and the arguments passed to the associated {@link JournalSheet} render call.
       * Hooked functions may modify the render arguments or cancel the render by returning false.
       * @param note    - The note that was activated
       * @param options - Options for rendering the associated {@link JournalSheet}
       * @remarks This is called by {@link Hooks.call}.
       */
      activateNote: (note: Note.ConfiguredInstance, options: JournalSheet.RenderOptions) => true | false;

      /** Cards */

      /**
       * A hook event that fires when Cards are dealt from a deck to other hands
       * @param origin             - The origin Cards document
       * @param destinations       - An array of destination Cards documents
       * @param context            - Additional context which describes the operation
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the operation.
       */
      dealCards: (
        origin: Cards.ConfiguredInstance,
        destinations: Cards.ConfiguredInstance[],
        context: Cards.DealContext,
      ) => boolean | void;

      /**
       * A hook event that fires when Cards are passed from one stack to another
       * @param origin      - The origin Cards document
       * @param destination - The destination Cards document
       * @param context     - Additional context which describes the operation
       * @remarks This is called by {@link Hooks.call}.
       * @remarks An explicit return value of `false` prevents the operation.
       */
      passCards: (
        origin: Cards.ConfiguredInstance,
        destination: Cards.ConfiguredInstance,
        context: Cards.DealContext,
      ) => boolean | void;

      /**
       * A hook event that fires when a stack of Cards are returned to the decks they originally came from.
       * @param origin   - The origin Cards document.
       * @param returned - The cards being returned.
       * @param context  - Additional context which describes the operation.
       */
      returnCards: (
        origin: Cards.ConfiguredInstance,
        returned: Card.ConfiguredInstance[],
        context: Cards.ReturnContext,
      ) => boolean | void;

      /** Actor */

      /**
       * A hook even that fires when package-provided art is applied to a compendium Document.
       * @param documentClass - The Document class.
       * @param source        - The Document's source data.
       * @param pack          - The Document's compendium.
       * @param art           - The art being applied.
       * @remarks Called as part of _initializeSource, after data migration, cleaning, and shims
       * @remarks Currently only called by Actor but comments are more generic
       * @remarks This is called by {@link Hooks.callAll}.
       */
      applyCompendiumArt: (
        documentClass: Actor.ConfiguredClass,
        source: foundry.documents.BaseActor.ConstructorData,
        pack: CompendiumCollection.Any,
        art: CompendiumArtInfo,
      ) => void;

      /** ActorSheet */

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
        actor: Actor.ConfiguredInstance,
        sheet: ActorSheet,
        data: ActorSheet.DropData,
      ) => boolean | void;

      /** CanvasVisibility */

      /**
       * A hook event that fires when the set of vision sources are initialized.
       * @param sources - The collection of current vision sources
       * @remarks This is called by {@link Hooks.call}.
       */
      initializeVisionSources: (sources: Collection<PointVisionSource.Any>) => void;

      /**
       * A hook event that fires when the LightingLayer is refreshed.
       * @param layer - the LightingLayer
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link LightingLayer#refresh}
       */
      lightingRefresh: (layer: LightingLayer) => void;

      /**
       * A hook event that fires when visibility is refreshed.
       * @param visibility - The CanvasVisibility instance
       * @remarks This is called by {@link Hooks.callAll}.
       */
      visibilityRefresh: (visibility: CanvasVisibility) => void;

      /**
       * A hook event that fires during light source initialization.
       * This hook can be used to add programmatic light sources to the Scene.
       * @param source - The EffectsCanvasGroup where light sources are initialized
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link EffectsCanvasGroup#initializeLightSources}
       */
      initializeLightSources: (group: EffectsCanvasGroup) => void;

      /**
       * A hook event that fires during darkness source initialization.
       * This hook can be used to add programmatic darkness sources to the Scene.
       * @param group - The EffectsCanvasGroup where darkness sources are initialized
       * @remarks This is called by {@link Hooks.callAll}.
       */
      initializeDarknessSources: (group: EffectsCanvasGroup) => void;

      /**
       * A hook event that fires when the CanvasVisibility layer has been refreshed.
       * @param visibility - The CanvasVisibility layer
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link CanvasVisibility#restrictVisibility}
       */
      sightRefresh: (visibility: CanvasVisibility) => void;

      /** Weather */

      /**
       * Initialize the weather container from a weather config object.
       * @param weatherEffect        - The weather effects canvas layer
       * @param weatherEffectsConfig - The weather effects config object
       * @remarks This is called by {@link Hooks.callAll}.
       */
      initializeWeatherEffects: (
        weatherEffect: WeatherEffects,
        weatherEffectsConfig?: WeatherEffects.WeatherEffectsConfig | null,
      ) => void;

      /** Adventure */

      /**
       * A hook event that fires when Adventure data is being prepared for import.
       * Modules may return false from this hook to take over handling of the import workflow.
       * @param adventure - The Adventure document from which content is being imported
       * @param formData  - Processed data from the importer form
       * @param toCreate  - Adventure data which needs to be created in the World
       * @param toUpdate  - Adventure data which needs to be updated in the World
       * @returns False to prevent the core software from handling the import
       * @remarks This is called by {@link Hooks.call}.
       */
      preImportAdventure: (
        adventure: Adventure.ConfiguredInstance,
        formData: object, // TODO: Improve this. Also relevant to `AdventureImporter#_updateObject`
        toCreate: AdventureImportData["toCreate"],
        toUpdate: AdventureImportData["toUpdate"],
      ) => boolean | void;

      /**
       * A hook event that fires after an Adventure has been imported into the World.
       * @param adventure - The Adventure document from which content is being imported
       * @param formData  - Processed data from the importer form
       * @param toCreate  - Adventure data which needs to be created in the World
       * @param toUpdate  - Adventure data which needs to be updated in the World
       * @returns False to prevent the core software from handling the import
       * @remarks This is called by {@link Hooks.callAll}.
       */
      importAdventure: (
        adventure: Adventure.ConfiguredInstance,
        formData: object, // TODO: Improve this. Also relevant to `AdventureImporter#_updateObject`
        toCreate: AdventureImportData["toCreate"],
        toUpdate: AdventureImportData["toUpdate"],
      ) => void;

      /** Socket */

      /**
       * A hook event that fires whenever some other User joins or leaves the game session.
       * @param user      - The User who connected or disconnected
       * @param connected - Is the user now connected (true) or disconnected (false)
       * @remarks This is called by {@link Hooks.callAll}.
       */
      userConnected: (user: User.ConfiguredInstance, connected: boolean) => void;

      /** Combat */

      /**
       *  A hook event which fires when the turn order of a Combat encounter is progressed.
       * This event fires on all clients after the database update has occurred for the Combat.
       * @param combat  - The Combat encounter for which the turn order has changed
       * @param prior   - The prior turn state
       * @param current - The new turn state
       * @remarks This is called by {@link Hooks.callAll}.
       */
      combatTurnChange: (
        combat: Combat.ConfiguredInstance,
        prior: Combat.HistoryData,
        current: Combat.HistoryData,
      ) => void;

      /**
       * A hook event that fires when a Combat encounter is started.
       * This event fires on the initiating client before any database update occurs.
       * @param combat     - The Combat encounter which is starting
       * @param updateData - An object which contains Combat properties that will be updated. Can be mutated.
       */
      combatStart: (
        combat: Combat.ConfiguredInstance,
        updateData: {
          /** The initial round */
          round: number;
          /** The initial turn */
          turn: number;
        },
      ) => void;

      /**
       * A hook event that fires when the turn of the Combat encounter changes.
       * This event fires on the initiating client before any database update occurs.
       * @param combat        - The Combat encounter which is advancing or rewinding its turn
       * @param updateData    - An object which contains Combat properties that will be updated. Can be mutated.
       * @param updateOptions - An object which contains options provided to the update method. Can be mutated.
       */
      combatTurn: (
        combat: Combat.ConfiguredInstance,
        updateData: {
          /** The current round of combat */
          round: number;
          /** The new turn number */
          turn: number;
        },
        updateOptions: {
          /** The amount of time in seconds that time is being advanced */
          advanceTime: number;
          /** A signed integer for whether the turn order is advancing or rewinding */
          direction: number;
        },
      ) => void;

      /**
       * A hook event that fires when the round of the Combat encounter changes.
       * @param combat        - The Combat encounter which is advancing or rewinding its round
       * @param updateData    - An object which contains Combat properties that will be updated. Can be mutated.
       * @param updateOptions - An object which contains options provided to the update method. Can be mutated.
       */
      combatRound: (
        combat: Combat.ConfiguredInstance,
        updateData: {
          /** The new round of combat */
          round: number;
          /** The new turn number */
          turn: number;
        },
        updateOptions: {
          /** The amount of time in seconds that time is being advanced */
          advanceTime: number;
          /** A signed integer for whether the turn order is advancing or rewinding */
          direction: number;
        },
      ) => void;

      /** ProseMirror */

      /**
       * A hook even that fires when a ProseMirrorMenu's drop-downs are initialized.
       * The hook provides the ProseMirrorMenu instance and an object of drop-down configuration data.
       * Hooked functions may append their own drop-downs or append entries to existing drop-downs.
       * @param menu   - The ProseMirrorMenu instance.
       * @param config - The drop-down config.
       * @remarks This is called by {@link Hooks.callAll}.
       */
      getProseMirrorMenuDropdowns: (
        menu: ProseMirrorMenu,
        config: {
          format: ProseMirrorDropDown.Config;
          fonts: ProseMirrorDropDown.Config;
        },
      ) => void;

      /**
       * A hook even that fires when a ProseMirrorMenu's buttons are initialized.
       * The hook provides the ProseMirrorMenu instance and an array of button configuration data.
       * Hooked functions may append their own buttons to the list.
       * @param menu   - The ProseMirrorMenu instance
       * @param config - The button configuration objects
       * @remarks This is called by {@link Hooks.callAll}.
       */
      // TODO: Having trouble finding the appropriate typing for the menu items? Also, where is this even called?
      getProseMirrorMenuItems: (menu: ProseMirrorMenu, config: unknown[]) => void;

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

      /** HotReload */

      /**
       * A hook event that fires when a package that is being watched by the hot reload system has a file changed.
       * The hook provides the hot reload data related to the file change.
       * Hooked functions may intercept the hot reload and prevent the core software from handling it by returning false.
       * @param data - The hot reload data
       * @remarks This is called by {@link Hooks.call}.
       */
      hotReload: (data: HotReloadData) => boolean | void;

      /** Chat */

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
          /** The id of the User sending the message */
          user: string;

          /** The identified speaker data, see {@link ChatMessage.getSpeaker} */
          speaker: ReturnType<ChatMessage.ConfiguredClass["getSpeaker"]>;
        },
      ) => boolean | void;

      /**
       * A hook event that fires for each ChatMessage which is rendered for addition to the ChatLog.
       * This hook allows for final customization of the message HTML before it is added to the log.
       * @param message        - The ChatMessage document being rendered
       * @param html           - The pending HTML as a jQuery object
       * @param messageData    - The input data provided for template rendering
       * @remarks This is called by {@link Hooks.call}.
       * @see {@link ChatMessage#render}
       */
      renderChatMessage: (
        message: ChatMessage,
        html: JQuery,
        messageData: {
          message: Document.ToObjectFalseType<ChatMessage.ConfiguredInstance>;
          user: Game["user"];
          author: User.ConfiguredInstance | null;
          alias: string;
          cssClass: string;
          isWhisper: boolean;
          canDelete: boolean;
          whisperTo: string;
          borderColor?: string;
        },
      ) => boolean | void;

      /** Audio-Video */

      // Individually implemented all three options for globalVolumeChanged

      /**
       * A hook event that fires when the user modifies a global volume slider.
       * @param volume - The new volume level
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link AudioHelper#_onChangeGlobalVolume}
       */
      globalAmbientVolumeChanged: (volume: number) => void;
      /**
       * A hook event that fires when the user modifies a global volume slider.
       * @param volume - The new volume level
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link AudioHelper#_onChangeGlobalVolume}
       */
      globalInterfaceVolumeChanged: (volume: number) => void;
      /**
       * A hook event that fires when the user modifies a global volume slider.
       * @param volume - The new volume level
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link AudioHelper#_onChangeGlobalVolume}
       */
      globalPlaylistVolumeChanged: (volume: number) => void;

      /**
       * A hook event that fires when the AV settings are changed.
       * @param settings - The AVSettings manager
       * @param changed  - The delta of the settings that have been changed
       * @remarks This is called by {@link Hooks.callAll}.
       * @see {@link AVSettings#_onSettingsChanged}
       */
      rtcSettingsChanged: (settings: AVSettings, changed: DeepPartial<AVSettings.Settings>) => void;

      /** RollTableConfig */

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
        table: RollTable.ConfiguredInstance,
        config: RollTableConfig,
        data: object,
      ) => boolean | void;

      /**
       * A hook event that allows to pass custom dynamic ring configurations.
       * @param ringConfig - The ring configuration instance
       * @remarks This is called by {@link Hooks.callAll}.
       */
      initializeDynamicTokenRingConfig: (ringConfig: foundry.canvas.tokens.TokenRingConfig) => void;

      /** Specific implementations of GetEntryContext */

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
    }

    /** Application */

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
    type RenderApplication<A extends Application.Any = Application.Any> = (
      app: A,
      html: JQuery,
      data: ReturnType<A["getData"]> extends Promise<infer T> ? T : ReturnType<A["getData"]>,
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
    type GetApplicationHeaderButtons<A extends Application.Any = Application.Any> = (
      app: A,
      buttons: Application.HeaderButton[],
    ) => boolean | void;

    /**
     * A hook event that fires whenever this Application is closed.
     * @param app   - The Application instance being closed
     * @param html  - The application HTML when it is closed
     * @typeParam A - the type of the Application
     * @remarks The name for this hook is dynamically created by joining "close" with the type name of the Application.
     * @remarks This is called by {@link Hooks.callAll}.
     * @see {@link Application#close}
     */
    type CloseApplication<A extends Application.Any = Application.Any> = (app: A, html: JQuery) => void;

    /** ApplicationV2 */

    // Not explicitly typed in Foundry v12 but still fires
    type RenderApplicationV2<
      A extends foundry.applications.api.ApplicationV2.Any = foundry.applications.api.ApplicationV2.Any,
    > = (app: A, element: HTMLElement) => void;

    // Not explicitly typed in Foundry v12 but still fires
    type CloseApplicationV2<
      A extends foundry.applications.api.ApplicationV2.Any = foundry.applications.api.ApplicationV2.Any,
    > = (app: A) => void;

    /** EffectsCanvasGroup */

    /**
     * A hook event that fires when a {@link CanvasGroup} is drawn.
     * The dispatched event name replaces "Group" with the named CanvasGroup subclass, i.e. "drawPrimaryCanvasGroup".
     * @param group - The group being drawn
     */
    type DrawGroup<G extends CanvasGroupMixin.AnyMixed = CanvasGroupMixin.AnyMixed> = (group: G) => void;

    /**
     * A hook event that fires when a {@link CanvasGroup} is deconstructed.
     * The dispatched event name replaces "Group" with the named CanvasGroup subclass, i.e. "tearDownPrimaryCanvasGroup".
     * @param group - The group being deconstructed
     */
    type TearDownGroup<G extends CanvasGroupMixin.AnyMixed = CanvasGroupMixin.AnyMixed> = (group: G) => void;

    /** CanvasLayer */

    /**
     * A hook event that fires when a {@link CanvasLayer} is initially drawn.
     * The dispatched event name replaces "Layer" with the named CanvasLayer subclass, i.e. "drawTokensLayer".
     * @param layer - The layer being drawn
     * @typeParam L - the type of the CanvasLayer
     */
    type DrawLayer<L extends CanvasLayer = CanvasLayer> = (layer: L) => void;

    /**
     * A hook event that fires when a {@link CanvasLayer} is deconstructed.
     * The dispatched event name replaces "Layer" with the named CanvasLayer subclass, i.e. "tearDownTokensLayer".
     * @param layer - The layer being deconstructed
     * @typeParam L - the type of the CanvasLayer
     */
    type TearDownLayer<L extends CanvasLayer = CanvasLayer> = (layer: L) => void;

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
      createData: Array<P["document"]["_source"]>,
    ) => boolean | void;
    /**  */

    /** PlaceableObject */

    /**
     * A hook event that fires when a {@link PlaceableObject} is initially drawn.
     * The dispatched event name replaces "Object" with the named PlaceableObject subclass, i.e. "drawToken".
     * @param object - The object instance being drawn
     * @typeParam P  - the type of the PlaceableObject
     * @remarks This is called by {@link Hooks.callAll}
     */
    type DrawObject<P extends PlaceableObject = PlaceableObject> = (object: P) => void;

    /**
     * A hook event that fires when a {@link PlaceableObject} is incrementally refreshed.
     * The dispatched event name replaces "Object" with the named PlaceableObject subclass, i.e. "refreshToken".
     * @param object - The object instance being refreshed
     * @typeParam P  - the type of the PlaceableObject
     * @remarks This is called by {@link Hooks.callAll}
     */
    type RefreshObject<P extends PlaceableObject = PlaceableObject> = (object: P) => void;

    /**
     * A hook event that fires when a {@link PlaceableObject} is destroyed.
     * The dispatched event name replaces "Object" with the named PlaceableObject subclass, i.e. "destroyToken".
     * @param object - The object instance being destroyed
     * @typeParam P  - the type of the PlaceableObject
     * @remarks This is called by {@link Hooks.callAll}
     */
    type DestroyObject<P extends PlaceableObject = PlaceableObject> = (object: P) => void;

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
    type ControlObject<P extends PlaceableObject = PlaceableObject> = (object: P, controlled: boolean) => void;

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
    type HoverObject<P extends PlaceableObject = PlaceableObject> = (object: P, hover: boolean) => void;

    /** Document */

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
    type PreCreateDocument<D extends Document.AnyConstructor = Document.AnyConstructor> = (
      document: Document.ToConfiguredInstance<D>,
      data: ConstructorParameters<D>[0],
      options: Document.PreCreateOptions<FixedInstanceType<D>["documentName"]>,
      userId: string,
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
     * @param changed  - Differential data that will be used to update the document
     * @param options  - Additional options which modify the update request
     * @param userId   - The ID of the requesting user, always game.user.id
     * @typeParam D    - the type of the Document constructor
     * @returns Explicitly return false to prevent update of this Document
     * @remarks The name for this hook is dynamically created by joining "preUpdate" with the type name of the Document.
     * @remarks This is called {@link Hooks.call}.
     * @see {@link ClientDatabaseBackend#_preUpdateDocumentArray}
     * @see {@link TokenDocument#_preUpdateTokenActor}
     */
    type PreUpdateDocument<D extends Document.AnyConstructor = Document.AnyConstructor> = (
      document: Document.ToConfiguredInstance<D>,
      changed: DeepPartial<ConstructorParameters<D>[0]>,
      options: Document.PreUpdateOptions<FixedInstanceType<D>["documentName"]>,
      userId: string,
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
    type PreDeleteDocument<D extends Document.AnyConstructor = Document.AnyConstructor> = (
      document: Document.ToConfiguredInstance<D>,
      options: Document.PreDeleteOptions<FixedInstanceType<D>["documentName"]>,
      userId: string,
    ) => boolean | void;

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
    type CreateDocument<D extends Document.AnyConstructor = Document.AnyConstructor> = (
      document: Document.ToConfiguredInstance<D>,
      options: Document.OnCreateOptions<FixedInstanceType<D>["documentName"]>,
      userId: string,
    ) => void;

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
    type UpdateDocument<D extends Document.AnyConstructor = Document.AnyConstructor> = (
      document: Document.ToConfiguredInstance<D>,
      change: DeepPartial<ConstructorParameters<D>[0]>,
      options: Document.OnUpdateOptions<FixedInstanceType<D>["documentName"]>,
      userId: string,
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
    type DeleteDocument<D extends Document.AnyConstructor = Document.AnyConstructor> = (
      document: Document.ToConfiguredInstance<D>,
      options: Document.OnDeleteOptions<FixedInstanceType<D>["documentName"]>,
      userId: string,
    ) => void;

    /** PointSource */

    /**
     * A hook event that fires after RenderedPointSource shaders have initialized.
     * @param source - The RenderedEffectSource instance being initialized
     * @typeParam RPS - the type of the RenderedPointSource
     * @remarks The name for this hook is dynamically created by wrapping the type name of the shader in `initialize` and `Shaders`.
     * @remarks This is called by {@link Hooks.callAll}.
     */
    type InitializeRenderedEffectSourceShaders<RPS extends RenderedEffectSource.Any = RenderedEffectSource.Any> = (
      source: RPS,
    ) => void;

    /** InteractionLayer */

    /**
     * A hook event that fires with a {@link InteractionLayer} becomes active.
     * The dispatched event name replaces "Layer" with the named InteractionLayer subclass, i.e. "activateTokensLayer".
     * @param layer - The layer becoming active
     * @remarks This is called by {@link Hooks.callAll}.
     */
    type ActivateLayer<L extends InteractionLayer = InteractionLayer> = (layer: L) => void;

    /**
     * A hook event that fires with a {@link InteractionLayer} becomes inactive.
     * The dispatched event name replaces "Layer" with the named InteractionLayer subclass, i.e. "deactivateTokensLayer".
     * @param layer - The layer becoming inactive
     * @remarks This is called by {@link Hooks.callAll}.
     */
    type DeactivateLayer<L extends InteractionLayer = InteractionLayer> = (layer: L) => void;

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

    type DynamicCallbacks =
      | RenderApplication
      | GetApplicationHeaderButtons
      | CloseApplication
      | DrawGroup
      | TearDownGroup
      | DrawLayer
      | TearDownLayer
      | PastePlaceableObject
      | DrawObject
      | ControlObject
      | DestroyObject
      | HoverObject
      | PreCreateDocument
      | PreUpdateDocument
      | PreDeleteDocument
      | CreateDocument
      | UpdateDocument
      | DeleteDocument
      | InitializeRenderedEffectSourceShaders
      | ActivateLayer
      | DeactivateLayer
      | GetEntryContext
      | GetPlaylistDirectorySoundContext
      | GetSidebarDirectoryFolderContext;

    interface ErrorCallbackParameters {
      "Canvas#draw": [location: "Canvas#draw", err: Error, data: { layer: CanvasLayer }];
      "Application#render": [location: "Application#render", err: Error, data: Application.RenderOptions];
      "Localization#_loadTranslationFile": [
        location: "Localization#_loadTranslationFile",
        err: Error,
        data: { src: string },
      ];
      "ClientDatabaseBackend#_preCreateDocumentArray": [
        location: "ClientDatabaseBackend#_preCreateDocumentArray",
        err: Error,
        data: { id: string },
      ];
      "ClientDatabaseBackend#_preUpdateDocumentArray": [
        location: "ClientDatabaseBackend#_preUpdateDocumentArray",
        err: Error,
        data: { id: string },
      ];
      "WorldCollection#_initialize": [location: "WorldCollection#_initialize", err: Error, data: { id: string }];
      "ClientDocumentMixin#_initialize": [
        location: "ClientDocumentMixin#_initialize",
        err: Error,
        data: { id: string },
      ];
      "Actor#getTokenImages": [location: "Actor#getTokenImages", err: Error, data: EmptyObject];
      "Macro#executeChat": [location: "Macro#executeChat", err: Error, data: { command: string }];
      "ChatMessage#roll": [location: "ChatMessage#roll", err: Error, data: { command: string }];
      "DefaultTokenConfig#_updateObject": [location: "DefaultTokenConfig#_updateObject", err: Error, data: EmptyObject];
      "SceneConfig#_updateObject": [location: "SceneConfig#_updateObject", err: Error, data: { scene: string }];
      "SidebarDirectory.setupFolders": [location: "SidebarDirectory.setupFolders", err: Error, data: EmptyObject];
      "Sidebar#_render": [location: "Sidebar#_render", err: Error, data: { name: string }];
      "Game#initializeCanvas": [location: "Game#initializeCanvas", err: Error, data: EmptyObject];
      "EmbeddedCollection#_initialize": [
        location: "EmbeddedCollection#_initialize",
        err: Error,
        data: { id: string; documentName: string },
      ];
    }
  }
}
