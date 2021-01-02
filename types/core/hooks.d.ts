/**
 * This namespace contains typescript specific type definitions for the
 * {@link Hooks} callback functions. It contains a general type
 * ({@link HooksCallbacks.Generic}) for callback functions and additionally
 * constants (where applicable) and types for other Hooks callbacks. Some hooks
 * do not have constants for their names, because the names are dynamically
 * generated at runtime. Callback types returning `void` are called by
 * {@link Hooks.callAll} and do not care about the return value of the callback.
 * Callback types returning `boolean` are called with {@link Hooks.call} and do
 * care about the return value and will stop executing remaining callbacks if
 * `false` is returned.
 * @example Using a callback type as type specifier
 * ```typescript
 * let foo: HooksCallbacks.UpdateWorldTime = (worldTime: number, dt: number) => {
 *   // [...]
 * }
 * Hooks.on('updateWorldTime', foo)
 * ```
 * @example Using a callback type as type assertion
 * ```typescript
 * Hooks.on(
 *   'updateWorldTime',
 *   ((worldTime: number, dt: number) => {
 *     // [...]
 *   }) as HooksCallbacks.UpdateWorldTime
 * )
 * ```
 */
declare namespace HooksCallbacks {
  /**
   * Called before the {@link Canvas} is drawn.
   * @param canvas - the Canvas
   * @remarks The name is 'canvasInit'.
   * @see {@link Canvas#draw}
   */
  type CanvasInit = (canvas: Canvas) => void

  /**
   * Called when the {@link Canvas} is panned. When called during animated
   * panning, the callback is called on every tick.
   * @param canvas - the Canvas
   * @param view - the CanvasView
   * @remarks The name is 'canvasPan'.
   * @see {@link Canvas#pan}
   * @see {@link Canvas#animatePan}
   */
  type CanvasPan = (canvas: Canvas, view: CanvasView) => void

  /**
   * Called after the {@link SceneNavigation} is expanded or collapsed.
   * @param nav - the SceneNavigation
   * @param collapsed - whether the navigation is collapsed
   * @remarks The name is 'collapseSceneNavigation'.
   * @see {@link SceneNavigation#expand}
   * @see {@link SceneNavigation#collapse}
   */
  type CollapseSceneNavigation =
    (nav: SceneNavigation, collapsed: boolean) => void

  /**
   * Called after assuming or releasing control over a {@link PlaceableObject}.
   * @param object - the PlaceableObject
   * @param controlled - whether the PlaceableObject is controlled
   * @remarks The name for this hook is dynamically created by joining 'control'
   * and the type name of the PlaceableObject.
   * @see {@link PlaceableObject#control}
   * @see {@link PlaceableObject#release}
   */
  type ControlPlaceableObject =
    (object: PlaceableObject, controlled: boolean) => void

  /**
   * Called after creating an embedded {@link Entity}.
   * @param parent - the parent of the created Entity
   * @param data - the data for the created entity
   * @param options - additional options passed in the create request
   * @param userId - the ID of the requesting user
   * @typeParam T - the type of the created Entity data
   * @remarks The name for this hook is dynamically created by joining 'create'
   * with the name of the Entity type.
   * @see {@link Entity#_handleCreateEmbeddedEntity}
   */
  type CreateEmbeddedEntity<T> = (
    parent: Entity,
    data: T,
    options: EntityCreateOptions,
    userId: number
  ) => void

  /**
   * Called after creating an {@link Entity}.
   * @param entity - the created Entity
   * @param options - additional options passed in the create request
   * @param userId - the ID of the requesting user
   * @remarks The name for this hook is dynamically created by joining 'create'
   * with the name of the Entity type.
   * @see {@link Entity#_handleCreate}
   */
  type CreateEntity =
    (entity: Entity, options: EntityCreateOptions, userId: number) => void

  /**
   * Called after deleting an embedded {@link Entity}.
   * @param parent - the parent of the deleted Entity
   * @param entity - the deleted Entity
   * @param options - additional options passed in the delete request
   * @param userId - the ID of the requesting user
   * @remarks The name for this hook is dynamically created by joining 'delete'
   * with the name of the Entity type.
   * @see {@link Entity#_handleDeleteEmbeddedEntity}
   */
  type DeleteEmbeddedEntity = (
    parent: Entity,
    entity: Entity,
    options: EntityDeleteOptions,
    userId: number
  ) => void

