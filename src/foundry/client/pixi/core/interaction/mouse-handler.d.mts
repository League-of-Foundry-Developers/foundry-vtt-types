import type { ValueOf } from "../../../../../types/utils.d.mts";

declare global {
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
   *  action: dragRightStart
   *  action: dragLeftMove
   *  action: dragRightMove
   * _handleMouseUp
   *  action: dragLeftDrop
   *  action: dragRightDrop
   * _handleDragCancel
   *  action: dragLeftCancel
   *  action: dragRightCancel
   *
   * @typeParam Object - The concrete {@link PIXI.Container} object that for which mouse interactions are being managed
   */
  class MouseInteractionManager<Object extends PIXI.Container = PIXI.Container> {
    /**
     * @param permissions - (default: `{}`)
     * @param callbacks   - (default: `{}`)
     * @param options     - (default: `{}`)
     */
    constructor(
      object: PIXI.Container,
      layer: MouseInteractionManager["layer"],
      permissions?: MouseInteractionManager["permissions"],
      callbacks?: MouseInteractionManager["callbacks"],
      options?: MouseInteractionManager["options"],
    );

    object: Object;

    layer: PIXI.Container;

    /**
     * @defaultValue `{}`
     */
    permissions: Partial<
      Record<
        MouseInteractionManager.PermissionAction,
        ((user: Game["user"], event: PIXI.FederatedEvent) => boolean) | boolean
      >
    >;

    /**
     * @defaultValue `{}`
     */
    callbacks: Partial<Record<MouseInteractionManager.Action, ((event: Event | PIXI.FederatedEvent) => void) | null>>;

    /**
     * @defaultValue `{}`
     */
    options: MouseInteractionManager.Options;

    /**
     * The current interaction state
     * @defaultValue `MouseInteractionManager.INTERACTION_STATES.NONE`
     */
    state: ValueOf<(typeof MouseInteractionManager)["INTERACTION_STATES"]>;

    /**
     * Bound handlers which can be added and removed
     * @defaultValue `{}`
     */
    interactionData: {
      origin?: PIXI.Point;
      destination?: PIXI.Point;
      object?: Record<string, unknown>;
    } & Partial<Record<string, unknown>>;

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
     */
    protected _dragRight: boolean;

    /**
     * An optional ControlIcon instance for the object
     */
    controlIcon: ControlIcon | undefined;

    /**
     * The view id pertaining to the PIXI Application.
     * If not provided, default to canvas.app.view.id
     */
    viewId: ControlIcon;

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
     * The number of milliseconds of mouse click depression to consider it a long press.
     * @defaultValue `500`
     */
    static LONG_PRESS_DURATION_MS: number;

    /**
     * Global timeout for the long-press event.
     * @defaultValue `null`
     */
    static longPressTimeout: number | null;

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
    can(action: MouseInteractionManager.PermissionAction, event: Event | PIXI.FederatedEvent): boolean;

    /**
     * Execute a callback function associated with a certain action in the workflow
     * @param action - The action being attempted
     * @param event  - The event being handled
     * @param args   - Additional callback arguments.
     * @returns A boolean which may indicate that the event was handled by the callback.
     *          Events which do not specify a callback are assumed to have been handled as no-op.
     */
    callback(action: MouseInteractionManager.Action, event: Event | PIXI.FederatedEvent, ...args: any[]): boolean;

    /**
     * A reference to the possible interaction states which can be observed
     */
    get states(): (typeof MouseInteractionManager)["INTERACTION_STATES"];

    /**
     * A reference to the possible interaction states which can be observed
     */
    get handlerOutcomes(): ValueOf<MouseInteractionManager.HANDLER_OUTCOME>;

    /**
     * A public method to handle directly an event into this manager, according to its type.
     * Note: drag events are not handled.
     * @returns Has the event been processed?
     */
    handleEvent(event: PIXI.FederatedEvent): boolean;

    /**
     * A public method to cancel a current interaction workflow from this manager.
     * @param event - The event that initiates the cancellation
     */
    cancel(event: PIXI.FederatedEvent): void;

    /**
     * Reset the mouse manager.
     */
    reset(options?: {
      /** Reset the interaction data? */
      interactionData: boolean;

      /** Reset the state? */
      state: boolean;
    }): void;
  }

  namespace MouseInteractionManager {
    /**
     * Enumerate the states of handle outcome.
     */
    interface HANDLER_OUTCOME {
      /** -2: SKIPPED - the handler has been skipped by previous logic */
      SKIPPED: -2;

      /** -1: DISALLOWED - the handler has dissallowed further process */
      DISALLOWED: -1;

      /** 1: REFUSED - the handler callback has been processed and is refusing further process */
      REFUSED: 1;

      /** 2: ACCEPTED - the handler callback has been processed and is accepting further process */
      ACCEPTED: 2;
    }

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
      target?: PIXI.DisplayObject;

      dragResistance?: number;
    }
  }
}
