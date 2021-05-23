/**
 * A helper class used by the Sight Layer to represent a source of vision or illumination.
 */
declare class PointSource {
  static GEOMETRY: PIXI.Geometry;

  constructor();

  /**
   * A flag for whether this source is currently active (rendered) or not
   * @defaultValue `false`
   */
  active: boolean;

  /**
   * An opacity for the emitted light, if any
   * @defaultValue `undefined`
   */
  alpha?: number;

  /**
   * The angle of emission for this point source
   * @defaultValue `undefined`
   */
  angle?: number;

  /**
   * A basic "pulse" animation which expands and contracts.
   * @param dt        - Delta time
   * @param speed     - The animation speed, from 1 to 10
   * @param intensity - The animation intensity, from 1 to 10
   */
  animatePulse: PointSource.AnimationFunction;

  /**
   * Emanate waves of light from the source origin point
   * @param dt        - Delta time
   * @param speed     - The animation speed, from 1 to 10
   * @param intensity - The animation intensity, from 1 to 10
   */
  animateTime: PointSource.AnimationFunction;

  /**
   * A torch animation where the luminosity and coloration decays each frame and is revitalized by flashes
   * @param dt        - Delta time
   * @param speed     - The animation speed, from 1 to 10
   * @param intensity - The animation intensity, from 1 to 10
   */
  animateTorch: PointSource.AnimationFunction;

  /**
   * An animation configuration for the source
   * @defaultValue `undefined`
   */
  animation?: PointSource.Animation;

  /**
   * The allowed radius of bright vision or illumination
   * @defaultValue `undefined`
   */
  bright?: number;

  /**
   * A tint color for the emitted light, if any
   * @defaultValue `undefined`
   */
  color?: number | null;

  /**
   * @defaultValue `undefined`
   */
  colorRGB?: [number, number, number];

  /**
   * This visible color container for this source
   */
  coloration: PIXI.Container;

  /**
   * Internal flag for whether this is a darkness source
   * @defaultValue `false`
   */
  darkness: boolean;

  /**
   * A level of darkness beyond which this light is active
   * @defaultValue `undefined`
   */
  darknessThreshold?: number;

  /**
   * The allowed radius of dim vision or illumination
   * @defaultValue `undefined`
   */
  dim?: number;

  /**
   * @defaultValue `undefined`
   */
  fov?: PIXI.Polygon;

  /**
   * The light or darkness container for this source
   */
  illumination: PIXI.Container;

  /**
   * Is the light source limited by an angle of emission?
   * @defaultValue `false`
   */
  limited: boolean;

  /**
   * @defaultValue `undefined`
   */
  los?: PIXI.Polygon;

  /**
   * The maximum radius of emission for this source
   * @defaultValue `0`
   */
  radius: number;

  /**
   * @defaultValue `undefined`
   */
  ratio?: number;

  /**
   * The angle of rotation for this point source
   * @defaultValue `undefined`
   */
  rotation?: number;

  /**
   * An integer seed to synchronize (or de-synchronize) animations
   * @defaultValue `undefined`
   */
  seed?: number;

  /**
   * The source type from {@link SOURCE_TYPES}
   * @defaultValue `undefined`
   */
  type?: Const.SourceType;

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
   * An integer seed which de-synchronizes otherwise similar animations
   * @defaultValue `null`
   */
  protected _animateSeed: number | null;

  /**
   * Internal flag for animation throttling time
   * @defaultValue `0`
   */
  protected _animateTime: number;

  /**
   * A flag for whether to re-initialize coloration shader uniforms the next time the light is rendered.
   * @defaultValue `true`
   */
  protected _resetColorationUniforms: boolean;

  /**
   * A flag for whether to re-initialize illumination shader uniforms the next time the light is rendered.
   * @defaultValue `true`
   */
  protected _resetIlluminationUniforms: boolean;

