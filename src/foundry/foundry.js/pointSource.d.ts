/**
 * A helper class used by the Sight Layer to represent a source of vision or illumination.
 */
declare class PointSource {
  /**
   * @param object - The object responsible for the PointSource
   */
  constructor(object: PlaceableObject, sourceType: PointSource.SourceType);

  /**
   * The object responsible for the PointSource
   */
  object: PlaceableObject;

  /**
   * The type of source
   */
  sourceType: PointSource.SourceType;

  /**
   * The light or darkness container for this source
   */
  illumination: PIXI.Container;

  /**
   * This visible color container for this source
   */
  coloration: PIXI.Container;

  /**
   * A flag for whether this source is currently active (rendered) or not
   * @defaultValue `false`
   */
  active: boolean;

  /**
   * The range of Scene darkness values for which this Source should be active
   * @defaultValue `{ min: 0, max: 0 }`
   */
  darkness: { min: number; max: number };

  /**
   * Internal flag for whether this is a darkness source
   * @defaultValue `false`
   */
  isDarkness: boolean;

  /**
   * Is the light source limited by an angle of emission?
   * @defaultValue `false`
   */
  limited: boolean;

  /**
   * The maximum radius of emission for this source
   * @defaultValue `0`
   */
  radius: number;

  /**
   * Internal flag for animation throttling time
   * @defaultValue `0`
   * @internal
   */
  protected _animateTime: number;

  /**
   * An integer seed which de-synchronizes otherwise similar animations
   * @defaultValue `null`
   * @internal
   */
  protected _animateSeed: number | null;

  /**
   * A flag for the lighting channels version that this source is using.
   * @defaultValue `0`
   * @internal
   */
  protected _lightingVersion: number;

  /**
   * A flag for whether to re-initialize illumination shader uniforms the next time the light is rendered.
   * @defaultValue `true`
   * @internal
   */
  protected _resetIlluminationUniforms: boolean;

  /**
   * A flag for whether to re-initialize coloration shader uniforms the next time the light is rendered.
   * @defaultValue `true`
   *@internal
   */
  protected _resetColorationUniforms: boolean;

  /**
   * An internal flag for whether to render coloration for this source
   * @defaultValue `false`
   * @internal
   */
  protected _hasColor: boolean;

  /**
   * The default Geometry stored in the GPU for all Point Source meshes.
   */
  static GEOMETRY: PIXI.Geometry;

  /**
   * Create the structure of a source Container which can be rendered to the sight layer shadow-map
   * @returns The constructed light source container
   * @internal
   */
  protected _createContainer(shaderCls: ConstructorOf<AbstractBaseShader>): PIXI.Container;

  /**
   * Initialize the source with provided object data.
   *
   * @param data - Input data which configures the source.
   *
   * @returns A reference to the initialized source
   */
  initialize(data?: PointSource.Data): PointSource.Initialized<this>;

  /**
   * The x-coordinate of the source location
   * @defaultValue `undefined`
   */
  x?: number;

  /**
   * The y-coordinate of the source location
   * @defaultValue `undefined`
   */
  y?: number;

  /**
   * An optional z-index sorting for the source
   * @defaultValue `undefined`
   */
  z?: number | null;

  /**
   * The allowed radius of dim vision or illumination
   * @defaultValue `undefined`
   */
  dim?: number;

  /**
   * The allowed radius of bright vision or illumination
   * @defaultValue `undefined`
   */
  bright?: number;

  /**
   * The angle of emission for this point source
   * @defaultValue `undefined`
   */
  angle?: number;

  /**
   * The angle of rotation for this point source
   * @defaultValue `undefined`
   */
  rotation?: number;

  /**
   * A tint color for the emitted light, if any
   * @defaultValue `undefined`
   */
  color?: number | null;

  /**
   * An opacity for the emitted light, if any
   * @defaultValue `undefined`
   */
  alpha?: number;

  /**
   * The source type from CONST.SOURCE_TYPES
   * @defaultValue `undefined`
   */
  type?: foundry.CONST.SOURCE_TYPES;

  /**
   * An animation configuration for the source
   * @defaultValue `undefined`
   */
  animation?: PointSource.Animation;

  /**
   * An integer seed to synchronize (or de-synchronize) animations
   * @defaultValue `undefined`
   */
  seed?: number;

  /**
   * @defaultValue `undefined`
   */
  colorRGB?: [r: number, g: number, b: number];

  /**
   * @defaultValue `undefined`
   */
  ratio?: number;

  /**
   * @defaultValue `undefined`
   */
  fov?: PIXI.Polygon;

