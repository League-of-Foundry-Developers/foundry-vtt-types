import { ConfiguredDocumentClass, ConfiguredObjectClassForName } from "../../../../../types/helperTypes";

declare global {
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
    constructor(
      user?: InstanceType<ConfiguredDocumentClass<typeof User>> | null,
      { color }?: { color?: number | null }
    );

    /**
     * Record the User which this Ruler references
     * @defaultValue `game.user`
     */
    user: InstanceType<ConfiguredDocumentClass<typeof User>>;

    /**
     * The ruler name - used to differentiate between players
     * @defaultValue `Ruler.${user.id}`
     */
    name: string;

    /**
     * The ruler color - by default the color of the active user
     * @defaultValue `foundry.utils.colorStringToHex(this.user.data.color) || 0x42F4E2`
     */
    color: number;

    /**
     * This Array tracks individual waypoints along the ruler's measured path.
     * The first waypoint is always the origin of the route.
     * @defaultValue `[]`
     */
    waypoints: PIXI.Point[];

    /**
     * The current destination point at the end of the measurement
     * @defaultValue `null`
     */
    destination: PIXI.Point | null;

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
    protected _state: ValueOf<typeof Ruler["STATES"]>;

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
     * Is the Ruler being actively used to measure distance?
     */
    get active(): boolean;

    /**
     * Measure the distance between two points and render the ruler UI to illustrate it
     * @param destination - The destination point to which to measure
     * @param gridSpaces  - Restrict measurement only to grid spaces
     *                      (default: `true`)
     */
    measure(destination: Point, { gridSpaces }?: { gridSpaces?: boolean }): Ruler.Segment[];

    /**
     * Get the text label for a segment of the measured path
     */
    protected _getSegmentLabel(segmentDistance: number, totalDistance: number, isTotal: boolean): string;

    /**
     * Highlight the measurement required to complete the move in the minimum number of discrete spaces
     */
    protected _highlightMeasurement(ray: Ray): void;

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
    protected _getMovementToken(): InstanceType<ConfiguredObjectClassForName<"Token">> | null | undefined;

    /**
     * A helper method to return an Array of Ray objects constructed from the waypoints of the measurement
     * @param waypoints   - An Array of waypoint `{x, y}` Objects
     * @param destination - An optional destination point to append to the existing waypoints
     * @returns An Array of Ray objects which represent the segemnts of the waypoint path
     */
    protected _getRaysFromWaypoints(waypoints: PIXI.Point[], destination?: PIXI.Point): Ray[];

    /**
     * Clear display of the current Ruler
     */
    clear(): void;

    /**
     * Handle the beginning of a new Ruler measurement workflow
     * @see Canvas._onDragLeftStart
     */
    protected _onDragStart(event: PIXI.InteractionEvent): void;

    /**
     * Handle left-click events on the Canvas during Ruler measurement.
     * @see Canvas._onClickLeft
     */
    protected _onClickLeft(event: PIXI.InteractionEvent): void;

    /**
     * Handle right-click events on the Canvas during Ruler measurement.
     * @see Canvas._onClickRight
     */
    protected _onClickRight(event: PIXI.InteractionEvent): boolean | void;

    /**
     * Continue a Ruler measurement workflow for left-mouse movements on the Canvas.
     * @see Canvas._onDragLeftMove
     */
    protected _onMouseMove(event: PIXI.InteractionEvent): void;

    /**
     * Conclude a Ruler measurement workflow by releasing the left-mouse button.
     * @see Canvas._onDragLeftDrop
     */
    protected _onMouseUp(event: PIXI.InteractionEvent): void;

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
