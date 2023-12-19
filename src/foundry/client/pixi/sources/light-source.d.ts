export {};

// TODO: Define in client/pixi/layers/effects/visibility.js
type CanvasVisibilityTest = unknown;

declare global {
  interface LightSourceData extends RenderedPointSourceData {
    /**
     * An opacity for the emitted light, if any
     * @defaultValue `0.5`
     */
    alpha: number;

    /**
     * An animation configuration for the source
     * @defaultValue `{}`
     */
    animation: RenderedPointSource.RenderedPointSourceAnimationConfig;

    /**
     * The allowed radius of bright vision or illumination
     * @defaultValue `0`
     */
    bright: number;

    /**
     * The coloration technique applied in the shader
     * @defaultValue `1`
     */
    coloration: number;

    /**
     * The amount of contrast this light applies to the background texture
     * @defaultValue `0`
     */
    contrast: number;

    /**
     * The allowed radius of dim vision or illumination
     * @defaultValue `0`
     */
    dim: number;

    /**
     * Strength of the attenuation between bright, dim, and dark
     * @defaultValue `0.5`
     */
    attenuation: number;

    /**
     * The luminosity applied in the shader
     * @defaultValue `0.5`
     */
    luminosity: number;

    /**
     * The amount of color saturation this light applies to the background texture
     * @defaultValue `0`
     */
    saturation: number;

    /**
     * The depth of shadows this light applies to the background texture
     * @defaultValue `0`
     */
    shadows: number;

    /**
     * Whether or not this source provides a source of vision
     * @defaultValue `false`
     */
    vision: boolean;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of light sources.
   */
  class LightSource extends RenderedPointSource {
    static override sourceType: "light";

    protected static _initializeShaderKeys: ["animation.type", "walls"];

    static override _refreshUniformsKeys: [
      "dim",
      "bright",
      "attenuation",
      "alpha",
      "coloration",
      "color",
      "contrast",
      "saturation",
      "shadows",
      "luminosity",
    ];

    /**
     * The object of data which configures how the source is rendered
     */
    data: LightSourceData;

    /**
     * The ratio of dim:bright as part of the source radius
     * @defaultValue `0`
     */
    ratio: number;

    /**
     * Is this darkness?
     */
    get isDarkness(): boolean;

    protected _initialize(data: Partial<LightSourceData>): void;

    protected override _configure(changes: Partial<LightSourceData>): void;

    protected override _getPolygonConfiguration(): PointSourcePolygonConfig;

    protected override _initializeBlending(): void;

    protected override _updateColorationUniforms(): void;

    protected override _updateIlluminationUniforms(): void;

    protected override _updateBackgroundUniforms(): void;

    /**
     * Update shader uniforms shared by all shader types
     * @param shader - The shader being updated
     */
    protected _updateCommonUniforms(shader: AdaptiveLightingShader): void;

    /**
     * Map luminosity value to exposure value
     * luminosity[-1  , 0  [ =\> Darkness =\> map to exposure ]   0, 1]
     * luminosity[ 0  , 0.5[ =\> Light    =\> map to exposure [-0.5, 0[
     * luminosity[ 0.5, 1  ] =\> Light    =\> map to exposure [   0, 1]
     * @param lum - The luminosity value
     * @returns The exposure value
     * @internal
     */
    protected _mapLuminosity(lum: number): number;

    /**
     * A torch animation where the luminosity and coloration decays each frame and is revitalized by flashes
     * @param dt      - Delta time
     * @param options - Additional options which modify the flame animation
     */
    animateTorch(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * (default: `5`)
         */
        speed: number;
        /**
         * The animation intensity, from 1 to 10
         * (default: `5`)
         */
        intensity: number;
        /**
         * Reverse the animation direction
         * (default: `false`)
         */
        reverse: boolean;
      },
    ): void;

    /**
     * An animation with flickering ratio and light intensity
     * @param dt      - Delta time
     * @param options - Additional options which modify the flame animation
     */
    animateFlickering(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * (default: `5`)
         */
        speed: number;
        /**
         * The animation intensity, from 1 to 10
         * (default: `5`)
         */
        intensity: number;
        /**
         * Noise amplification (\>1) or dampening (\<1)
         * (default: 1)
         */
        amplification: number;
        /**
         * Reverse the animation direction
         * (default: `false`)
         */
        reverse: boolean;
      },
    ): void;

    /**
     * A basic "pulse" animation which expands and contracts.
     * @param dt        - Delta time
     * @param options - Additional options which modify the flame animation
     */
    animatePulse(
      dt: number,
      options?: {
        /**
         * The animation speed, from 1 to 10
         * (default: `5`)
         */
        speed: number;
        /**
         * The animation intensity, from 1 to 10
         * (default: `5`)
         */
        intensity: number;
        /**
         * Reverse the animation direction
         * (default: `false`)
         */
        reverse: boolean;
      },
    ): void;

    /**
     * Test whether this LightSource provides visibility to see a certain target object.
     * @param config - The visibility test configuration
     * @returns Is the target object visible to this source?
     */
    testVisibility(config: {
      /** The sequence of tests to perform */
      tests: CanvasVisibilityTest[];
      /** The target object being tested */
      object: PlaceableObject;
    }): boolean;

    /**
     * Can this LightSource theoretically detect a certain object based on its properties?
     * This check should not consider the relative positions of either object, only their state.
     * @param target  - The target object being tested
     * @returns Can the target object theoretically be detected by this vision source?
     */
    _canDetectObject(target: PlaceableObject): boolean;
  }

  /**
   * A specialized subclass of the LightSource which is used to render global light source linked to the scene.
   */
  class GlobalLightSource extends LightSource {
    override _createPolygon(): PIXI.Polygon;

    protected override _configureSoftEdges(): void;

    /**
     * @remarks Sets attenuation to 0
     */
    protected override _initialize(data: Partial<LightSourceData>): void;
  }
}
