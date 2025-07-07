import type { AnyArray, Brand, Identity, InexactPartial, IntentionalPartial, PropertiesOfType } from "#utils";
import type { ControlIcon } from "#client/canvas/containers/_module.d.mts";

/**
 * Handle mouse interaction events for a Canvas object.
 * There are three phases of events: hover, click, and drag
 *
 * Hover Events:
 * - _handlePointerOver
 *   - action: hoverIn
 * - _handlePointerOut
 *   - action: hoverOut
 *
 * Left Click and Double-Click
 * - _handlePointerDown
 *   - action: clickLeft
 *   - action: clickLeft2
 *   - action: unclickLeft
 *
 * Right Click and Double-Click
 * - _handleRightDown
 *   - action: clickRight
 *   - action: clickRight2
 *   - action: unclickRight
 *
 * Drag and Drop
 * - _handlePointerMove
 *   - action: dragLeftStart
 *   - action: dragRightStart
 *   - action: dragLeftMove
 *   - action: dragRightMove
 * - _handlePointerUp
 *   - action: dragLeftDrop
 *   - action: dragRightDrop
 * - _handleDragCancel
 *   - action: dragLeftCancel
 *   - action: dragRightCancel
 */
declare class MouseInteractionManager<ObjectFor extends PIXI.Container = PIXI.Container> {
  /**
   * @param object       - The Canvas object (e.g., a Token, Tile, or Drawing) to which mouse events should be bound.
   * @param layer        - The Canvas Layer that contains the object.
   * @param permissions  - An object of permission checks, keyed by action name, which return a boolean or invoke a function for whether the action is allowed. (default: `{}`)
   * @param callbacks    - An object of callback functions, keyed by action name, which will be executed during the event workflow (e.g., `hoverIn`, `clickLeft`). (default: `{}`)
   * @param options      - Additional options that configure interaction behavior. (default: `{}`)
   */
  constructor(
    object: ObjectFor,
    layer: PIXI.Container,
    permissions?: MouseInteractionManager.Permissions,
    callbacks?: MouseInteractionManager.Callbacks,
    options?: MouseInteractionManager.Options<ObjectFor>,
  );

  object: ObjectFor;

  layer: PIXI.Container;

  /**
   * An object of permission checks, keyed by action name, which return a boolean or invoke a function for whether the action is allowed.
   * @defaultValue `{}`
   */
  permissions: MouseInteractionManager.Permissions;

  /**
   * An object of callback functions, keyed by action name, which will be executed during the event workflow (e.g., `hoverIn`, `clickLeft`).
   * @defaultValue `{}`
   */
  callbacks: MouseInteractionManager.Callbacks;

  /**
   * Interaction options which configure handling workflows
   * @defaultValue `{}`
   */
  options: MouseInteractionManager.Options<ObjectFor>;

  /**
   * The current interaction state
   * @defaultValue {@linkcode MouseInteractionManager.INTERACTION_STATES.NONE}
   */
  state: MouseInteractionManager.INTERACTION_STATES;

  /**
   * Bound handlers which can be added and removed
   * @defaultValue `{}`
   */
  interactionData: MouseInteractionManager.InteractionData<ObjectFor>;

  /**
   * The drag handling time
   * @defaultValue `0`
   */
  dragTime: number;

  /**
   * The time of the last left-click event
   * @defaultValue `0`
   */
  lcTime: number;

  /**
   * The time of the last right-click event
   * @defaultValue `0`
   */
  rcTime: number;

  /**
   * A flag for whether we are right-click dragging
   * @defaultValue `false`
   * @internal
   */
  protected _dragRight: boolean;

  /**
   * An optional ControlIcon instance for the object
   */
  controlIcon: MouseInteractionManager.HasControlIcon<ObjectFor>;

  /**
   * The view id pertaining to the PIXI Application.
   * If not provided, default to `canvas.app.view.id`
   * @remarks Despite the above there is actually no opportunity to pass any other value
   */
  viewId: string;

  /**
   * The client position of the last left/right-click.
   */
  lastClick: PIXI.Point;

  /**
   * Enumerate the states of a mouse interaction workflow.
   * 0: NONE - the object is inactive
   * 1: HOVER - the mouse is hovered over the object
   * 2: CLICKED - the object is clicked
   * 3: GRABBED - the object is grabbed
   * 4: DRAG - the object is being dragged
   * 5: DROP - the object is being dropped
   */
  static INTERACTION_STATES: MouseInteractionManager.InteractionStates;

