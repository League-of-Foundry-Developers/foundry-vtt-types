declare global {
  /**
   * An abstract base class which defines a framework for effect sources which originate radially from a specific point.
   * This abstraction is used by the LightSource, VisionSource, SoundSource, and MovementSource subclasses.
   *
   * @example A standard PointSource lifecycle:
   * ```js
   * const source = new PointSource({object}); // Create the point source
   * source.initialize(data);                  // Configure the point source with new data
   * source.refresh();                         // Refresh the point source
   * source.destroy();                         // Destroy the point source
   * ```
   */
  abstract class PointSource {
    constructor(options?: {
      /** Some other object which is responsible for this source */
      object: PlaceableObject;
    });

    /**
     * The type of source represented by this data structure.
     * Each subclass must implement this attribute.
     * @remarks This is undefined in PointSource.
     */
    static sourceType: string | undefined;

    /**
     * Some other object which is responsible for this source.
     */
    object: PlaceableObject | null;

    /**
     * The object of data which configures how this source is rendered
     * @defaultValue `{}`
     */
    data: Partial<PointSourceData>;

    /** The polygonal shape of the point source, generated from its origin, radius, and other data. */
    shape: PointSourcePolygon | PIXI.Polygon;

    /**
     * Additional information which controls whether certain behaviors of the source must be enforced
     * @defaultValue `{}`
     */
    protected _flags: {
      renderFOV?: boolean;
    } & Record<string, boolean>;

    /**
     * Returns the update ID associated with this point source.
     * The update ID is increased whenever the source is initialized.
     * @defaultValue `0`
     */
    get updateId(): number;

    /**
     * Is this point source currently active?
     * Returns false if the source is disabled, temporarily suppressed, or not initialized.
     * @defaultValue `false`
     */
    get active(): boolean;

    /**
     * Is this source currently disabled?
     * Returns false if the source hasn't been initialized yet.
     * @defaultValue `true`
     */
    get disabled(): boolean;

    /**
     * Has this point source been initialized?
     * @defaultValue `false`
     */
    get initialized(): boolean;

    /**
     * The x-coordinate of the point source origin.
     */
    get x(): number | undefined;

    /**
     * The y-coordinate of the point source origin.
     */
    get y(): number | undefined;

    /**
     * The elevation bound to this source.
     */
    get elevation(): number;

    /**
     * A convenience reference to the radius of the source.
     * @defaultValue `0`
     */
    get radius(): number;

    /**
     * Initialize and configure the PointSource using provided data.
     * @param data - Provided data for configuration
     * @returns The configured source
     */
    initialize(data?: Partial<PointSourceData>): this;

    /**
     * Subclass specific data initialization steps.
     * This method is responsible for populating the instance data object.
     * @param data - Provided data for configuration
     */
    protected _initialize(data: Partial<PointSourceData>): void;

    /**
     * Subclass specific configuration steps. Occurs after data initialization and shape computation.
     * @param changes - The fields of data which changed during initialization
     */
    protected _configure(changes: Partial<PointSourceData>): void;

    /**
     * Refresh the state and uniforms of the PointSource.
     */
    refresh(): void;

    /**
     * Test whether this source should be active under current conditions?
     */
    protected _isActive(): boolean;

    /**
     * Subclass-specific refresh steps.
     */
    protected abstract _refresh(): void;

    /**
     * Steps that must be performed when the base source is destroyed.
     */
    destroy(): void;

    /**
     * Subclass specific destruction steps.
     */
    protected abstract _destroy(): void;

    /**
     * Configure the parameters of the polygon that is generated for this source.
     */
    protected _getPolygonConfiguration(): PointSourcePolygonConfig;

    /**
     * Create the polygon shape for this source using configured data.
     * @remarks Listed return type is PointSourcePolygon
     * @remarks Actual return: CONFIG.Canvas.polygonBackends[this.constructor.sourceType].create(...)
     *          It might be possible to derive the exact polygon type based on that.
     */
    protected _createPolygon(): PIXI.Polygon;

    /**
     * The type of source represented by this data structure.
     * @deprecated since v11, will be removed in v13.
     * @remarks Use PointSource#constructor.sourceType instead.
     */
    get sourceType(): (typeof PointSource)["sourceType"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks The setter PointSource#radius is deprecated.
     * @remarks The radius should not be set anywhere except in PointSource#_initialize.
     */
    set radius(radius);

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks PointSource#los is deprecated in favor of PointSource#shape.
     */
    get los(): PointSourcePolygon | PIXI.Polygon;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks PointSource#los is deprecated in favor of PointSource#shape.
     */
    set los(shape: PointSourcePolygon | PIXI.Polygon);

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks PointSource#refreshSource is deprecated in favor of PointSource#refresh.
     */
    refreshSource(): void;
  }

  interface PointSourceData {
    /** The x-coordinate of the source location */
    x: number;

    /** The y-coordinate of the source location */
    y: number;

    /** The elevation of the point source */
    elevation: number;

    /** An index for sorting the source relative to others at the same elevation */
    z: number | null;

    /** The radius of the source */
    radius: number;

    /** A secondary radius used for limited angles */
    externalRadius: number;

    /** The angle of rotation for this point source */
    rotation: number;

    /** The angle of emission for this point source */
    angle: number;

    /** Whether or not the source is constrained by walls */
    walls: boolean;

    /** Whether or not the source is disabled */
    disabled: boolean;
  }
}
