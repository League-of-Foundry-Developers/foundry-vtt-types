/**
 * The Sight Layer which implements dynamic vision, lighting, and fog of war
 * This layer uses an event-driven workflow to perform the minimal required calculation in response to changes.
 * @see PointSource
 *
 * @example <caption>The sightRefresh hook</caption>
 * ```javascript
 * Hooks.on("sightRefresh", layer => {});
 * ```
 */
declare class SightLayer extends CanvasLayer {
  constructor();

  /**
   * Fog of War data object
   */
  fogData: {
    _id: string | null;
    explored: boolean | string | null;
    positions: Record<`${number}_${number}`, { radius: number; limit: number }>;
    scene?: string;
    timestamp?: number;
    user?: string;
  };

  /**
   * A Collection of vision sources which are currently active within the rendered Scene.
   */
  sources: Collection<PointSource>;

  /**
   * The canonical line-of-sight polygon which defines current Token visibility.
   */
  los: PIXI.Graphics;

  /**
   * The blur distance for soft shadows
   * @defaultValue `0`
   */
  protected _blurDistance: number;

  /**
   * A status flag for whether the layer initialization workflow has succeeded
   * @defaultValue `false`
   */
  protected _initialized: boolean;

  /**
   * The downscaling resolution used for the saved fog texture
   * @defaultValue `1`
   */
  protected _fogResolution: number;

  /**
   * A pool of fog of war exploration containers that can be recycled
   * @defaultValue `[]`
   */
  protected _visionPool: PIXI.Container[];

  /**
   * Track whether fog of war exploration has been updated and required saving
   * @defaultValue `false`
   */
  protected _fogUpdated: boolean;

  /**
   * Track the number of moves which have updated fog of war
   * @defaultValue `0`
   */
  protected _fogUpdates: number;

  /**
   * A debounced function to save fog of war exploration once a stream of updates have stopped
   */
  debounceSaveFog: (...args: Parameters<this['update']>) => void;

  /**
   * @override
   * @defaultValue `mergeObject(super.layerOptions, { zIndex: 210 })`
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  /**
   * Does the currently viewed Scene support Token field of vision?
   */
  get tokenVision(): boolean;

  /**
   * Does the currently viewed Scene support fog of war exploration?
   */
  get fogExploration(): boolean;

  /** @override */
  tearDown(): Promise<void>;

  /**
   * Initialize the Sight Layer. Initialization has the following hierarchical workflow:
   *
   * Initialize Layer (reset entire layer)
   *  InitializeLights (used to reset all lights)
   *    UpdateLight (update a single light)
   *  InitializeTokens (reset all tokens)
   *    UpdateToken (update a single token)
   *  Initialize Fog (reset FOW state)
   */
  initialize(): Promise<void>;

  /**
   * Initialize fog of war - resetting it when switching scenes or re-drawing the canvas
   */
  initializeFog(): Promise<void>;

  /** @override */
  draw(): Promise<this>;

  /**
   * Draw the fog of war exploration container
   */
  protected _drawFogContainer(): PIXI.Container;

  /**
   * Construct a vision container that is used to render a single view position.
   * These containers are placed into the _visionPool and recycled as needed.
   */
  protected _createVisionContainer(): PIXI.Container;

  /**
   * Obtain a vision container from the recycling pool, or create one if no container exists.
   * Assign the container as the current fog exploration and the current LOS polygon.
   */
  protected _getVisionContainer(): PIXI.Container;

  /**
   * Return a vision container back to the pool, recycling it for future use.
   * @param c - The container to recycle
   */
  protected _recycleVisionContainer(c: PIXI.Container): void;

  /**
   * Update the display of the sight layer.
   * Organize sources into rendering queues and draw lighting containers for each source
   *
   * @param forceUpdateFog - Always update the Fog exploration progress for this update
   *                         (default: `false`)
   * @param noUpdateFog    - Never update the Fog exploration progress for this update
   *                         (default: `false`)
   */
  refresh({ forceUpdateFog, noUpdateFog }?: { forceUpdateFog?: boolean; noUpdateFog?: boolean }): void;

  /* -------------------------------------------- */

  /**
   * Restrict the visibility of certain canvas assets (like Tokens or DoorControls) based on the visibility polygon
   * These assets should only be displayed if they are visible given the current player's field of view
   */
  restrictVisibility(): void;

  /**
   * Once a new Fog of War location is explored, composite the explored container with the current staging sprite
   * Save that staging Sprite as the rendered fog exploration and swap it out for a fresh staging texture
   * Do all this asynchronously, so it doesn't block token movement animation since this takes some extra time
   */
  protected commitFog(): Promise<void>;

  /**
   * Load existing fog of war data from local storage and populate the initial exploration sprite
   */
  loadFog(): Promise<PIXI.Texture>;

  /**
   * Dispatch a request to reset the fog of war exploration status for all users within this Scene.
   * Once the server has deleted existing FogExploration documents, the _onResetFog handler will re-draw the canvas.
   */
  resetFog(): Promise<Canvas | undefined>;

  /**
   * Save Fog of War exploration data to a base64 string to the FogExploration document in the database.
   * Assumes that the fog exploration has already been rendered as fog.rendered.texture.
   */
  protected saveFog(): Promise<SocketInterface.Responses.ModifyEmbeddedDocument | undefined>;

  /**
   * Update the fog layer when a player token reaches a board position which was not previously explored
   * @param source - The vision source for which the fog layer should update
   * @param force  - Force fog to be updated even if the location is already explored
   *                 (default: `false`)
   */
  updateFog(source: PointSource, force?: boolean): void;