  /**
   * The minimum distance, measured in screen-coordinate pixels, that a pointer must move to initiate a drag operation.
   * This default value can be overridden by specifying the `dragResistance` option when invoking the constructor.
   * @defaultValue `10`
   */
  static DEFAULT_DRAG_RESISTANCE_PX: number;

  /**
   * The maximum number of milliseconds between two clicks to be considered a double-click.
   * @defaultValue `250`
   */
  static DOUBLE_CLICK_TIME_MS: number;

  /**
   * The maximum number of pixels between two clicks to be considered a double-click.
   * @defaultValue `5`
   */
  static DOUBLE_CLICK_DISTANCE_PX: number;

  /**
   * The number of milliseconds of mouse click depression to consider it a long press.
   * @defaultValue `500`
   */
  static LONG_PRESS_DURATION_MS: number;

  /**
   * Global timeout for the long-press event.
   * @defaultValue `null`
   * @remarks Set in `##handleLeftDown` to the return from a `setTimeout` call, which gets cleared by that and various other handlers
   */
  static longPressTimeout: number | null;

  /**
   * Emulate a pointermove event on the main game canvas.
   * This method must be called when an object with the static event mode or any of its parents is transformed
   * or its visibility is changed.
   */
  static emulateMoveEvent(): void;

  /**
   * Get the target.
   */
  get target(): PIXI.DisplayObject;

  /**
   * Is this mouse manager in a dragging state?
   */
  get isDragging(): boolean;

  /**
   * Activate interactivity for the handled object
   */
  activate(): this;

  /**
   * Test whether the current user has permission to perform a step of the workflow
   * @param action - The action being attempted
   * @param event  - The event being handled
   * @returns Can the action be performed?
   */
  can(action: MouseInteractionManager.PermissionAction, event: MouseInteractionManager.Event): boolean;

  /**
   * Execute a callback function associated with a certain action in the workflow
   * @param action - The action being attempted
   * @param event  - The event being handled
   * @param args   - Additional callback arguments.
   * @returns A boolean which may indicate that the event was handled by the callback.
   * Events which do not specify a callback are assumed to have been handled as no-op.
   * @remarks
   */
  callback(action: MouseInteractionManager.Action, event: MouseInteractionManager.Event, ...args: AnyArray): boolean;

  /**
   * A reference to the possible interaction states which can be observed
   */
  get states(): typeof MouseInteractionManager.INTERACTION_STATES;

  /**
   * A reference to the possible interaction states which can be observed
   */
  get handlerOutcomes(): MouseInteractionManager.HandlerOutcomes;

  /**
   * A public method to handle directly an event into this manager, according to its type.
   * Note: drag events are not handled.
   * @returns Has the event been processed?
   *
   * @remarks Note that the event has specific `interactionData` it expects. A valid `event` can be
   * fairly involved to create from scratch.
   */
  handleEvent(event: MouseInteractionManager.Event): boolean;

  /**
   * A public method to cancel a current interaction workflow from this manager.
   * @param event - The event that initiates the cancellation
   *
   * @remarks Note that the event has specific `interactionData` it expects. A valid `event` can be
   * fairly involved to create from scratch.
   */
  cancel(event: MouseInteractionManager.Event): void;

  /**
   * Reset the mouse manager.
   */
  reset(options?: MouseInteractionManager.ResetOptions): void;
}

declare namespace MouseInteractionManager {
  interface Any extends AnyMouseInteractionManager {}
  interface AnyConstructor extends Identity<typeof AnyMouseInteractionManager> {}

  /** @privateRemarks The private class property is `#HANDLER_OUTCOME` singular, but the getter is `handlerOutcomes`, so the brand uses the plural */
  type HANDLER_OUTCOMES = Brand<number, "MouseInteractionManager.HANDLER_OUTCOMES">;

  interface HandlerOutcomes {
    /** -2: SKIPPED - the handler has been skipped by previous logic */
    SKIPPED: -2 & MouseInteractionManager.HANDLER_OUTCOMES;

    /** -1: DISALLOWED - the handler has disallowed further process */
    DISALLOWED: -1 & MouseInteractionManager.HANDLER_OUTCOMES;

    /** 1: REFUSED - the handler callback has been processed and is refusing further process */
    REFUSED: 1 & MouseInteractionManager.HANDLER_OUTCOMES;

    /** 2: ACCEPTED - the handler callback has been processed and is accepting further process */
    ACCEPTED: 2 & MouseInteractionManager.HANDLER_OUTCOMES;
  }

  type INTERACTION_STATES = Brand<number, "MouseInteractionManager.INTERACTION_STATES">;

