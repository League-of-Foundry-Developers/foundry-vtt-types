/**
 * The Ruler - used to measure distances and trigger movements
 */
declare class Ruler extends PIXI.Container {
  /*
   * @param user  - The User for whom to construct the Ruler instance
   * @param color - The color for the ruler
   *                (Default value: The user's color or `0x42f4e2`)
   */
  constructor(user?: User, { color }?: { color?: number | null });

  /**
   * Record the User which this Ruler references
   */
  user: User;

  /**
   * The ruler name - used to differentiate between players
   */
  name: string;

  /**
   * The ruler color - by default the color of the active user
   */
  color: number;

  /**
   * This Array tracks individual waypoints along the ruler's measured path.
   * The first waypoint is always the origin of the route.
   */
  waypoints: PIXI.Point[];

  /**
   * The current destination point at the end of the measurement
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
   * @see Ruler.STATES
   */
  protected _state: ValueOf<typeof Ruler['STATES']>;

  /**
   * Is the Ruler being actively used to measure distance?
   */
  get active(): boolean;

  /**
   * Measure the distance between two points and render the ruler UI to illustrate it
   * @param destination - The destination point to which to measure
   * @param gridSpaces  - Restrict measurement only to grid spaces
   *                      (Default value: `true`)
   */
  measure(
    destination: Point,
    { gridSpaces }?: { gridSpaces?: boolean }
  ): {
    ray: Ray;
    label: PIXI.DisplayObject;
  }[];

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
   * @remarks This will never actually return `true`
   */
  moveToken(): Promise<boolean | undefined>;

  /**
   * Acquire a Token, if any, which is eligible to perform a movement based on the starting point of the Ruler
   */
  protected _getMovementToken(): Token | null | undefined;

  /**
   * A helper method to return an Array of Ray objects constructed from the waypoints of the measurement
   * @param waypoints   - An Array of waypoint `{x, y}` Objects
   * @param destination - An optional destination point to append to the existing waypoints
   * @returns             An Array of Ray objects which represent the segemnts of the waypoint path
   */
  protected _getRaysFromWaypoints(waypoints: Point[], destination?: Point): Ray[];

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
   */
  protected _addWaypoint(point: Point): void;

  /**
   * Handle the removal of a waypoint in the Ruler measurement path
   * @param point - The current cursor position to snap to
   * @param snap  - Snap exactly to grid spaces?
   *                (Default value: `true`)
   */
  protected _removeWaypoint(point: Point, { snap }?: { snap?: boolean }): void;

  /**
   * Handle the conclusion of a Ruler measurement workflow
   */
  protected _endMeasurement(): void;

  toJSON(): {
    class: 'Ruler';
    name: string;
    waypoints: Ruler['waypoints'];
    destination: Ruler['destination'];
    _state: Ruler['_state'];
  };

  /**
   * Update a Ruler instance using data provided through the cursor activity socket
   * @param data - Ruler data with which to update the display
   */
  update(data: {
    class: 'Ruler';
    waypoints: Ruler['waypoints'];
    destination: Ruler['destination'];
    _state: Ruler['_state'];
  }): void;

  /**
   * The possible Ruler measurement states which can occur
   */
  static STATES: {
    INACTIVE: 0;
    STARTING: 1;
    MEASURING: 2;
    MOVING: 3;
  };
}
