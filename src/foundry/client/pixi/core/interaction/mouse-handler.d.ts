/**
 * Handle mouse interaction events for a Canvas object.
 * There are three phases of events: hover, click, and drag
 *
 * Hover Events:
 * _handleMouseOver
 *  action: hoverIn
 * _handleMouseOut
 *  action: hoverOut
 *
 * Left Click and Double-Click
 * _handleMouseDown
 *  action: clickLeft
 *  action: clickLeft2
 *
 * Right Click and Double-Click
 * _handleRightDown
 *  action: clickRight
 *  action: clickRight2
 *
 * Drag and Drop
 * _handleMouseMove
 *  action: dragLeftStart
 *  action: dragLeftMove
 *  action: dragRightStart
 *  action: dragLeftMove
 * _handleMouseUp
 *  action: dragLeftDrop
 *  action: dragRightDrop
 * _handleDragCancel
 *  action: dragLeftCancel
 *  action: dragRightCancel
 *
 * @typeParam Object - The concrete {@link PIXI.Container} object that for which mouse interactions are being managed
 */
declare class MouseInteractionManager<Object extends PIXI.Container = PIXI.Container> {
  /**
   * @param permissions - (default: `{}`)
   * @param callbacks   - (default: `{}`)
   * @param options     - (default: `{}`)
   */
  constructor(
    object: Object,
    layer: MouseInteractionManager["layer"],
    permissions?: MouseInteractionManager["permissions"],
    callbacks?: MouseInteractionManager["callbacks"],
    options?: MouseInteractionManager["options"]
  );

  object: Object;

  layer: PIXI.Container;

  /**
   * @defaultValue `{}`
   */
  permissions: Partial<
    Record<
      MouseInteractionManager.PermissionAction,
      ((user: Game["user"], event: PIXI.InteractionEvent) => boolean) | boolean
    >
  >;

  /**
   * @defaultValue `{}`
   */
  callbacks: Partial<Record<MouseInteractionManager.Action, ((event: Event | PIXI.InteractionEvent) => void) | null>>;

  /**
   * @defaultValue `{}`
   */
  options: MouseInteractionManager.Options;

  /**
   * The current interaction state
   * @defaultValue `MouseInteractionManager.INTERACTION_STATES.NONE`
   */
  state: ValueOf<typeof MouseInteractionManager["INTERACTION_STATES"]>;

  /**
   * Bound handlers which can be added and removed
   * @defaultValue `{}`
   */
  handlers: Partial<
    Record<
      "contextmenu" | "mousedown" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "rightdown",
      (event: PIXI.InteractionEvent | MouseEvent) => void
    >
  >;

  /**
   * The drag handling time
   * @defaultValue `0`
   */
  dragTime: number;

  /**
   * The throttling time below which a mouse move event will not be handled
   * @defaultValue `Math.ceil(1000 / (canvas.app.ticker.maxFPS || 60));`
   * @internal
   */
  protected _dragThrottleMS: number;

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
   */
  protected _dragRight: boolean;

  /**
   * An optional ControlIcon instance for the object
   */
  controlIcon: ControlIcon | undefined;

  /**
   * Enumerate the states of a mouse interaction workflow.
   * 0: NONE - the object is inactive
   * 1: HOVER - the mouse is hovered over the object
   * 2: CLICKED - the object is clicked
   * 3: DRAG - the object is being dragged
   * 4: DROP - the object is being dropped
   */
  static INTERACTION_STATES: {
    NONE: 0;
    HOVER: 1;
    CLICKED: 2;
    DRAG: 3;
    DROP: 4;
  };

  /**
   * Get the target
   */
  get target(): PIXI.Container;

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
  can(action: MouseInteractionManager.PermissionAction, event: Event | PIXI.InteractionEvent): boolean;

  /**
   * Execute a callback function associated with a certain action in the workflow
   * @param action - The action being attempted
   * @param event  - The event being handled
   */
  callback(action: MouseInteractionManager.Action, event: Event | PIXI.InteractionEvent): unknown;

  /**
   * A reference to the possible interaction states which can be observed
   */
  get states(): typeof MouseInteractionManager["INTERACTION_STATES"];

  /**
   * Activate a set of listeners which handle hover events on the target object
   * @internal
   */
  protected _activateHoverEvents(): void;

  /**
   * Activate a new set of listeners for click events on the target object
   * @internal
   */
  protected _activateClickEvents(): void;

  /**
   * Deactivate event listeners for click events on the target object
   * @internal
   */
  protected _deactivateClickEvents(): void;

  /**
   * Activate events required for handling a drag-and-drop workflow
   * @internal
   */
  protected _activateDragEvents(): void;

  /**
   * Deactivate events required for handling drag-and-drop workflow.
   * @internal
   */
  protected _deactivateDragEvents(): void;

  /**
   * Handle mouse-over events which activate downstream listeners and do not stop propagation.
   * @internal
   */
  protected _handleMouseOver(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle mouse-out events which terminate hover workflows and do not stop propagation.
   * @internal
   */
  protected _handleMouseOut(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle mouse-down events which activate downstream listeners.
   * Stop further propagation only if the event is allowed by either single or double-click.
   * @internal
   */
  protected _handleMouseDown(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle mouse-down which trigger a single left-click workflow.
   * @internal
   */
  protected _handleClickLeft(event: PIXI.InteractionEvent): void;

  /**
   * Handle mouse-down which trigger a single left-click workflow.
   * @internal
   */
  protected _handleClickLeft2(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle right-click mouse-down events.
   * Stop further propagation only if the event is allowed by either single or double-click.
   * @internal
   */
  protected _handleRightDown(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle single right-click actions.
   * @internal
   */
  protected _handleClickRight(event: PIXI.InteractionEvent): void;

  /**
   * Handle double right-click actions.
   * @internal
   */
  protected _handleClickRight2(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle mouse movement during a drag workflow
   * @internal
   */
  protected _handleMouseMove(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle the beginning of a new drag start workflow, moving all controlled objects on the layer
   * @internal
   */
  protected _handleDragStart(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle the continuation of a drag workflow, moving all controlled objects on the layer
   * @internal
   */
  protected _handleDragMove(event: PIXI.InteractionEvent): unknown;

  /**
   * Handle mouse up events which may optionally conclude a drag workflow
   * @internal
   */
  protected _handleMouseUp(event: PIXI.InteractionEvent): void;

  /**
   * Handle the conclusion of a drag workflow, placing all dragged objects back on the layer
   * @internal
   */
  protected _handleDragDrop(event: PIXI.InteractionEvent): void;

  /**
   * Handle the cancellation of a drag workflow, resetting back to the original state
   * @internal
   */
  protected _handleDragCancel(event: MouseEvent): void;

  /**
   * A public method to cancel a current interaction workflow from this manager.
   * @param event - The event that initiates the cancellation
   */
  cancel(event: Event): void;
}

declare namespace MouseInteractionManager {
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

  type Action = PermissionAction | "dragLeftCancel" | "dragRightCancel";

  interface Options {
    /**
     * @remarks If set, this must be the name of a property of the object that is a {@link PIXI.Container}.
     */
    target?: string | null;

    dragResistance?: number;
  }
}

declare const a: PIXI.Container;