  /**
   * @defaultValue `undefined`
   */
  los?: PIXI.Polygon;

  /**
   * Initialize the shaders used for this animation.
   * Reset the current shader values back to defaults.
   * Swap to a different Shader instance if necessary.
   * @internal
   */
  protected _initializeShaders(): void;

  /**
   * Initialize the blend mode and vertical sorting of this source relative to others in the container.
   * @internal
   */
  protected _initializeBlending(): void;

  /**
   * Draw the display of this source for the darkness/light container of the SightLayer.
   * @returns The rendered light container
   */
  drawLight(): PIXI.Container;

  /**
   * Draw and return a container used to depict the visible color tint of the light source on the LightingLayer
   * @returns An updated color container for the source
   */
  drawColor(): PIXI.Container;

  /**
   * A common helper function for updating the display of a source container.
   * Assign the container position, dimensions, and polygons.
   * @internal
   */
  protected _drawContainer(c: PIXI.Container): PIXI.Container;

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
  animateTorch(dt: number, { speed, intensity }?: PointSource.AnimationProperties): void;

  /**
   * A basic "pulse" animation which expands and contracts.
   * @param dt        - Delta time
   * @param speed     - The animation speed, from 1 to 10
   *                    (default: `5`)
   * @param intensity - The animation intensity, from 1 to 10
   *                    (default: `5`)
   */
  animatePulse(dt: number, { speed, intensity }?: PointSource.AnimationProperties): void;

  /**
   * Emanate waves of light from the source origin point
   * @param dt        - Delta time
   * @param speed     - The animation speed, from 1 to 10
   *                    (default: `5`)
   * @param intensity - The animation intensity, from 1 to 10
   *                    (default: `5`)
   */
  animateTime(dt: number, { speed, intensity }?: PointSource.AnimationProperties): void;

  /**
   * Evolve a value using a stochastic AR(1) process
   * @param y      - The current value
   * @param phi    - The decay rate of prior values
   * @param center - The stationary mean of the series
   * @param sigma  - The volatility of the process - standard deviation of the error term
   * @param max    - The maximum allowed outcome, or null
   * @param min    - The minimum allowed outcome, or null
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
    }: { phi?: number; center?: number; sigma?: number; max?: number | null; min?: number | null }
  ): number;
}

declare namespace PointSource {
  type SourceType = 'light' | 'sight';

  interface Data {
    /**
     * The x-coordinate of the source location
     * @defaultValue `0`
     */
    x?: number;

    /** The y-coordinate of the source location
     * @defaultValue `0`
     */
    y?: number;

    /** An optional z-index sorting for the source
     * @defaultValue `null`
     */
    z?: number | null;

    /** The allowed radius of dim vision or illumination
     * @defaultValue `0`
     */
    dim?: number;

    /** The allowed radius of bright vision or illumination
     * @defaultValue `0`
     */
    bright?: number;

    /** The angle of emission for this point source
     * @defaultValue `360`
     */
    angle?: number;

    /**
     * The angle of rotation for this point source
     * @defaultValue `0`
     */
    rotation?: number;

    /**
     * A tint color for the emitted light, if any
     * @defaultValue `null`
     */
    color?: number | string | null;

    /** An opacity for the emitted light, if any
     * @defaultValue `0.5`
     */
    alpha: number;

    /**
     * A darkness range (min and max) for which the source should be active
     * @defaultValue `{ min: 0, max: 1 }`
     */
    darkness?: { min: number; max: number };

    /**
     * The source type from CONST.SOURCE_TYPES
     * @defaultValue `CONST.SOURCE_TYPES.LOCAL`
     */
    type?: foundry.CONST.SOURCE_TYPES;

    /**
     * An animation configuration for the source
     * @defaultValue `{ type: null }`
     */
    animation?: PointSource.Animation;

    /**
     * An integer seed to synchronize (or de-synchronize) animations
     */
    seed?: number;
  }

  type Initialized<P extends PointSource> = P &
    Required<
      Pick<
        P,
        | 'animation'
        | 'angle'
        | 'alpha'
        | 'bright'
        | 'color'
        | 'dim'
        | 'rotation'
        | 'type'
        | 'x'
        | 'y'
        | 'z'
        | 'colorRGB'
        | 'ratio'
        | 'fov'
        | 'los'
      >
    >;

  interface AnimationProperties {
    speed?: number;
    intensity?: number;
  }
  interface Animation extends AnimationProperties {
    type: null | keyof typeof CONFIG.Canvas.lightAnimations;
  }

  type AnimationFunction = (this: PointSource, dt: number, { speed, intensity }?: AnimationProperties) => void;
}
