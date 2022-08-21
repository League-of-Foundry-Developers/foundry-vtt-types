import type { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

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

    /** Fade the difference between bright, dim, and dark gradually? */
    gradual: boolean;

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

  interface LightAnimationConfiguration {
    /** The human-readable (localized) label for the animation */
    label: string;

    /** The animation function that runs every frame */
    animation: (this: LightSource, dt: number, animation: LightAnimationConfiguration) => void;

    /** A custom illumination shader used by this animation */
    illuminationShader: AdaptiveIlluminationShader;

    /** A custom coloration shader used by this animation */
    colorationShader: AdaptiveColorationShader;

    /** A custom background shader used by this animation */
    backgroundShader: AdaptiveBackgroundShader;

    /** The animation seed */
    seed?: number;

    /** The animation time */
    time?: number;

    /** @defaultValue `null` */
    type?: keyof typeof CONFIG.Canvas.lightAnimations | null;
  }

  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of light sources.
   */
  class LightSource extends PointSource {
    /** @param object - The light-emitting object that generates this light source */
    constructor(object: InstanceType<ConfiguredObjectClassForName<"AmbientLight" | "Token">>);

    /**
     * The light or darkness container for this source
     * @defaultValue `this._createMesh(AdaptiveBackgroundShader)`
     */
    background: PIXI.Mesh;

    /**
     * The light or darkness container for this source
     * @defaultValue `this._createMesh(AdaptiveIlluminationShader)`
     */
    illumination: PIXI.Mesh;

    /**
     * This visible color container for this source
     * @defaultValue `this._createMesh(AdaptiveColorationShader)`
     */
    coloration: PIXI.Mesh;

    static override sourceType: "light";

    /**
     * Strength of the blur for light source edges
     * @defaultValue `3`
     */
    static BLUR_STRENGTH: number;

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
     * The object of data which configures how the source is rendered
     * @defaultValue `{}`
     */
    data: Partial<LightSourceData>;

    /**
     * The animation configuration applied to this source
     * @defaultValue `{}`
     */
    animation: LightAnimationConfiguration;

    /**
     * Internal flag for whether this is a darkness source
     * @defaultValue `false`
     */
    isDarkness: boolean;

    /**
     * The rendered field-of-vision texture for the source for use within shaders.
     * @defaultValue `undefined`
     */
    fovTexture: PIXI.RenderTexture | undefined;

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

    /**
     * Initialize the source with provided object data.
     * @param data - Initial data provided to the point source
     * @returns A reference to the initialized source
     */
    initialize(data?: Partial<LightSourceData> & { color?: string | number | null }): this;

    /**
     * Initialize the PointSource with new input data
     * @param data - Initial data provided to the light source
     * @returns The changes compared to the prior data
     * @internal
     */
    protected _initializeData(
      data: Partial<LightSourceData> & { color?: string | number | null }
    ): Partial<LightSourceData>;

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

    /**
     * Render the containers used to represent this light source within the LightingLayer
     */
    drawMeshes(): {
      background: ReturnType<LightSource["drawBackground"]>;
      light: ReturnType<LightSource["drawLight"]>;
      color: ReturnType<LightSource["drawColor"]>;
    };

    /**
     * Draw the display of this source for background container.
     * @returns The rendered light container
     */
    drawBackground(): PIXI.Container | null;

    /**
     * Draw the display of this source for the darkness/light container of the SightLayer.
     * @returns The rendered light container
     */
    drawLight(): PIXI.Container | null;

    /**
     * Draw and return a container used to depict the visible color tint of the light source on the LightingLayer
     * @returns An updated color container for the source
     */
    drawColor(): PIXI.Container | null;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @param shader - The shader being updated
     * @internal
     */
    protected _updateColorationUniforms(shader: AdaptiveColorationShader): void;

    /**
     * Update shader uniforms by providing data from this PointSource
     * @param shader - The shader being updated
     * @internal
     */
    protected _updateIlluminationUniforms(shader: AdaptiveIlluminationShader): void;

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
     * Animate the PointSource, if an animation is enabled and if it currently has rendered containers.
     * @param dt - Delta time
     */
    animate(dt: number): void;

    /**
     * A torch animation where the luminosity and coloration decays each frame and is revitalized by flashes
     * @param dt        - Delta time
     * @param speed     - The animation speed, from 1 to 10
     *                    (default: `5`)
     * @param intensity - The animation intensity, from 1 to 10
     *                    (default: `5`)
     */
    animateTorch(dt: number, { speed, intensity }?: { speed: number; intensity: number }): void;

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
      { speed, intensity, reverse }?: { speed?: number; intensity?: number; reverse?: boolean }
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
      { speed, intensity, reverse }?: { speed?: number; intensity?: number; reverse?: boolean }
    ): void;

    /**
     * Evolve a value using a stochastic AR(1) process
     * @param y      - The current value
     * @param phi    - The decay rate of prior values
     *                 (default: `0.5`)
     * @param center - The stationary mean of the series
     *                 (default: `0`)
     * @param sigma  - The volatility of the process - standard deviation of the error term
     *                 (default: `0.1`)
     * @param max    - The maximum allowed outcome, or null
     *                 (default: `null`)
     * @param min    - The minimum allowed outcome, or null
     *                 (default: `null`)
     * @returns The new value of the process
     * @internal
     */
    protected _ar1(
      y: number,
      {
        phi,
        center,
        sigma,
        max,
        min
      }?: { phi?: number; center?: number; sigma?: number; max?: number | null; min?: number | null }
    ): number;
  }
}