  /**
   * Called after deleting an {@link Entity}.
   * @param entity - the deleted Entity
   * @param options - additional options passed in the delete request
   * @param userId - the ID of the requesting user
   * @remarks The name for this hook is dynamically created by joining 'delete'
   * with the name of the Entity type.
   * @see {@link Entity#_handleDelete}
   */
  type DeleteEntity =
    (entity: Entity, options: EntityDeleteOptions, userId: number) => void

  /**
   * A general type for the Hooks callback functions. The parameters differ,
   * depending on the hook. Have a look at the more specific types.
   * @param args - The arguments passed to the callback
   * @returns Whether additional callbacks should be called after this
   */
  type General = (...args: any[]) => any

  /**
   * Called after the initial {@link SceneControls} have been set up.
   * @param controls - The created controls
   * @remarks The name is 'getSceneControlButtons'.
   * @see {@link SceneControls#_getControlButtons}
   */
  type GetSceneControlButtons = (controls: SceneControl[]) => void

  /**
   * Called when the user mouse is entering or leaving a hover state over a
   * {@link PlaceableObject}.
   * @param object - the PlaceableObject
   * @param hover - whether the mouse is hovering over the PlaceableObject
   * @remarks The name for this hook is dynamically created by joining 'hover'
   * and the type name of the PlaceableObject.
   * @see {@link PlaceableObject#_onHoverIn}
   * @see {@link PlaceableObject#_onHoverOut}
   */
  type HoverPlaceableObject =
    (object: PlaceableObject, hover: boolean) => void

  /**
   * Called before the {@link Game} is initialized for the current window
   * location.
   * @remarks The name is 'init'.
   * @see {@link Game#initialize}
   */
  type Init = () => void

  /**
   * Called when initializing shaders for a {@link PointSource}.
   * @param pointSource - the PointSource to initialize shaders for
   * @param animationType - a key used in `CONFIG.Canvas.lightAnimations`
   * @remarks The name is 'initializePointSourceShaders'.
   * @see {@link PointSource#_initializeShaders}
   */
  type InitializePointSourceShaders = (
    pointSource: PointSource,
    animationType: string
  ) => void

  /**
   * Called after refreshing the {@link LightingLayer}.
   * @param layer - the LightingLayer
   * @see {@link LightingLayer#refresh}
   */
  type LightingRefresh = (lighting: LightingLayer) => void

  /**
   * Called after the {@link Game} pause is toggled
   * @param paused - the new paused value of the Game
   * @remarks The name is 'pauseGame'.
   * @see {@link Game#togglePause}
   */
  type PauseGame = (paused: boolean) => void

  /**
   * Called after the {@link Game} is fully set up.
   * @remarks The name is 'ready'.
   * @see {@link Game#setupGame}
   */
  type Ready = () => void

  /**
   * Called after {@link AVSettings} are changed.
   * @param settings - the AVSettings
   * @param changed - an object reflecting the changed settings
   * @see {@link AVSettings#_onSettingsChanged}
   */
  type RtcSettingsChanged = (settings: AVSettings, changed: object) => void

  /**
   * Called before the {@link Game} is fully set up.
   * @remarks The name is 'setup'.
   * @see {@link Game#setupGame}
   */
  type Setup = () => void

  /**
   * Called when expanding or collapsing a {@link Sidebar}.
   * @param sidebar - the Sidebar
   * @param collapsed - whether the Sidebar is collapsed
   * @remarks The name is 'sidebarCollapse'.
   * @see {@link Sidebar#expand}
   * @see {@link Sidebar#collapse}
   */
  type SidebarCollapse = (sidebar: Sidebar, collapsed: boolean) => void

  /**
   * Called after refreshing the {@link SightLayer}.
   * @param layer - the SightLayer
   * @see {@link SightLayer#restrictVisibility}
   */
  type SightRefresh = (layer: SightLayer) => void

  /**
   * Called after the targeted state for a {@link Token} changed.
   * @param user - the User that caused the targeted state change
   * @param token - the Token for which the targeted state changed
   * @param targeted - whether the Token is targeted
   * @remarks The name is 'targetToken'.
   * @see {@link UserTargets#_hook}
   */
  type TargetToken = (user: User, token: Token, targeted: boolean) => void

