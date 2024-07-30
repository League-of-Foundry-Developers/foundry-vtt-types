import type { InexactPartial, ValueOf } from "../../../../../types/utils.d.mts";

declare global {
  interface RulerMeasurementSegment {
    /** The Ray which represents the point-to-point line segment */
    ray: Ray;

    /** The text object used to display a label for this segment */
    label: PreciseText;

    /** The measured distance of the segment */
    distance: number;

    /** The string text displayed in the label */
    text: string;

    /** Is this segment the last one? */
    last: boolean;
  }

  interface RulerData {
    /** The ruler measurement state. */
    _state: Ruler["_state"];

    /** A unique name for the ruler containing the owning user's ID. */
    name: string;

    /** The current point the ruler has been extended to. */
    destination: PIXI.Point;

    /** The class name of this ruler instance. */
    class: string;

    /** Additional waypoints along the ruler's length, including the starting point. */
    waypoints: PIXI.Point[];
  }

  /**
   * The Ruler - used to measure distances and trigger movements
   */
  class Ruler extends PIXI.Container {
    /**
     * @param user  - The User for whom to construct the Ruler instance
     * @param color - (default: `null`)
     */
    constructor(user?: User.ConfiguredInstance | null, { color }?: { color?: number | null });

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
     * @defaultValue `foundry.utils.colorStringToHex(this.user.data.color) || 0x42F4E2`
     */
    color: Color;

    /**
     * This Array tracks individual waypoints along the ruler's measured path.
     * The first waypoint is always the origin of the route.
     * @defaultValue `[]`
     */
    waypoints: PIXI.Point[];

    /**
     * The Ruler element is a Graphics instance which draws the line and points of the measured path
     */
    ruler: PIXI.Graphics;

    /**
     * The Labels element is a Container of Text elements which label the measured path
     */
    labels: PIXI.Container;

    /**
     * Track the current measurement state
     * @defaultValue `Ruler.STATES.INACTIVE`
     */
    protected _state: ValueOf<(typeof Ruler)["STATES"]>;

    /**
     * The current destination point at the end of the measurement
     * @defaultValue `{x: undefined, y: undefined}`
     */
    destination: PIXI.Point | null;

    /**
     * The array of most recently computed ruler measurement segments
     */
    segments: RulerMeasurementSegment[];

    /**
     * The computed total distance of the Ruler.
     */
    totalDistance: number;

    /**
     * An enumeration of the possible Ruler measurement states.
     */
    static STATES: {
      INACTIVE: 0;
      STARTING: 1;
      MEASURING: 2;
      MOVING: 3;
    };

    /**
     * Is the ruler ready for measure?
     */
    static get canMeasure(): boolean;

    /**
     * Is the Ruler being actively used to measure distance?
     */
    get active(): boolean;

    /**
     * Get a GridHighlight layer for this Ruler
     */
    get highlightLayer(): GridHighlight;

    /**
     * Clear display of the current Ruler
     */
    clear(): void;

    /**
     * Measure the distance between two points and render the ruler UI to illustrate it
     * @param destination - The destination point to which to measure
     */
    measure(
      destination: Point,
      {
        gridSpaces,
        force,
      }?: InexactPartial<{
        /**
         * Restrict measurement only to grid spaces
         * @defaultValue `true`
         */
        gridSpaces: boolean;
        /**
         * Do the measure whatever is the destination point?
         * @defaultValue `false`
         */
        force: boolean;
      }>,
    ): Ruler.Segment[];

    /**
     * While measurement is in progress, update the destination to be the central point of the target grid space.
     * @param destination - The current pixel coordinates of the mouse movement
     * @returns The destination point, a center of a grid space
     */
    protected _getMeasurementDestination(destination: Point): Point;

    /**
     * Translate the waypoints and destination point of the Ruler into an array of Ray segments.
     * @returns The segments of the measured path
     */
    protected _getMeasurementSegments(): RulerMeasurementSegment[];

    /**
     * Compute the distance of each segment and the total distance of the measured path.
     * @param gridSpaces - Base distance on the number of grid spaces moved?
     */
    protected _computeDistance(gridSpaces: boolean): void;

    /**
     * Get the text label for a segment of the measured path
     */
    protected _getSegmentLabel(segment: RulerMeasurementSegment, totalDistance: number): string;

    /**
     * Draw each segment of the measured path.
     */
    protected _drawMeasuredPath(): void;

    /**
     * Highlight the measurement required to complete the move in the minimum number of discrete spaces
     */
    protected _highlightMeasurementSegment(segment: RulerMeasurementSegment): void;

    /**
     * Determine whether a SPACE keypress event entails a legal token movement along a measured ruler
     *
     * @returns An indicator for whether a token was successfully moved or not. If True the event should be
     *          prevented from propagating further, if False it should move on to other handlers.
     */
    moveToken(): Promise<false | undefined>;

    /**
     * Acquire a Token, if any, which is eligible to perform a movement based on the starting point of the Ruler
     */
    protected _getMovementToken(): Token.ConfiguredInstance | null | undefined;

    /**
     * Test whether a Token is allowed to execute a measured movement path.
     * @param token - The Token being tested
     * @returns Whether the movement is allowed
     * @throws  A specific Error message used instead of returning false
     */
    protected _canMove(token: Token): true;

    /**
     * Animate piecewise Token movement along the measured segment path.
     * @param token - The Token being animated
     * @returns A Promise which resolves once all animation is completed
     */
    protected _animateMovement(token: Token): Promise<void>;

    /**
     * Update Token position and configure its animation properties for the next leg of its animation.
     * @param token       - The Token being updated
     * @param segment     - The measured segment being moved
     * @param destination - The adjusted destination coordinate
     * @returns A Promise which resolves once the animation for this segment is done
     */
    protected _animateSegment(token: Token, segment: RulerMeasurementSegment, destination: Point): Promise<unknown>;

    /**
     * An method which can be extended by a subclass of Ruler to define custom behaviors before a confirmed movement.
     * @param token - The Token that will be moving
     */
    protected _preMove(token: Token): Promise<void>;

    /**
     * An event which can be extended by a subclass of Ruler to define custom behaviors before a confirmed movement.
     * @param token - The Token that finished moving
     */
    protected _postMove(token: Token): Promise<void>;

    /**
     * Handle the beginning of a new Ruler measurement workflow
     * @param event - The drag start event
     * @see Canvas._onDragLeftStart
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
    protected _onClickRight(event: PIXI.FederatedEvent): boolean | void;

    /**
     * Continue a Ruler measurement workflow for left-mouse movements on the Canvas.
     * @param event - The mouse move event
     * @see Canvas._onDragLeftMove
     */
    protected _onMouseMove(event: PIXI.FederatedEvent): void;

    /**
     * Conclude a Ruler measurement workflow by releasing the left-mouse button.
     * @param event - The pointer-up event
     * @see Canvas._onDragLeftDrop
     */
    protected _onMouseUp(event: PIXI.FederatedEvent): void;

    /**
     * Handle the addition of a new waypoint in the Ruler measurement path
     * @remarks point is intentionally typed as Point because it is called with event.data.origin and only uses x and y
     */
    protected _addWaypoint(point: Point): void;

    /**
     * Handle the removal of a waypoint in the Ruler measurement path
     * @param point - The current cursor position to snap to
     * @param snap  - Snap exactly to grid spaces?
     *                (default: `true`)
     */
    protected _removeWaypoint(point: PIXI.Point, { snap }?: { snap?: boolean }): void;

    /**
     * Handle the conclusion of a Ruler measurement workflow
     */
    protected _endMeasurement(): void;

    /**
     * Package Ruler data to an object which can be serialized to a string.
     */
    toJSON(): RulerData;

    /**
     * Update a Ruler instance using data provided through the cursor activity socket
     * @param data - Ruler data with which to update the display
     */
    update(data: ReturnType<Ruler["toJSON"]>): void;
  }

  namespace Ruler {
    interface Segment {
      distance: number;
      label: PIXI.DisplayObject;
      last: boolean;
      ray: Ray;
      text: string;
    }
  }
}