  /**
   * Choose an adaptive fog rendering resolution which downscales the saved fog textures for larger dimension Scenes
   */
  protected _configureFogResolution(): number;

  /**
   * Trigger a server-side update (or creation) of fog exploration status for a certain Scene
   */
  protected _createOrUpdateFogExploration(
    fogData: this['fogData']
  ): Promise<SocketInterface.Responses.ModifyEmbeddedDocument>;

  /**
   * If fog of war data is reset from the server, re-draw the canvas
   * @param resetData - Fog reset data sent by the server
   */
  protected _onResetFog(resetData: { reset: boolean; scene: string }): Promise<Canvas | undefined>;

  /**
   * Compute line-of-sight and field-of-vision polygons for a given origin position and visibility radius.
   * The line-of-sight polygon defines the unrestricted area of visibility for the source.
   * The field-of-vision polygon defines the restricted area of visibility for the source.
   * @param origin       - An point with coordinates x and y representing the origin of the test
   * @param radius       - A distance in canvas pixels which reflects the visible range
   * @param angle        - An optional limited angle of emission with which to restrict polygons
   *                       (default: `360`)
   * @param density      - The desired radial density of emission for rays, in degrees
   *                       (default: `6`)
   * @param rotation     - (default: `0`)
   * @param unrestricted - Compute sight that is unrestricted by walls
   *                       (default: `false`)
   * @returns The computed rays and polygons
   */
  static computeSight(
    origin: Point,
    radius: number,
    {
      angle,
      density,
      rotation,
      unrestricted
    }?: { angle?: number; density?: number; rotation?: number; unrestricted?: boolean }
  ): { rays: Ray[]; los: PIXI.Polygon; fov: PIXI.Polygon };

  /* -------------------------------------------- */

  /**
   * A helper method responsible for casting rays at wall endpoints.
   * Rays are restricted by limiting angles.
   *
   * @param x          - The origin x-coordinate
   * @param y          - The origin y-coordinate
   * @param distance   - The ray distance
   * @param density    - The desired radial density
   *                     (default: `4`)
   * @param endpoints  - An array of endpoints to target
   * @param limitAngle - Whether the rays should be cast subject to a limited angle of emission
   *                     (default: `false`)
   * @param aMin       - The minimum bounding angle
   * @param aMax       - The maximum bounding angle
   *
   * @returns An array of Ray objects
   */
  protected static _castRays(
    x: number,
    y: number,
    distance: number,
    {
      density,
      endpoints,
      limitAngle,
      aMin,
      aMax
    }: { density?: number; endpoints: PointArray[]; limitAngle: boolean; aMin: number; aMax: number }
  ): Ray[];

  /**
   * Test whether a point on the Canvas is visible based on the current vision and LOS polygons
   * @param point     - The point in space to test, an object with coordiantes x and y.
   * @param tolerance - A numeric radial offset which allows for a non-exact match. For example, if
   *                    tolerance is 2 then the test will pass if the point is within 2px of a vision
   *                    polygon.
   *                    (default: `2`)
   * @param object    - An optional reference to the object whose visibility is being tested
   *                    (default: `null`)
   * @returns Whether the point is currently visible.
   */
  testVisibility(
    point: Point,
    { tolerance, object }?: { tolerance?: number; object?: PIXI.DisplayObject | null }
  ): boolean;

  /**
   * Normalize an angle to ensure it is baselined to be the smallest angle that is greater than a minimum.
   * @param aMin  - The lower-bound minimum angle
   * @param angle - The angle to adjust
   * @returns The adjusted angle which is greater than or equal to aMin.
   */
  protected static _adjustRayAngle(aMin: number, angle: number): number;

  /**
   * Visualize the sight layer to understand algorithm performance.
   * @param bounds    - The initial rectangular bounds of the vision check
   * @param endpoints - The wall endpoints being tested
   * @param rays      - The array of cast vision Rays
   * @param los       - The resulting line-of-sight polygon
   * @param fov       - The resulting field-of-vision polygon
   */
  protected static _visualizeSight(
    bounds: Rectangle,
    endpoints: PointArray[],
    rays: Ray[],
    los: PIXI.Polygon,
    fov: PIXI.Polygon
  ): void;

  /**
   * @deprecated since 0.7.3
   * @see {@link Canvas#initializeSources}
   */
  initializeTokens({ defer }?: { defer?: boolean }): void;

  /**
   * @deprecated since 0.7.3
   * @see {@link SightLayer#refresh}
   */
  update(options?: { forceUpdateFog?: boolean; noUpdateFog?: boolean }): void;

  /**
   * @deprecated since 0.7.3
   * @see {@link Token#updateSource}
   */
  updateToken(token: Token, options: { defer?: boolean; deleted?: boolean; noUpdateFog?: boolean }): void;

  /**
   * @deprecated since 0.7.3
   * @see {@link AmbientLight#updateSource}
   */
  updateLight(light: AmbientLight, options: { defer: boolean; deleted: boolean }): boolean | void | null;

  /**
   * Define the threshold value for the number of distinct Wall endpoints.
   * Below this threshold, exact vision computation is used by casting a Ray at every endpoint.
   * Above this threshold, approximate vision computation is used by culling to only nearby endpoints.
   * @defaultValue `500`
   */
  static EXACT_VISION_THRESHOLD: number;

  /**
   * Define the number of positions that are explored before a set of fog updates are pushed to the server.
   * @defaultValue `10`
   */
  static FOG_COMMIT_THRESHOLD: number;
}