  /**
   * Animate the PointSource, if an animation is enabled and if it currently has rendered containers.
   * @param dt - Delta time
   */
  animate(dt: number): void;

  /**
   * Draw and return a container used to depict the visible color tint of the light source on the LightingLayer
   * @returns An updated color container for the source
   */
  drawColor(): PIXI.Container;

  /**
   * Draw the display of this source for the darkness/light container of the SightLayer.
   * @param updateChannels - Is this drawing initiated because lighting channels have changed?
   * @returns The rendered light container
   */
  drawLight({ updateChannels }?: { updateChannels?: boolean }): PIXI.Container;

  /**
   * Initialize the source with provided object data.
   *
   * @param x                 - The x-coordinate of the source location
   *                            (default: `0`)
   * @param y                 - The y-coordinate of the source location
   *                            (default: `0`)
   * @param z                 - An optional z-index sorting for the source
   *                            (default: `null`)
   * @param dim               - The allowed radius of dim vision or illumination
   *                            (default: `0`)
   * @param bright            - The allowed radius of bright vision or illumination
   *                            (default: `0`)
   * @param angle             - The angle of emission for this point source
   *                            (default: `360`)
   * @param rotation          - The angle of rotation for this point source
   *                            (default: `0`)
   * @param color             - A tint color for the emitted light, if any
   *                            (default: `null`)
   * @param alpha             - An opacity for the emitted light, if any
   *                            (default: `0.5`)
   * @param darknessThreshold - A level of darkness beyond which this light is active
   *                            (default: `0`)
   * @param type              - The source type from SOURCE_TYPES
   *                            (default: `SOURCE_TYPES.LOCAL`)
   * @param animation         - An animation configuration for the source
   *                            (default: `{type: null}`)
   * @param seed              - An integer seed to synchronize (or de-synchronize) animations
   *                            (default: `undefined`)
   *
   * @returns A reference to the initialized source
   */
  initialize({
    x,
    y,
    z,
    dim,
    bright,
    angle,
    rotation,
    color,
    alpha,
    darknessThreshold,
    type,
    animation,
    seed
  }?: {
    x?: number;
    y?: number;
    z?: number | null;
    dim?: number;
    bright?: number;
    angle?: number;
    rotation?: number;
    color?: number | string | null;
    alpha?: number;
    darknessThreshold?: number;
    type?: string;
    animation?: PointSource.Animation;
    seed?: number;
  }): this;

  /**
   * Evolve a value using a stochastic AR(1) process
   * @param y      - The current value
   * @param phi    - The decay rate of prior values
   * @param center - The stationary mean of the series
   * @param sigma  - The volatility of the process - standard deviation of the error term
   * @param max    - The maximum allowed outcome, or null
   * @param min    - The minimum allowed outcome, or null
   * @returns The new value of the process
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

  /**
   * Create the structure of a source Container which can be rendered to the sight layer shadow-map
   * @returns The constructed light source container
   */
  protected _createContainer(shaderCls: ConstructorOf<AbstractBaseShader>): PIXI.Container;

  /**
   * A common helper function for updating the display of a source container.
   * Assign the container position, dimensions, and polygons.
   */
  protected _drawContainer(c: PIXI.Container): PIXI.Container;

  /**
   * Initialize the blend mode and vertical sorting of this source relative to others in the container.
   */
  protected _initializeBlending(): void;

  /**
   * Initialize the shaders used for this animation.
   * Reset the current shader values back to defaults.
   * Swap to a different Shader instance if necessary.
   */
  protected _initializeShaders(): void;
}

declare namespace PointSource {
  interface AnimationProperties {
    intensity?: number;
    speed?: number;
  }
  interface Animation extends AnimationProperties {
    type: null | keyof typeof CONFIG.Canvas.lightAnimations;
  }

  type AnimationFunction = (this: PointSource, dt: number, { speed, intensity }?: AnimationProperties) => void;
}
