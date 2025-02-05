import type { Brand, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * Handle mouse interaction events for a Canvas object.
   * There are three phases of events: hover, click, and drag
   *
   * Hover Events:
   * _handlePointerOver
   *  action: hoverIn
   * _handlePointerOut
   *  action: hoverOut
   *
   * Left Click and Double-Click
   * _handlePointerDown
   *  action: clickLeft
   *  action: clickLeft2
   *  action: unclickLeft
   *
   * Right Click and Double-Click
   * _handleRightDown
   *  action: clickRight
   *  action: clickRight2
   *  action: unclickRight
   *
   * Drag and Drop
   * _handlePointerMove
   *  action: dragLeftStart
   *  action: dragRightStart
   *  action: dragLeftMove
   *  action: dragRightMove
   * _handlePointerUp
   *  action: dragLeftDrop
   *  action: dragRightDrop
   * _handleDragCancel
   *  action: dragLeftCancel
   *  action: dragRightCancel
   */
  class MouseInteractionManager<ObjectFor extends PIXI.Container = PIXI.Container> {
    /**
     * @param permissions - (default: `{}`)
     * @param callbacks   - (default: `{}`)
     * @param options     - (default: `{}`)
     * @remarks Foundry does not provide type information for the constructor, everything here is inferred from usage
     */
    constructor(
      object: ObjectFor,
      layer: PIXI.Container,
      permissions?: MouseInteractionManager.Permissions,
      callbacks?: MouseInteractionManager.Callbacks,
      options?: MouseInteractionManager.Options,
    );

    object: ObjectFor;

    layer: PIXI.Container;

    /**
     * @defaultValue `{}`
     */
    permissions: MouseInteractionManager.Permissions;

    /**
     * @defaultValue `{}`
     */
    callbacks: MouseInteractionManager.Callbacks;

    /**
     * @defaultValue `{}`
     */
    options: MouseInteractionManager.Options;

    /**
     * The current interaction state
     * @defaultValue `MouseInteractionManager.INTERACTION_STATES.NONE`
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
     */
    _dragRight: boolean;

    /**
     * An optional ControlIcon instance for the object
     */
    controlIcon: ControlIcon | null;

    /**
     * The view id pertaining to the PIXI Application.
     * If not provided, default to canvas.app.view.id
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
     */
    static longPressTimeout: number | null;

    /**
     * Emulate a pointermove event. Needs to be called when an object with the static event mode
     * or any of its parents is transformed or its visibility is changed.
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
    can(action: MouseInteractionManager.PermissionAction, event: Event | PIXI.FederatedEvent): boolean;

    /**
     * Execute a callback function associated with a certain action in the workflow
     * @param action - The action being attempted
     * @param event  - The event being handled
     * @param args   - Additional callback arguments.
     * @returns A boolean which may indicate that the event was handled by the callback.
     *          Events which do not specify a callback are assumed to have been handled as no-op.
     * @remarks
     */
    callback(action: MouseInteractionManager.Action, event: Event | PIXI.FederatedEvent, ...args: any[]): boolean;

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
    reset(options?: MouseInteractionManager.ResetOptions): void;
  }

  namespace MouseInteractionManager {
    interface Any extends AnyMouseInteractionManager {}
    type AnyConstructor = typeof AnyMouseInteractionManager;

    /** @privateRemarks The private class property is `#HANDLER_OUTCOME` singular, but the getter is `handlerOutcomes`, so the brand uses the plural */
    type HANDLER_OUTCOMES = Brand<number, "MouseInteractionManager.HANDLER_OUTCOMES">;

    interface HandlerOutcomes {
      /** -2: SKIPPED - the handler has been skipped by previous logic */
      SKIPPED: -2 & MouseInteractionManager.HANDLER_OUTCOMES;

      /** -1: DISALLOWED - the handler has dissallowed further process */
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

    type PermissionFunction = (user: User.ConfiguredInstance, event: Event | PIXI.FederatedEvent) => boolean;

    type Permissions = Partial<Record<PermissionAction, PermissionFunction | boolean>>;

    /**
     * @remarks The full list of possible callback actions.
     *
     * Three actions get additional, non-event arguments passed by Foundry:
     * - `hoverIn` on all placeables takes `options: { hoverOutOthers: boolean }` to trigger hover-out behavior on sibling objects
     *   - For Regions specifically, `hoverOut` takes an `options: { updateLegend: boolean }` object, and that key is also added to Region `hoverIn` options
     * - `longPress` receives `origin: PIXI.Point`
     */
    type Action =
      | PermissionAction
      | "dragLeftCancel"
      | "dragRightCancel"
      | "unclickLeft"
      | "unclickRight"
      | "longPress";

    /**
     * @remarks Only three actions get additional, non-event arguments passed by Foundry:
     * - `hoverIn` on all placeables takes `options: { hoverOutOthers: boolean }` to trigger hover-out behavior on sibling objects
     *   - For Regions specifically, `hoverOut` takes an `options: { updateLegend: boolean }` object, and that key is also added to Region `hoverIn` options
     * - `longPress` receives `origin: PIXI.Point`
     */
    type CallbackFunction = (event: Event | PIXI.FederatedEvent, ...args: any[]) => boolean | null | void;

    type Callbacks = Partial<Record<Action, CallbackFunction>>;

    /** @internal */
    type _Options = NullishProps<{
      /**
       * @remarks If passed, will set `this.controlIcon` to `Object[target]`; in practice, this should only be `null` or `"controlIcon"`
       * @privateRemarks Despite Foundry typing this as `PIXI.DisplayObject` its one use in practice is as `string | null`
       */
      target: string | null;

      /**
       * @remarks If falsey, gets replaced with `(canvas.dimensions.size / 4)`
       */
      dragResistance: number;

      /**
       * @remarks Undocumented. Used in the constructor as `this.viewId = (this.options.application ?? canvas.app).view.id`, never passed in practice
       */
      application: PIXI.Application;
    }>;

    /**
     * Interaction options which configure handling workflows
     */
    interface Options extends _Options {}

    /** @internal */
    type _ResetOptions = NullishProps<{
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

    interface InteractionData<T> {
      origin?: PIXI.Point;
      destination?: PIXI.Point;
      object?: T;
    }
  }
}

declare abstract class AnyMouseInteractionManager extends MouseInteractionManager {
  constructor(arg0: never, ...args: never[]);
}
