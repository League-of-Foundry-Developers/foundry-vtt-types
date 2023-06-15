// FOUNDRY_VERSION: 10.291

export {};

declare global {
  /** @see {@link foundry.data.LightData} */
  interface LightSourceData extends PointSource.Data {
    /**
     * The x-coordinate of the source location
     * @defaultValue `0`
     */
    x: number;

    /**
     * The y-coordinate of the source location
     * @defaultValue `0`
     */
    y: number;

    /**
     * An optional z-index sorting for the source
     * @defaultValue `null`
     */
    z: number | null;

    /**
     * The angle of rotation for this point source
     * @defaultValue `0`
     */
    rotation: number;

    /**
     * An opacity for the emitted light, if any
     * @defaultValue `0.5`
     */
    alpha: number;

    /**
     * An animation configuration for the source
     * @defaultValue `{ type: null }`
     */
    animation: LightAnimationConfiguration;

    /**
     * The angle of emission for this point source
     * @defaultValue `360`
     */
    angle: number;

    /**
     * The allowed radius of bright vision or illumination
     * @defaultValue `0`
     */
    bright: number;

    /**
     * A tint color for the emitted light, if any
     * @defaultValue `null`
     */
    color: number | null;

    /**
     * The coloration technique applied in the shader
     * @defaultValue `1`
     */
    coloration: number;

    /**
     * The amount of contrast this light applies to the background texture
     * @defaultValue `0.0`
     */
    contrast: number;

    /**
     * A darkness range (min and max) for which the source should be active
     * @defaultValue `{ min: 0, max: 1 }`
     */
    darkness: { min: number; max: number };

    /**
     * The allowed radius of dim vision or illumination
     * @defaultValue `0`
     */
    dim: number;

    /**
     * Strength of the attenuation between bright, dim, and dark
     */
    attenuation: number;

    /**
     * The luminosity applied in the shader
     * @defaultValue `0.0`
     */
    luminosity: number;

    /**
     * The amount of color saturation this light applies to the background texture
     * @defaultValue `0.0`
     */
    saturation: number;

    /**
     * The depth of shadows this light applies to the background texture
     * @defaultValue `0.0`
     */
    shadows: number;

    /**
     * Whether or not the source is constrained by walls
     * @defaultValue `true`
     */
    walls: boolean;

    /**
     * Whether or not this source provides a source of vision
     * @defaultValue `false`
     */
    vision: boolean;

    /**
     * An integer seed to synchronize (or de-synchronize) animations
     */
    seed: number;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of light sources.
   * @param object  - The light-emitting object that generates this light source
   */
  class LightSource extends PointSource {
    constructor(object: AmbientLight | Token);

    /** {@inheritdoc} */
    static sourceType: "light";

    /**
     * Keys in the LightSourceData structure which, when modified, change the appearance of the light
     * @internal
     * @defaultValue
     * ```javascript
     * [
     *   "dim", "bright", "gradual", "alpha", "coloration", "color",
     *   "contrast", "saturation", "shadows", "luminosity"
     * ]
     * ```
     */
    protected static _appearanceKeys: string[];

    /**
     * The computed polygon which expresses the area of effect of this light source
     */
    los: PointSourcePolygon | PIXI.Polygon;

    /**
     * The object of data which configures how the source is rendered
     * @defaultValue `{}`
     */
    data: LightSourceData;

    /**
     * Internal flag for whether this is a darkness source
     * @defaultValue `false`
     */
    isDarkness: boolean;

    /**
     * To know if a light source is a preview or not. False by default.
     * @defaultValue `false`
     */
    preview: boolean;

    /**
     * The ratio of dim:bright as part of the source radius
     */
    ratio: number;

    /**
     * Track which uniforms need to be reset
     * @defaultValue
     * ```typescript
     * {
     *   background: true,
     *   illumination: true,
     *   coloration: true
     * }
     * ```
     * @internal
     */
    _resetUniforms: {
      background: boolean;
      illumination: boolean;
      coloration: boolean;
    };

    /**
     * To track if a source is temporarily shutdown to avoid glitches
     * @defaultValue `{ illumination: false }`
     * @internal
     */
    _shutdown: { illumination: boolean };

    /**
     * Record the current visibility state of this LightSource and its respective channels.
     * @internal
     * @defaultValue
     * ```typescript
     * {
     *   background: true,
     *   illumination: true,
     *   coloration: true,
     *   any: true
     * }
     * ```
     */
    #visibility: {
      background: boolean;
      illumination: boolean;
      coloration: boolean;
      any: boolean;
    };

    /**
     * To know if a light source is completely disabled.
     */
    get disabled(): boolean;

    override get isAnimated(): boolean;

    /**
     * Initialize the source with provided object data.
     * @param data  - Initial data provided to the point source.
     *              (default: `{}`)
     * @returns     A reference to the initialized source.
     */
    initialize(data: object): this;

    override _getPolygonConfiguration(): PointSourcePolygonConfig;

    /** {@inheritdoc} */
    _createMeshes(): void;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    destroy(): void;

    /**
     * Initialize the PointSource with new input data
     * @param data  - Initial data provided to the light source
     * @returns     The changes compared to the prior data
     * @internal
     */
    protected _initializeData(
      data: Partial<LightSourceData> & { color?: string | number | null }
    ): Partial<LightSourceData>;

    /* -------------------------------------------- */

    /**
     * Record internal status flags which modify how the light source is rendered
     * @internal
     */
    protected _initializeFlags(): void;

    /**
     * Initialize the shaders used for this source, swapping to a different shader if the animation has changed.
     * @internal
     */
    _initializeShaders(): void;

    /**
     * Initialize the blend mode and vertical sorting of this source relative to others in the container.
     * @internal
     */
    _initializeBlending(): void;

    /** @override */
    override refreshSource(): void;

    /**
     * Update the visible state of the component channels of this LightSource.
     * @returns   Is any channel of this light source active?
     */
    updateVisibility(): boolean;

    /**
     * Test whether this light source is currently suppressed?
     * @internal
     */
    _isSuppressed(): boolean;

    /**
     * Render the containers used to represent this light source within the LightingLayer
     */
    drawMeshes(): { background: PIXI.Mesh; light: PIXI.Mesh; color: PIXI.Mesh };

    /**
     * Create a Mesh for the background component of this source which will be added to CanvasBackgroundEffects.
     * @returns   The background mesh for this LightSource, or null
     */
    drawBackground(): PIXI.Mesh | null;

    /**
     * Create a Mesh for the illumination component of this source which will be added to CanvasIlluminationEffects.
     * @returns   The illumination mesh for this LightSource, or null
     */
    drawLight(): PIXI.Mesh | null;

    /**
     * Create a Mesh for the coloration component of this source which will be added to CanvasColorationEffects.
     * @returns   The coloration mesh for this LightSource, or null
     */
    drawColor(): PIXI.Mesh | null;

    /**
     * Update all layer uniforms.
     * @internal
     */
    protected _updateUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    _updateColorationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    _updateIlluminationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    _updateBackgroundUniforms(): void;

    /**
     * Update shader uniforms shared by all shader types
     * @param shader    - The shader being updated
     * @internal
     */
    _updateCommonUniforms(shader: AdaptiveLightingShader): void;

    /**
     * Map luminosity value to exposure value
     * luminosity[-1  , 0  [ =&gt; Darkness =&gt; map to exposure ]   0, 1]
     * luminosity[ 0  , 0.5[ =&gt; Light    =&gt; map to exposure [-0.5, 0[
     * luminosity[ 0.5, 1  ] =&gt; Light    =&gt; map to exposure [   0, 1]
     * @param lum   - The luminosity value
     * @returns     The exposure value
     * @internal
     */
    _mapLuminosity(lum: number): number;

    /**
     * An animation with flickering ratio and light intensity
     * @param dt        - Delta time
     * @param options   - Additional options which modify the flame animation
     *                  (default: `{}`)
     */
    animateTorch(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * @defaultValue `5`
         */
        speed: number;

        /**
         * The animation intensity, from 1 to 10
         * @defaultValue `5`
         */
        intensity: number;

        /**
         * Reverse the animation direction
         * @defaultValue `false`
         */
        reverse: boolean;
      }
    ): void;

    /**
     * An animation with flickering ratio and light intensity
     * @param dt        - Delta time
     * @param options   - Additional options which modify the flame animation
     */
    animateFlickering(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * @defaultValue `5`
         */
        speed: number;

        /**
         * The animation intensity, from 1 to 10
         * @defaultValue `5`
         */
        intensity: number;

        /**
         * Reverse the animation direction
         * @defaultValue `false`
         */
        reverse: boolean;

        /**
         * Noise amplification (\>1) or dampening (\<1)
         * @defaultValue `1`
         */
        amplification: number;
      }
    ): void;

    /**
     * A basic "pulse" animation which expands and contracts.
     * @param dt         - Delta time
     * @param options    - Additional options which modify the pulse animation
     *                  (default: `{}`)
     */
    animatePulse(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * @defaultValue `5`
         */
        speed: number;

        /**
         * The animation intensity, from 1 to 10
         * @defaultValue `5`
         */
        intensity: number;

        /**
         * Reverse the animation direction
         * @defaultValue `false`
         */
        reverse: boolean;
      }
    ): void;

    /**
     * Emanate waves of light from the source origin point
     * @param dt         - Delta time
     * @param options    - Additional options which modify the animation
     *                  (default: `{}`)
     */
    animateTime(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * @defaultValue `5`
         */
        speed: number;

        /**
         * The animation intensity, from 1 to 10
         * @defaultValue `5`
         */
        intensity: number;

        /**
         * Reverse the animation direction
         * @defaultValue `false`
         */
        reverse: boolean;
      }
    ): void;

    /**
     * Test whether this LightSource provides visibility to see a certain target object.
     * @param config    - The visibility test configuration
     * @returns         Is the target object visible to this source?
     */
    testVisibility(config?: {
      /**
       * The sequence of tests to perform
       */
      tests: CanvasVisibilityTest[];
      object: PlaceableObject;
    }): boolean;

    /**
     * Can this LightSource theoretically detect a certain object based on its properties?
     * This check should not consider the relative positions of either object, only their state.
     * @param target    - The target object being tested
     * @returns         Can the target object theoretically be detected by this vision source?
     */
    _canDetectObject(target: PlaceableObject): boolean;
  }

  /**
   * A specialized subclass of the LightSource which is used to render global light source linked to the scene.
   * @see LightSource
   * @param object    - The linked scene.
   */
  class GlobalLightSource extends LightSource {
    /** @override */
    override get elevation(): number;

    /** @override */
    override _createPolygon(): PointSourcePolygon | PIXI.Polygon;

    /** @override */
    override _initializeFlags(): void;

    /** @override */
    override _isSuppressed(): boolean;
  }
}