  /**
   * Called after updating an embedded {@link Entity}.
   * @param parent - the parent of the updated Entity
   * @param entity - the updated Entity
   * @param data - the updated Entity data
   * @param options - additional options passed in the update request
   * @param userId - the ID of the requesting user
   * @typeParam T - the type of the updated Entity data
   * @remarks The name for this hook is dynamically created by joining 'update'
   * with the name of the Entity type.
   * @see {@link Entity#_handleUpdateEmbeddedEntity}
   */
  type UpdateEmbeddedEntity<T> = (
    parent: Entity,
    entity: Entity,
    data: T,
    options: EntityUpdateOptions,
    userId: number
  ) => void

  /**
   * Called after updating an {@link Entity}.
   * @param entity - the updated Entity
   * @param data - the updated Entity data
   * @param options - additional options passed in the update request
   * @param userId - the ID of the requesting user
   * @typeParam T - the type of the updated Entity data
   * @remarks The name for this hook is dynamically created by joining 'update'
   * with the name of the Entity type.
   * @see {@link Entity#_handleUpdate}
   */
  type UpdateEntity<T> = (
    entity: Entity,
    data: T,
    options: EntityUpdateOptions,
    userId: number
  ) => void

  /**
   * Called when the official world time changes.
   * @param worldTime - the new world time
   * @param dt - the time advance delta, in seconds
   * @remarks The name is 'updateWorldTime'.
   * @see {@link GameTime#onUpdateWorldTime}
   */
  type UpdateWorldTime = (worldTime: number, dt: number) => void
}

/**
 * A simple event framework used throughout Foundry Virtual Tabletop.
 * When key actions or events occur, a "hook" is defined where user-defined
 * callback functions can execute.
 * This class manages the registration and execution of hooked callback
 * functions.
 */
declare class Hooks {
  /**
   * @defaultValue `{}`
   * @internal
   */
  _hooks: object

  /**
   * @defaultValue `1`
   * @internal
   */
  _id: number

  /**
   * @defaultValue `{}`
   * @internal
   */
  _ids: object

  /**
   * @defaultValue `[]`
   * @internal
   */
  _once: HooksCallbacks.General[]

  /**
   * Call a hooked function using provided arguments and perhaps unregister it.
   * @internal
   */
  static _call (
    hook: string,
    fn: HooksCallbacks.General,
    ...args: any[]
  ): boolean

  /**
   * Call hook listeners in the order in which they were registered.
   * Continue calling hooks until either all have been called or one returns
   * `false`.
   * Hook listeners which return `false` denote that the original event has been
   * adequately handled and no further hooks should be called.
   * @param hook - The hook being triggered
   * @param args - Arguments passed to the hook callback functions
   */
  static call (hook: string, ...args: any[]): boolean

  /**
   * Call all hook listeners in the order in which they were registered
   * Hooks called this way can not be handled by returning false and will always
   * trigger every hook callback.
   * @param hook - The hook being triggered
   * @param args - Arguments passed to the hook callback functions
   */
  static callAll (hook: string, ...args: any[]): boolean | null

  /**
   * Unregister a callback handler for a particular hook event
   * @param hook - The unique name of the hooked event
   * @param fn - The function, or ID number for the function, that should be
   *             turned off
   */
  static off (hook: string, fn: number | HooksCallbacks.General): void

  /**
   * Register a callback handler which should be triggered when a hook is
   * triggered.
   * @param hook - The unique name of the hooked event
   * @param fn - The callback function which should be triggered when the hook
   *             event occurs
   * @returns An ID number of the hooked function which can be used to turn off
   *          the hook later
   */
  static on (hook: string, fn: HooksCallbacks.General): number

  /**
   * Register a callback handler for an event which is only triggered once the
   * first time the event occurs.
   * After a "once" hook is triggered the hook is automatically removed.
   * @param hook - The unique name of the hooked event
   * @param fn - The callback function which should be triggered when the hook
   *             event occurs
   * @returns An ID number of the hooked function which can be used to turn off
   *          the hook later
   */
  static once (hook: string, fn: HooksCallbacks.General): number
}
