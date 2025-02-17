import type { Brand, FixedInstanceType, IntentionalPartial, NullishProps } from "fvtt-types/utils";
import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * The Ruler - used to measure distances and trigger movements
   */
  class Ruler extends PIXI.Container {
    /**
     * @param user    - The User for whom to construct the Ruler instance
     *                  (default: `game.user`)
     * @param options - Additional options
     */
    constructor(user?: User.ConfiguredInstance, options?: Ruler.ConstructorOptions);

    /**
     * Record the User which this Ruler references
     * @defaultValue `game.user`
     */
    user: User.ConfiguredInstance;

    /**
     * The ruler name - used to differentiate between players
     * @defaultValue `"Ruler." + user.id`
     */
    name: string;

    /**
     * The ruler color - by default the color of the active user
     * @defaultValue `this.user.color`
     */
    color: Color;

    /**
     * The Ruler element is a Graphics instance which draws the line and points of the measured path
     */
    ruler: PIXI.Graphics;

    /**
     * The Labels element is a Container of Text elements which label the measured path
     */
    labels: PIXI.Container;

    /**
     * The possible Ruler measurement states.
     */
    static get STATES(): Ruler.States;

    /**
     * Is the ruler ready for measure?
     */
    static get canMeasure(): boolean;

    /**
     * The current destination point at the end of the measurement
     * @defaultValue `null`
     */
    destination: Canvas.Point | null;

    /**
     * The origin point of the measurement, which is the first waypoint.
     * @defaultValue `null`
     */
    get origin(): Canvas.Point | null;

    /**
     * This Array tracks individual waypoints along the ruler's measured path.
     * The first waypoint is always the origin of the route.
     * @defaultValue `[]`
     */
    waypoints: Canvas.Point[];

    /**
     * The array of most recently computed ruler measurement segments
     * @defaultValue `[]`
     */
    segments: Ruler.MeasurementSegment[];

    /**
     * The measurement history.
     */
    get history(): Ruler.MeasurementHistory;

    /**
     * The computed total distance of the Ruler.
     * @defaultValue `0`
     */
    totalDistance: number;

    /**
     * The computed total cost of the Ruler.
     * @defaultValue `0`
     */
    totalCost: number;

    /**
     * The current state of the Ruler (one of {@link Ruler.States}).
     */
    get state(): Ruler.STATES;

    /**
     * The current state of the Ruler (one of {@link Ruler.States}).
     * @defaultValue `Ruler.STATES.INACTIVE`
     */
    protected _state: Ruler.STATES;

    /**
     * Is the Ruler being actively used to measure distance?
     */
    get active(): boolean;

    /**
     * Get a GridHighlight layer for this Ruler
     */
    get highlightLayer(): GridHighlight;

    /**
     * The Token that is moved by the Ruler.
     */
    get token(): Token.ConfiguredInstance | null;

    /**
     * Clear display of the current Ruler
     */
    clear(): void;

    /**
     * Measure the distance between two points and render the ruler UI to illustrate it
     * @param destination - The destination point to which to measure
     * @param options     - Additional options
     * @returns The array of measured segments if measured
     */
    measure(destination: Canvas.Point, options?: Ruler.MeasureOptions): Ruler.MeasurementSegment[] | void;

    /**
     * Get the measurement origin.
     * @param point   - The waypoint
     * @param options - Additional options
     */
    protected _getMeasurementOrigin(point: Canvas.Point, options?: Ruler.GetMeasurementOriginOptions): Canvas.Point;

    /**
     * While measurement is in progress, update the destination to be the central point of the target grid space.
     * @param point   - The point coordinates
     * @param options - Additional options
     * @returns The snapped destination point
     */
    protected _getMeasurementDestination(
      point: Canvas.Point,
      options?: Ruler.GetMeasurementDestinationOptions,
    ): Canvas.Point;

    /**
     * Translate the waypoints and destination point of the Ruler into an array of Ray segments.
     * @returns The segments of the measured path
     */
    protected _getMeasurementSegments(): Ruler.MeasurementSegment[];

    /**
     * Handle the start of a Ruler measurement workflow
     * @param origin  - The origin
     * @param options - Additional options
     */
    protected _startMeasurement(origin: Canvas.Point, options?: Ruler.StartMeasurementOptions): void;

    /**
     * Handle the conclusion of a Ruler measurement workflow
     */
    protected _endMeasurement(): void;

    /**
     * Handle the addition of a new waypoint in the Ruler measurement path
     * @param point   - The waypoint
     * @param options - Additional options
     */
    protected _addWaypoint(point: Canvas.Point, options?: Ruler.AddWaypointOptions): void;

    /**
     * Handle the removal of a waypoint in the Ruler measurement path
     */
    protected _removeWaypoint(): void;

    /**
     * Get the cost function to be used for Ruler measurements.
     * @remarks Just a stub in v12.331
     */
    protected _getCostFunction(): foundry.grid.BaseGrid.MeasurePathCostFunction | void;

    /**
     * Compute the distance of each segment and the total distance of the measured path.
     */
    protected _computeDistance(): void;

    /**
     * Get the text label for a segment of the measured path
     */
    protected _getSegmentLabel(segment: Ruler.PartialSegmentForLabelling): string;

    /**
     * Draw each segment of the measured path.
     */
    protected _drawMeasuredPath(): void;

    /**
     * Highlight the measurement required to complete the move in the minimum number of discrete spaces
     */
    protected _highlightMeasurementSegment(segment: Ruler.PartialSegmentForHighlighting): void;

    /**
     * Determine whether a SPACE keypress event entails a legal token movement along a measured ruler
     *
     * @returns An indicator for whether a token was successfully moved or not. If True the event should be
     *          prevented from propagating further, if False it should move on to other handlers.
     */
    moveToken(): Promise<boolean>;

    /**
     * Acquire a Token, if any, which is eligible to perform a movement based on the starting point of the Ruler
     * @param origin - The origin of the Ruler
     * @returns The Token that is to be moved, if any
     *
     */
    protected _getMovementToken(origin: Canvas.Point): Token.ConfiguredInstance | null;

    /**
     * Get the current measurement history.
     * @returns The current measurement history, if any
     * @remarks Just a stub in v12.331
     */
    protected _getMeasurementHistory(): Ruler.MeasurementHistory | void;

    /**
     * Create the next measurement history from the current history and current Ruler state.
     * @returns The next measurement history
     */
    protected _createMeasurementHistory(): Ruler.MeasurementHistory;

    /**
     * Test whether a Token is allowed to execute a measured movement path.
     * @param token - The Token being tested
     * @returns Whether the movement is allowed
     * @throws  A specific Error message used instead of returning false
     */
    protected _canMove(token: Token.ConfiguredInstance): boolean;

    /**
     * Animate piecewise Token movement along the measured segment path.
     * @param token - The Token being animated
     * @returns A Promise which resolves once all animation is completed
     */
    protected _animateMovement(token: Token.ConfiguredInstance): Promise<void>;

    /**
     * Update Token position and configure its animation properties for the next leg of its animation.
     * @param token         - The Token being updated
     * @param segment       - The measured segment being moved
     * @param destination   - The adjusted destination coordinate
     * @param updateOptions - Additional options to configure the `TokenDocument` update
     * @returns A Promise that resolves once the animation for this segment is done
     */
    protected _animateSegment(
      token: Token.ConfiguredInstance,
      segment: Ruler.PartialSegmentForAnimating,
      destination: Canvas.Point,
      updateOptions: Ruler.PartialTokenUpdateOptions,
    ): Promise<void>;

    /**
     * An method which can be extended by a subclass of Ruler to define custom behaviors before a confirmed movement.
     * @param token - The Token that will be moving
     */
    protected _preMove(token: Token.ConfiguredInstance): Promise<void>;

    /**
     * An event which can be extended by a subclass of Ruler to define custom behaviors before a confirmed movement.
     * @param token - The Token that finished moving
     */
    protected _postMove(token: Token.ConfiguredInstance): Promise<void>;

    /**
     * Broadcast Ruler measurement if its User is the connected client.
     * The broadcast is throttled to 100ms.
     */
    protected _broadcastMeasurement(): void;

    /**
     * Package Ruler data to an object which can be serialized to a string.
     */
    protected _getMeasurementData(): Ruler.MeasurementData;

    /**
     * Update a Ruler instance using data provided through the cursor activity socket
     * @param data - Ruler data with which to update the display
     */
    update(data?: Ruler.MeasurementData | null): void;

    /**
     * Handle the beginning of a new Ruler measurement workflow
     * @param event - The drag start event
     * @see Canvas.#onDragLeftStart
     */
    protected _onDragStart(event: PIXI.FederatedEvent): void;

    /**
     * Handle left-click events on the Canvas during Ruler measurement.
     * @param event - The pointer-down event
     * @see Canvas._onClickLeft
     */
    protected _onClickLeft(event: PIXI.FederatedEvent): void;

    /**
     * Handle right-click events on the Canvas during Ruler measurement.
     * @param event - The pointer-down event
     * @see Canvas._onClickRight
     */
    protected _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * Continue a Ruler measurement workflow for left-mouse movements on the Canvas.
     * @param event - The mouse move event
     * @see Canvas.#onDragLeftMove
     */
    protected _onMouseMove(event: PIXI.FederatedEvent): void;

    /**
     * Conclude a Ruler measurement workflow by releasing the left-mouse button.
     * @param event - The pointer-up event
     * @see Canvas.#onDragLeftDrop
     */
    protected _onMouseUp(event: PIXI.FederatedEvent): void;

    /**
     * Move the Token along the measured path when the move key is pressed.
     * @remarks `context` is unused in 12.331
     */
    protected _onMoveKeyDown(context: KeyboardManager.KeyboardEventContext): void;
  }

  namespace Ruler {
    interface Any extends AnyRuler {}
    type AnyConstructor = typeof AnyRuler;

    type ConfiguredClass = CONFIG["Canvas"]["rulerClass"];
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

    /** @internal */
    type _ConstructorOptions = NullishProps<{
      /**
       * The color of the ruler (defaults to the color of the User)
       * @defaultValue `this.user.color`
       */
      color?: number;
    }>;

    interface ConstructorOptions extends _ConstructorOptions {}

    type STATES = Brand<number, "Ruler.STATES">;

    interface States {
      readonly INACTIVE: 0 & STATES;
      readonly STARTING: 1 & STATES;
      readonly MEASURING: 2 & STATES;
      readonly MOVING: 3 & STATES;
    }

    interface MeasurementSegment {
      /** The Ray which represents the point-to-point line segment */
      ray: Ray;

      teleport: boolean;

      /** The text object used to display a label for this segment */
      label: PreciseText;

      /** The measured distance of the segment */
      distance: number;

      /** The measured cost of the segment */
      cost: number;

      /** The cumulative measured distance of this segment and the segments before it */
      cumulativeDistance: number;

      /** The cumulative measured cost of this segment and the segments before it */
      cumulativeCost: number;

      /** Is this segment part of the measurement history? */
      history: boolean;

      /** Is this segment the first one after the measurement history? */
      first: boolean;

      /** Is this segment the last one? */
      last: boolean;

      /** Animation options passed to {@link TokenDocument#update} */
      animation: Document.Database.OperationOf<"Token", "update">["animation"];
    }

    interface MeasurementHistoryWaypoint {
      /** The x-coordinate of the waypoint */
      x: number;

      /** The y-coordinate of the waypoint */
      y: number;

      /** Teleported to from the previous waypoint this waypoint? */
      teleport: boolean;

      /** The cost of having moved from the previous waypoint to this waypoint */
      cost: number;
    }

    type MeasurementHistory = MeasurementHistoryWaypoint[];

    interface MeasurementData {
      /** The state ({@link Ruler#state}) */
      state: Ruler.STATES;

      /** The token ID ({@link Ruler#token}) */
      token: string | null;

      /** The measurement history ({@link Ruler#history}) */
      history: MeasurementHistory;

      /** The waypoints ({@link Ruler#waypoints}) */
      waypoints: Canvas.Point[];

      /** The destination ({@link Ruler#destination}) */
      destination: Canvas.Point | null;
    }

    /** @internal */
    type _Snap = NullishProps<{
      /**
       * Snap the destination?
       * @defaultValue `true`
       */
      snap: boolean;
    }>;

    /** @internal */
    type _MeasureOptions = NullishProps<{
      /**
       * If not forced and the destination matches the current destination of this ruler, no measuring is done and nothing is returned
       * @defaultValue `false`
       */
      force: boolean;
    }>;

    interface MeasureOptions extends _Snap, _MeasureOptions {}

    interface GetMeasurementOriginOptions extends _Snap {}

    interface GetMeasurementDestinationOptions extends _Snap {}

    /** @internal */
    type _StartMeasurementOptions = NullishProps<{
      /**
       * The token that is moved (defaults to {@link Ruler#_getMovementToken})
       */
      token: Token.ConfiguredInstance | null;
    }>;

    interface StartMeasurementOptions extends _StartMeasurementOptions, _Snap {}

    interface AddWaypointOptions extends _Snap {}

    // TODO: revisit after docs v2
    type PartialTokenUpdateOptions = IntentionalPartial<Document.Database.OperationOf<"Token", "update">>;

    // TODO: also revisit after docs v2 merges with new and improved IntentionalPartial
    interface PartialSegmentForLabelling
      extends Pick<MeasurementSegment, "teleport" | "last" | "distance">,
        IntentionalPartial<Omit<MeasurementSegment, "teleport" | "last" | "distance">> {}

    interface PartialSegmentForHighlighting
      extends Pick<MeasurementSegment, "teleport" | "ray">,
        IntentionalPartial<Omit<MeasurementSegment, "teleport" | "ray">> {}

    interface PartialSegmentForAnimating
      extends Pick<MeasurementSegment, "teleport" | "animation">,
        IntentionalPartial<Omit<MeasurementSegment, "teleport" | "animation">> {}
  }
}

declare abstract class AnyRuler extends Ruler {
  constructor(arg0: never, ...args: never[]);
}
