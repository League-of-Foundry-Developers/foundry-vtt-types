/** TODO: Declared in client/pixi/core/containers/point-source-mesh */
type PointSourceMesh = unknown;

declare namespace RenderedPointSource {
  interface RenderedPointSourceData extends PointSource.PointSourceData {
    /** A color applied to the rendered effect */
    color: number | null;
    /** An integer seed to synchronize (or de-synchronize) animations */
    seed: number | null;
    /** Is this source a temporary preview? */
    preview: boolean;
  }

  type RenderedPointSourceAnimationConfig = {
    /** The human-readable (localized) label for the animation */
    label?: string;
    /** The animation function that runs every frame */
    animation?: (dt: number, options: Partial<RenderedPointSourceAnimationConfig>) => any;
    /** A custom illumination shader used by this animation */
    illuminationShader?: AdaptiveIlluminationShader;
    /** A custom coloration shader used by this animation */
    colorationShader?: AdaptiveColorationShader;
    /** A custom background shader used by this animation */
    backgroundShader?: AdaptiveBackgroundShader;
    /** The animation seed */
    seed?: number;
    /** The animation time */
    time?: number;
  };

  type RenderedPointSourceLayer = {
    /** Is this layer actively rendered? */
    active?: boolean;
    /** Do uniforms need to be reset? */
    reset?: boolean;
    /** Is this layer temporarily suppressed? */
    suppressed?: boolean;
    /** The rendered mesh for this layer */
    mesh?: PointSourceMesh;
    /** The shader instance used for the layer */
    shader?: AdaptiveLightingShader;
  };
}

declare class RenderedPointSource extends PointSource {
  /**
   * Keys of the data object which require shaders to be re-initialized.
   */
  protected static _initializeShaderKeys: string[];

  /**
   * Keys of the data object which require uniforms to be refreshed.
   */
  protected static _refreshUniformsKeys: string[];

  /**
   * The offset in pixels applied to create soft edges.
   * @defaultValue `-8`
   */
  static EDGE_OFFSET: number;

  /**
   * The animation configuration applied to this source
   * @defaultValue `{}`
   */
  animation: Partial<RenderedPointSource.RenderedPointSourceAnimationConfig>;

  /**
   * The object of data which configures how the source is rendered
   */
  data: RenderedPointSource.RenderedPointSourceData;

  /**
   * Track the status of rendering layers
   */
  layers: {
    background: RenderedPointSource.RenderedPointSourceLayer;
    coloration: RenderedPointSource.RenderedPointSourceLayer;
    illumination: RenderedPointSource.RenderedPointSourceLayer;
  };

  /**
   * The color of the source as a RGB vector.
   */
  colorRGB: [number, number, number] | null;

  /**
   * A convenience accessor to the background layer mesh.
   */
  get background(): PointSourceMesh;

  /**
   * A convenience accessor to the coloration layer mesh.
   */
  get coloration(): PointSourceMesh;

  /**
   * A convenience accessor to the illumination layer mesh.
   */
  get illumination(): PointSourceMesh;

  /**
   * Is the rendered source animated?
   */
  get isAnimated(): boolean;

  /**
   * Has the rendered source at least one active layer?
   */
  get hasActiveLayer(): boolean;

  /**
   * Is this RenderedPointSource a temporary preview?
   */
  get isPreview(): boolean;

  protected override _initialize(data: Partial<PointSource.PointSourceData>): void;

  protected override _configure(changes: Partial<PointSource.PointSourceData>): void;

  /**
   * Decide whether to render soft edges with a blur.
   */
  protected _configureSoftEdges(): void;

  /**
   * Configure the derived color attributes and associated flag.
   * @param color - The color to configure (usually a color coming for the rendered point source data) or null if no color is configured for this rendered source.
   */
  protected _configureColorAttributes(color: number | null): void;

  /**
   * Configure which shaders are used for each rendered layer.
   * @internal
   */
  protected _configureShaders(): {
    background: AdaptiveLightingShader;
    coloration: AdaptiveLightingShader;
    illumination: AdaptiveLightingShader;
  };

  /**
   * Specific configuration for a layer.
   */
  protected _configureLayer(layer: RenderedPointSource.RenderedPointSourceLayer, layerId: string): void;

  /**
   * Initialize the blend mode and vertical sorting of this source relative to others in the container.
   */
  protected _initializeBlending(): void;

  /**
   * Render the containers used to represent this light source within the LightingLayer
   */
  drawMeshes(): { background: PIXI.Mesh; coloration: PIXI.Mesh; illumination: PIXI.Mesh };

  override _refresh(): void;

  /** {@inheritDoc} */
  protected _isActive(): boolean;

  /**
   * Update shader uniforms used for the background layer.
   */
  protected _updateBackgroundUniforms(): void;

  /**
   * Update shader uniforms used for the coloration layer.
   */
  protected _updateColorationUniforms(): void;

  /**
   * Update shader uniforms used for the illumination layer.
   */
  protected _updateIlluminationUniforms(): void;

  protected override _destroy(): void;

  /**
   * Animate the PointSource, if an animation is enabled and if it currently has rendered containers.
   * @param dt - Delta time.
   * @remarks Returns `this.animation.call(this, dt, options)`
   */
  animate(dt: number): ReturnType<Exclude<this["animation"]["animation"], undefined>>;

  /**
   * Generic time-based animation used for Rendered Point Sources.
   * @param dt          - Delta time.
   * @param speed       - The animation speed, from 1 to 10
   *                      (default: 5)
   * @param intensity   - The animation intensity, from 1 to 10
   *                      (default: 5)
   * @param reverse     - Reverse the animation direction
   *                      (default: false)
   */
  animateTime(dt: number, { speed, intensity, reverse }: { speed: number; intensity: number; reverse: boolean }): void;

  /**
   * @deprecated since v11, will be removed in v13.
   * @remarks The RenderedPointSource#preview is deprecated.
   * @remarks Use RenderedPointSource#isPreview instead.
   */
  get preview(): boolean;

  /**
   * @deprecated since v11, will be removed in v13.
   * @remarks The RenderedPointSource#preview is deprecated.
   * @remarks Set RenderedPointSourceData#preview as part of RenderedPointSourceData#initialize instead.
   */
  set preview(preview);
}