  interface InteractionStates {
    NONE: 0 & MouseInteractionManager.INTERACTION_STATES;
    HOVER: 1 & MouseInteractionManager.INTERACTION_STATES;
    CLICKED: 2 & MouseInteractionManager.INTERACTION_STATES;
    GRABBED: 3 & MouseInteractionManager.INTERACTION_STATES;
    DRAG: 4 & MouseInteractionManager.INTERACTION_STATES;
    DROP: 5 & MouseInteractionManager.INTERACTION_STATES;
  }

  type HasControlIcon<ObjectFor extends PIXI.Container = PIXI.Container> =
    PropertiesOfType<ObjectFor, ControlIcon> extends undefined ? null : ControlIcon;

  /**
   * @remarks The list of actions provided by foundry, minus `dragXCancel`, `unclickX`, and `longPress`, which do not check permissions
   */
  type PermissionAction =
    | "clickLeft"
    | "clickLeft2"
    | "clickRight"
    | "clickRight2"
    | "dragLeftDrop"
    | "dragLeftMove"
    | "dragLeftStart"
    | "dragRightDrop"
    | "dragRightMove"
    | "dragRightStart"
    | "hoverIn"
    | "hoverOut";

  type PermissionFunction = (user: User.Implementation, event: MouseInteractionManager.Event) => boolean;

  type Permissions = Partial<Record<PermissionAction, PermissionFunction | boolean>>;

  /**
   * @remarks The full list of possible callback actions.
   *
   * Three actions get additional, non-event arguments passed by Foundry:
   * - `hoverIn` on all placeables takes `options: { hoverOutOthers: boolean }` to trigger hover-out behavior on sibling objects
   *   - For Regions specifically, `hoverOut` takes an `options: { updateLegend: boolean }` object, and that key is also added to Region `hoverIn` options
   * - `longPress` receives `origin: PIXI.Point`
   */
  type Action = PermissionAction | "dragLeftCancel" | "dragRightCancel" | "unclickLeft" | "unclickRight" | "longPress";

  /**
   * @remarks Only three actions get additional, non-event arguments passed by Foundry:
   * - `hoverIn` on all placeables takes `options: { hoverOutOthers: boolean }` to trigger hover-out behavior on sibling objects
   *   - For Regions specifically, `hoverOut` takes an `options: { updateLegend: boolean }` object, and that key is also added to Region `hoverIn` options
   * - `longPress` receives `origin: PIXI.Point`
   */
  type CallbackFunction = (event: MouseInteractionManager.Event, ...args: never) => boolean | null | void;

  type Callbacks = IntentionalPartial<Record<Action, CallbackFunction>>;

  /** @internal */
  type _Options<ObjectFor extends PIXI.Container> = InexactPartial<{
    /**
     * If provided, the property name on `object` which references a {@linkcode foundry.canvas.containers.ControlIcon | ControlIcon}.
     * This is used to set {@linkcode MouseInteractionManager.controlIcon | MouseInteractionManager#controlIcon}.
     * @remarks In practice, this should only be `"controlIcon"` or omitted
     */
    target: PropertiesOfType<ObjectFor, ControlIcon>;

    /**
     * A minimum number of pixels the mouse must move before a drag is initiated.
     * @defaultValue {@linkcode MouseInteractionManager.DEFAULT_DRAG_RESISTANCE_PX}
     * @remarks Gets replaced with the above default if falsey when read in `MouseInteractionManager##handlePointerMove`
     */
    dragResistance: number;

    /**
     * A specific PIXI {@linkcode PIXI.Application | Application} to use for pointer event handling. Defaults to
     * {@linkcode foundry.canvas.Canvas.app | canvas.app} if not provided.
     */
    application: PIXI.Application;
  }>;

  /**
   * Interaction options which configure handling workflows
   */
  interface Options<ObjectFor extends PIXI.Container = PIXI.Container> extends _Options<ObjectFor> {}

  /** @internal */
  type _ResetOptions = IntentionalPartial<{
    /**
     * Reset the interaction data?
     * @defaultValue `true`
     */
    interactionData: boolean;

    /**
     * Reset the state?
     * @defaultValue `true`
     */
    state: boolean;
  }>;

  interface ResetOptions extends _ResetOptions {}

  interface InteractionData<T extends PIXI.DisplayObject> {
    origin?: PIXI.Point | undefined;
    destination?: PIXI.Point | undefined;
    object?: T | undefined;
  }

  type Event = foundry.canvas.Canvas.Event._Base | globalThis.Event;
}

export default MouseInteractionManager;

declare abstract class AnyMouseInteractionManager extends MouseInteractionManager {
  constructor(...args: never);
}
