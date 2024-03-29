export {};

declare global {
  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of vision sources.
   */
  class VisionSource extends RenderedPointSource {
    static override sourceType: "sight";

    static override _refreshUniformsKeys: [
      "radius",
      "color",
      "attenuation",
      "brightness",
      "contrast",
      "saturation",
      "visionMode",
    ];

    static override EDGE_OFFSET: -2;

    /**
     * The object of data which configures how the source is rendered
     */
    data: VisionSourceData;

    /**
     * The vision mode linked to this VisionSource
     * @defaultValue `null`
     */
    visionMode: VisionMode | null;

    /**
     * The vision mode activation flag for handlers
     * @defaultValue `false`
     * @internal
     */
    protected _visionModeActivated: boolean;

    /**
     * The unconstrained LOS polygon.
     * @privateRemarks This is actually a true property and the getter in PointSource will be deprecated in v13
     */
    get los(): PointSourcePolygon;

    /** The constrained LOS polygon that is generated by the origin and radius of this source. */
    get fov(): PointSourcePolygon | PIXI.Polygon;

    /**
     * If this vision source background is rendered into the lighting container.
     */
    get preferred(): boolean;

    override get isAnimated(): boolean;

    protected override _initialize(data: Partial<VisionSourceData>): void;

    protected override _configure(changes: Partial<VisionSourceData>): void;

    protected override _configureLayer(layer: RenderedPointSource.RenderedPointSourceLayer, layerId: string): void;

    /** Responsible for assigning the Vision Mode and handling exceptions based on vision special status. */
    protected _initializeVisionMode(): void;

    override _getPolygonConfiguration(): PointSourcePolygonConfig;

    /** Create a restricted FOV polygon by limiting the radius of the unrestricted LOS polygon. */
    protected _createRestrictedPolygon(): PointSourcePolygon;

    protected override _configureShaders(): {
      background: AdaptiveLightingShader;
      coloration: AdaptiveLightingShader;
      illumination: AdaptiveLightingShader;
    };

    /**
     * Update shader uniforms by providing data from this VisionSource
     */
    protected _updateColorationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this VisionSource
     */
    protected _updateIlluminationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this VisionSource
     */
    protected _updateBackgroundUniforms(): void;

    /**
     * Update shader uniforms shared by all shader types
     * @param shader - The shader being updated
     * @internal
     */
    _updateCommonUniforms(shader: AdaptiveVisionShader): void;

    /**
     * Update layer uniforms according to vision mode uniforms, if any.
     * @param shader      - The shader being updated.
     * @param vmUniforms  - The targeted layer.
     * @internal
     */
    _updateVisionModeUniforms(
      shader: AdaptiveVisionShader,
      vmUniforms: Array<[uniform: string, value: AbstractBaseShader.UniformValue]>,
    ): void;
  }

  interface VisionSourceData extends RenderedPointSourceData {
    /**
     * The amount of contrast
     * @defaultValue `0`
     */
    contrast: number;
    /**
     * Strength of the attenuation between bright, dim, and dark
     * @defaultValue `0.5`
     */
    attenuation: number;
    /**
     * The amount of color saturation
     * @defaultValue `0`
     */
    saturation: number;
    /**
     * The vision brightness.
     * @defaultValue `0`
     */
    brightness: number;
    /**
     * The vision mode.
     * @defaultValue `"basic"`
     * */
    visionMode: string;
    /**
     * Is this vision source blinded?
     * @defaultValue `false`
     * */
    blinded: boolean;
  }
}
