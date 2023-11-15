import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

// TODO: Define in client/pixi/layers/effects/visibility.js
type CanvasVisibilityTest = unknown;
declare global {
  /** @see {@link foundry.data.LightData} */
  interface LightSourceData extends PointSource.Data {
    /** @defaultValue `0` */
    x: number;

    /** @defaultValue `0` */
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
    animation: PointSource.PointSourceAnimationConfiguration;

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

    /** Strength of the attenuation between bright, dim, and dark */
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

    /** @defaultValue `true` */
    walls: boolean;

    /**
     * Whether or not this source provides a source of vision
     * @defaultValue `false`
     */
    vision: boolean;

    /** An integer seed to synchronize (or de-synchronize) animations */
    seed: number;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of light sources.
   */
  class LightSource extends PointSource {
    /** @param object - The light-emitting object that generates this light source */
    constructor(object: InstanceType<ConfiguredObjectClassForName<"GlobalLightSource" | "AmbientLight" | "Token">>);

    /**
     * The object type for a Light Source.
     * This is a Scene in the case of a global light source
     * This is an AmbientLight placeable object when the source is provided by an AmbientLightDocument
     * This is a Token placeable object when the source is provided by a TokenDocument
     */
    object: InstanceType<ConfiguredObjectClassForName<"GlobalLightSource" | "AmbientLight" | "Token">>;

    /**
     * The light or darkness container for this source
     * @defaultValue `null)`
     */
    background: PIXI.Mesh | null;

    /**
     * The light or darkness container for this source
     * @defaultValue `null`
     */
    illumination: PIXI.Mesh | null;

    /**
     * This visible color container for this source
     * @defaultValue `null`
     */
    coloration: PIXI.Mesh | null;

    /** {@inheritdoc} */
    static override sourceType: "light";

    /**
     * Keys in the LightSourceData structure which, when modified, change the appearance of the light
     * @internal
     * @defaultValue
     * ```javascript
     * [
     *   "dim", "bright", "attenuation", "alpha", "coloration", "color",
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
    data: Partial<LightSourceData>;

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
     * @defaultValue `undefined`
     */
    ratio: number | undefined;

    /**
     * Track which uniforms need to be reset
     * @internal
     * @defaultValue
     * ```javascript
     * {
     *   background: true,
     *   illumination: true,
     *   coloration: true
     * }
     * ```
     */
    protected _resetUniforms: {
      background: boolean;
      illumination: boolean;
      coloration: boolean;
    };

    /**
     * To track if a source is temporarily shutdown to avoid glitches
     * @defaultValue `{ illumination: false }`
     * @internal
     */
    protected _shutdown: { illumination: boolean };

    /** To know if a light source is completely disabled. */
    get disabled(): boolean;

    override get isAnimated(): boolean;

    /**
     * Initialize the source with provided object data.
     * @param data - Initial data provided to the point source.
     * @returns A reference to the initialized source.
     */
    initialize(data?: Partial<LightSourceData> & { color?: string | number | null }): this;

    protected override _getPolygonConfiguration(): PointSourcePolygonConfig;

    /** {@inheritdoc} */
    override _createMeshes(): void;

    /** {@inheritdoc} */
    destroy(): void;

    /**
     * Initialize the PointSource with new input data
     * @param data - Initial data provided to the light source
     * @returns The changes compared to the prior data
     */
    protected _initializeData(
      data: Partial<LightSourceData> & { color?: string | number | null },
    ): Partial<LightSourceData>;

    /**
     * Record internal status flags which modify how the light source is rendered
     */
    protected _initializeFlags(): void;

    /**
     * Initialize the shaders used for this source, swapping to a different shader if the animation has changed.
     * @internal
     */
    protected _initializeShaders(): void;

    /**
     * Initialize the blend mode and vertical sorting of this source relative to others in the container.
     * @internal
     */
    protected _initializeBlending(): void;

    override refreshSource(): void;

    /**
     * Update the visible state of the component channels of this LightSource.
     * @returns Is any channel of this light source active?
     */
    updateVisibility(): boolean;

    /**
     * Test whether this light source is currently suppressed?
     * @internal
     */
    protected _isSuppressed(): boolean;

    /**
     * Render the containers used to represent this light source within the LightingLayer
     */
    drawMeshes(): {
      background: ReturnType<LightSource["drawBackground"]>;
      light: ReturnType<LightSource["drawLight"]>;
      color: ReturnType<LightSource["drawColor"]>;
    };

    /**
     * Create a Mesh for the background component of this source which will be added to CanvasBackgroundEffects.
     * @returns The background mesh for this LightSource, or null
     */
    drawBackground(): PIXI.Container | null;

    /**
     * Create a Mesh for the illumination component of this source which will be added to CanvasIlluminationEffects.
     * @returns The illumination mesh for this LightSource, or null
     */
    drawLight(): PIXI.Container | null;

    /**
     * Create a Mesh for the coloration component of this source which will be added to CanvasColorationEffects.
     * @returns The coloration mesh for this LightSource, or null
     */
    drawColor(): PIXI.Container | null;

    /** Update all layer uniforms.  */
    protected _updateUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    protected _updateColorationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @internal
     */
    protected _updateIlluminationUniforms(): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @param shader - The shader being updated
     * @internal
     */
    protected _updateBackgroundUniforms(shader: AdaptiveBackgroundShader): void;

    /**
     * Update shader uniforms shared by all shader types
     * @param shader - The shader being updated
     * @internal
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
     * @param dt        - Delta time
     * @param speed     - The animation speed, from 1 to 10
     *                    (default: `5`)
     * @param intensity - The animation intensity, from 1 to 10
     *                    (default: `5`)
     * @param reverse   - Reverse the animation direction
     *                    (default: `false`)
     */
    animateTorch(
      dt: number,
      { speed, intensity, reverse }?: { speed: number; intensity: number; reverse: boolean },
    ): void;

    /**
     * An animation with flickering ratio and light intensity
     * @param dt            - Delta time
     * @param speed         - The animation speed, from 1 to 10
     *                        (default: 5)
     * @param intensity     - The animation intensity, from 1 to 10
     *                        (default: 5)
     * @param amplification - Noise amplification (\>1) or dampening (\<1)
     *                        (default: 1)
     * @param reverse       - Reverse the animation direction
     *                        (default: false)
     */
    animateFlickering(
      dt: number,
      {
        speed,
        intensity,
        amplification,
        reverse,
      }?: { speed: number; intensity: number; amplification: number; reverse: boolean },
    ): void;

    /**
     * A basic "pulse" animation which expands and contracts.
     * @param dt        - Delta time
     * @param speed     - The animation speed, from 1 to 10
     *                    (default: `5`)
     * @param intensity - The animation intensity, from 1 to 10
     *                    (default: `5`)
     * @param reverse   - Is the animation reversed?
     *                    (default: `false`)
     */
    animatePulse(
      dt: number,
      { speed, intensity, reverse }?: { speed?: number; intensity?: number; reverse?: boolean },
    ): void;

    /**
     * Emanate waves of light from the source origin point
     * @param dt        - Delta time
     * @param speed     - The animation speed, from 1 to 10
     *                    (default: `5`)
     * @param intensity - The animation intensity, from 1 to 10
     *                    (default: `5`)
     * @param reverse   - Is the animation reversed?
     *                    (default: `false`)
     */
    animateTime(
      dt: number,
      { speed, intensity, reverse }?: { speed?: number; intensity?: number; reverse?: boolean },
    ): void;

    /**
     * Test whether this LightSource provides visibility to see a certain target object.
     * @param tests  - The sequence of tests to perform
     * @param object - The target object being tested
     * @returns Is the target object visible to this source?
     */
    testVisibility({ tests, object }: { tests: CanvasVisibilityTest[]; object: PlaceableObject }): boolean;

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
    /** @defaultValue `Infinity` */
    override get elevation(): number;

    override _createPolygon(): PIXI.Polygon;

    protected override _initializeFlags(): void;

    protected override _isSuppressed(): boolean;
  }
}
