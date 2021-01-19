import 'pixi.js';

declare type WallData = { c: number[], move: number, sense: number, door: number };

/**
 * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
 * @extends {PlaceablesLayer}
 * @see {@link Wall}
 */
declare class WallsLayer extends PlaceablesLayer {
	/**
	 * A graphics layer used to display chained Wall selection
	 * @type {PIXI.Graphics}
	 */
	chain: PIXI.Graphics;
	/**
	 * An array of all the unique perception-blocking endpoints which are present in the layer
	 * We keep this array cached for faster sight polygon computations
	 * @type {PointArray[]}
	 */
	endpoints: PointArray;
	/**
	 * Track whether we are currently within a chained placement workflow
	 * @type {boolean}
	 */
	_chain: boolean;
	/**
	 * Track whether the layer is currently toggled to snap at exact grid precision
	 * @type {boolean}
	 */
	_forceSnap: boolean;
	/**
	 * Track the most recently created or updated wall data for use with the clone tool
	 * @type {Object|null}
	 * @private
	 */
	_cloneType: Object | null;
	/**
	 * Reference the last interacted wall endpoint for the purposes of chaining
	 * @type {{id: string|null, point: PointArray}}
	 * @private
	 */
	last: { id: string | null, point: PointArray };
	constructor();
	/**
	 * An Array of Wall instances in the current Scene which currently block Token vision.
	 * This array includes doors regardless of their current door state.
	 * @type {Wall[]}
	 */
	get blockVision(): Wall[];
	/**
	 * An Array of Wall instances in the current Scene which block Token movement.
	 * This array includes doors regardless of their current door state.
	 * @type {Wall[]}
	 */
	get blockMovement(): Wall[];
	/**
	 * An Array of Wall instances in the current Scene which act as Doors.
	 * @type {Wall[]}
	 */
	get doors(): Wall[];
	/**
	 * Gate the precision of wall snapping to become less precise for small scale maps.
	 * @type {number}
	 */
	get gridPrecision(): number
	initialize(): void;
	/**
	 * Given a point and the coordinates of a wall, determine which endpoint is closer to the point
	 * @param {Point} point         The origin point of the new Wall placement
	 * @param {Wall} wall           The existing Wall object being chained to
	 * @return {PointArray}         The [x,y] coordinates of the starting endpoint
	 */
	static getClosestEndpoint(point: Point, wall: Wall): PointArray;
	/**
	 * Given an array of Wall instances, identify the unique endpoints across all walls.
	 * @param {Wall[]} walls            An array of Wall instances
	 * @param {Rectangle} bounds        An optional bounding rectangle within which the endpoint must lie.
	 * @param {boolean} blockMovement   Filter for walls that block movement, default is true.
	 * @param {boolean} blockSenses     Filter for walls that block perception, default is true.
	 * @return {PointArray[]}           An array of endpoints
	 */
	static getUniqueEndpoints(walls: Wall[], { bounds, blockMovement, blockSenses }: { bounds: Rectangle, blockMovement: boolean, blockSenses: boolean }): PointArray;
	/**
	 * Test whether movement along a given Ray collides with a Wall.
	 * @param {Ray} ray   The attempted movement
	 * @return {boolean}  Does a collision occur?
	 */
	checkCollision(ray: Ray, { blockMovement, blockSenses, mode }: { blockMovement: boolean, blockSenses: boolean, mode: string }): boolean
	/**
	 * Highlight the endpoints of Wall segments which are currently group-controlled on the Walls layer
	 */
	highlightControlledSegments(): void;
	/**
	 * Pan the canvas view when the cursor position gets close to the edge of the frame
	 * @param {MouseEvent} event    The originating mouse movement event
	 * @param {number} x            The x-coordinate
	 * @param {number} y            The y-coordinate
	 * @private
	 */
	_panCanvasEdge(event: MouseEvent, x: number, y: number): void;
	/**
	 * Get the endpoint coordinates for a wall placement, snapping to grid at a specified precision
	 * Require snap-to-grid until a redesign of the wall chaining system can occur.
	 * @param {Object} point          The initial candidate point
	 * @param {boolean} [snap=true]   Whether to snap to grid
	 * @return {number[]}             The endpoint coordinates [x,y]
	 * @private
	 */
	_getWallEndpointCoordinates(point: Point, { snap }: { snap: boolean }): number[];
	/**
	 * The Scene Controls tools provide several different types of prototypical Walls to choose from
	 * This method helps to translate each tool into a default wall data configuration for that type
	 * @param {string} tool     The active canvas tool
	 * @private
	 */
	_getWallDataFromActiveTool(tool: string): WallData;
	/** @override */
	_onDragLeftStart(event: PIXI.InteractionEvent): void;
	/** @override */
	_onDragLeftMove(event: PIXI.InteractionEvent): void;
	/** @override */
	_onDragLeftDrop(event: PIXI.InteractionEvent): void;
	/** @override */
	_onDragLeftCancel(event: PIXI.InteractionEvent): void;
	/**
	 * Test a single Ray against a single Wall
	 * @param {Ray} ray           The Ray being cast
	 * @param {Wall} wall         The Wall against which to test
	 * @return {RayIntersection}  An intersection, if one occurred
	 */
	static testWall(ray: Ray, wall: Wall): Vector2;
	/**
	 * Identify the closest collision point from an array of collisions
	 * @param {RayIntersection[]} collisions  An array of intersection points
	 * @return {RayIntersection}              The closest blocking intersection
	 */
	static getClosestCollision(collisions: Vector2): Vector2;

	/* -------------------------------------------- */

	/**
	 * Get the set of wall collisions for a given Ray
	 * @param {Ray} ray                   The Ray being tested
	 * @param {boolean} [blockMovement]   Test against walls which block movement?
	 * @param {boolean} [blockSenses]     Test against walls which block senses?
	 * @param {string} [mode]             The return mode of the test, one of "all", "closest", or "any"
	 * @param {object} _performance       An internal performance object used for debugging
	 *
	 * @return {object[]|object|boolean}  An array of collisions, if mode is "all"
	 *                                    The closest collision, if mode is "closest"
	 *                                    Whether any collision occurred if mode is "any"
	 */
	static getRayCollisions(ray: Ray, { blockMovement, blockSenses, mode, _performance }: { blockMovement: boolean, blockSenses: boolean, mode: string, _performance: object }): Vector2[] | Vector2 | boolean;
}
