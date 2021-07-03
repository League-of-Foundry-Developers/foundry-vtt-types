/**
 * The Lighting Layer which displays darkness and light within the rendered Scene.
 * Lighting Layer (Container)
 *   Illumination Container [MULTIPLY]
 *     Background (Graphics)
 *     Light (Container) [LOS Mask]
 *       Source 1, ..., Source N (Container)
 *     Darkness (Container)
 *       Source 1, ..., Source N (Container)
 *   Coloration Container [ADD_NPM]
 *
 * @example <caption>The lightingRefresh hook</caption>
 * ```typescript
 * Hooks.on("lightingRefresh", layer => {});
 * ```
 */
declare class LightingLayer extends PlaceablesLayer<'AmbientLight', LightingLayer.LayerOptions> {
  constructor();

  /**
   * A mapping of light sources which are active within the rendered Scene
   */
  sources: foundry.utils.Collection<PointSource>;

  /**
   * Increment this whenever lighting channels are re-configured.
   * This informs lighting and vision sources whether they need to re-render.
   * @defaultValue `0`
   */
  version: number;

  /**
   * The currently displayed darkness level, which may override the saved Scene value
   * @defaultValue `0`
   */
  protected darknessLevel: number;

  /**
   * The current client setting for whether global illumination is used or not
   * @defaultValue `false`
   */
  globalLight: boolean;

  /**
   * The coloration container which visualizes the effect of light sources
   * @defaultValue `null`
   */
  coloration: PIXI.Container | null;

  /**
   * The illumination container which visualizes darkness and light
   * @defaultValue `null`
   */
  illumination: PIXI.Container | null;

  /**
   * A flag for whether the darkness level is currently animating
   * @defaultValue `false`
   */
  protected _animating: boolean;

  /**
   * An array of light sources which are currently animated
   */
  protected _animatedSources: PointSource[];

  /**
   * A mapping of different light level channels
   * @defaultValue `undefined`
   */
  channels: Record<'background' | 'black' | 'bright' | 'canvas' | 'dark' | 'dim', LightChannel> | undefined;

  /** @override */
  static documentName: 'AmbientLight';

  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): LightingLayer;

  /**
   * @override
   * @defaultValue
   * ```
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "lighting",
   *  rotatableObjects: true,
   *  quadtree: true,
   *  zIndex: 300
   * })
   * ```
   */
  static get layerOptions(): LightingLayer.LayerOptions;

  /**
   * Configure the lighting channels which are inputs to the ShadowMap
   */
  protected _configureChannels(
    darkness?: number | null
  ): Record<'background' | 'black' | 'bright' | 'canvas' | 'dark' | 'dim', LightChannel>;

  /**
   * @override
   */
  draw(): Promise<this>;

  /**
   * Draw the coloration container which is responsible for rendering the visible hue of a light source.
   * Apply an additive blend to the entire container after each individual light source is blended via screen.
   */
  protected _drawColorationContainer(): PIXI.Container;

  /**
   * Draw the illumination container which is responsible for displaying darkness and light.
   */
  protected _drawIlluminationContainer(): PIXI.Container;

  /**
   * Does this scene currently benefit from global illumination?
   */
  hasGlobalIllumination(): boolean;

  /**
   * Initialize all AmbientLight sources which are present on this layer
   */
  initializeSources(): void;

  /**
   * Refresh the active display of the LightingLayer.
   * Update the scene background color, light sources, and darkness sources
   */
  refresh(darkness?: number | undefined): void;

  /** @override */
  tearDown(): Promise<this>;

  /**
   * Activate light source animation for AmbientLight objects within this layer
   */
  activateAnimation(): void;

  /**
   * Deactivate light source animation for AmbientLight objects within this layer
   */
  deactivateAnimation(): void;

  /**
   * The ticker handler which manages animation delegation
   * @param dt - Delta time
   */
  protected _animateSource(dt: number): void;

  /**
   * Animate a smooth transition of the darkness overlay to a target value.
   * Only begin animating if another animation is not already in progress.
   * @param target   - The target darkness level between 0 and 1
   *                   (default: `1.0`)
   * @param duration - The desired animation time in milliseconds. Default is 10 seconds
   *                   (default: `10000`)
   * @returns A Promise which resolves once the animation is complete
   */
  animateDarkness(target?: number, { duration }?: { duration?: number }): Promise<void>;

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param darkness - The new darkness level
   * @param prior    - The prior darkness level
   */
  protected _onDarknessChange(darkness: number, prior: number): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): Promise<AmbientLight>;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftCancel(event: PointerEvent): void;

  /** @override */
  protected _onMouseWheel(event: WheelEvent): void | ReturnType<AmbientLight['rotate']>;
}

declare namespace LightingLayer {
  interface LayerOptions extends PlaceablesLayer.LayerOptions<'AmbientLight'> {
    name: 'lighting';
    rotatableObjects: true;
    quadtree: true;
    zIndex: 300;
  }
}

declare interface LightChannel {
  hex: number;
  rgb: [number, number, number];
}
