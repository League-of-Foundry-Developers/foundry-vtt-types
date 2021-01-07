declare interface RulerData {
  _state: number
  class: string
  destination: PIXI.Point
  name: string
  waypoints: [PIXI.Point]
}

/**
 * The Ruler - used to measure distances and trigger movements
 * @param user - The User for whom to construct the Ruler instance
 */
declare class Ruler extends PIXI.Container {
  /**
   * Track the current measurement state
   */
  public _state: number

  /**
   * Is the Ruler being actively used to measure distance?
   */
  public readonly active: boolean

  /**
   * The ruler color - by default the color of the active user
   */
  public color: number | null

  /**
   * The current destination point at the end of the measurement
   */
  public destination: PIXI.Point

  /**
   * The Labels element is a Container of Text elements which label the measured path
   */
  public labels: PIXI.Container

  /**
   * The ruler name - used to differentiate between players
   */
  public name: string

  /**
   * The Ruler element is a Graphics instance which draws the line and points of the measured path
   */
  public ruler: PIXI.Graphics

  /**
   * Record the User which this Ruler references
   */
  public user: User

  /**
   * This Array tracks individual waypoints along the ruler's measured path.
   * The first waypoint is always the origin of the route.
   */
  public waypoints: PIXI.Point[]

  constructor (user: User, color?: number);

  /**
   * Measure the distance between two points and render the ruler UI to illustrate it
   * @param destination - The destination point to which to measure
   */
  public measure (destination: PIXI.Point, gridSpaces?: boolean): void;

  /**
   * Get the text label for a segment of the measured path
   * @param ray -
   * @param segmentDistance -
   * @param totalDistance -
   * @param isTotal -
   * @internal
   */
  public _getSegmentLabel (ray: Ray, segmentDistance: number, totalDistance: number, isTotal: boolean): string;

  /**
   * Highlight the measurement required to complete the move in the minimum number of discrete spaces
   * @param ray -
   * @internal
   */
  public _highlightMeasurement (ray: Ray): void;

  /**
   * Determine whether a SPACE keypress event entails a legal token movement along a measured ruler
   *
   * @returns An indicator for whether a token was successfully moved or not. If True the event should be
   *          prevented from propagating further, if False it should move on to other handlers.
   *
   * @remarks confirm with Atropos whether this should return void or not. The JSDoc says it returns a boolean,
   * but the code doesn't return anything.
   */
  public moveToken (): void;

  /**
   * A helper method to return an Array of Ray objects constructed from the waypoints of the measurement
   * @param waypoints - An Array of waypoint \{x, y\} Objects
   * @param destination - An optional destination point to append to the existing waypoints
   * @returns An Array of Ray objects which represent the segemnts of the waypoint path
   * @internal
   */
  public _getRaysFromWaypoints (waypoints: PIXI.Point[], destination: PIXI.Point): Ray[];

  /**
   * Acquire a Token, if any, which is eligible to perform a movement based on the starting point of the Ruler
   * @internal
   */
  public _getMovementToken (): Token;

  /**
   * Clear display of the current Ruler
   */
  public clear (): void;

  /**
   * General handler for mouse-down events which should affect the Ruler in some way
   * This event delegates to more specialized handlers depending on where we are in the measurement workflow
   * @param event -
   * @internal
   */
  public _onMouseDown (event: Event): void;

  /**
   * General handler for mouse-move events which affect Ruler measurement
   * This event delegates to more specialized handlers depending on where we are in the measurement workflow
   * @param event -
   * @internal
   */
  public _onMouseMove (event: Event): void;

  /**
   * Handle the beginning of a new Ruler measurement event
   * @param event -
   * @internal
   */
  public _onStartMeasurement (event: PIXI.InteractionEvent): void;

  /**
   * Handle the addition of a new waypoint in the Ruler measurement path
   * @param event -
   * @internal
   */
  public _onAddWaypoint (event: PIXI.InteractionEvent): void;

  /**
   * Handle the removal of a waypoint in the Ruler measurement path
   * @param event -
   * @internal
   */
  public _onCancelWaypoint (event: PIXI.InteractionEvent): void;

  /**
   * Handle the conclusion of a Ruler measurement workflow
   * @param event -
   * @internal
   */
  public _onEndMeasurement (event: PIXI.InteractionEvent): void;

  public toJSON (): RulerData;

  /**
   * Update a Ruler instance using data provided through the cursor activity socket
   * @param data - Ruler data with which to update the display
   */
  public update (data: RulerData): void;
}
