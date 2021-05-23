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
declare class LightingLayer extends PlaceablesLayer<AmbientLight> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   rotatableObjects: true,
   *   objectClass: AmbientLight,
   *   quadtree: true,
   *   sheetClass: LightConfig,
   *   zIndex: 200
   * })
   * ```
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  constructor();

  /**
   * A mapping of different light level channels
   */
  channels: Record<'background' | 'black' | 'bright' | 'canvas' | 'dark' | 'dim', LightChannel>;

  /**
   * The coloration container which visualizes the effect of light sources
   */
  coloration: PIXI.Container | null;

  /**
   * The current client setting for whether global illumination is used or not
   */
  globalLight: boolean;

  /**
   * The illumination container which visualizes darkness and light
   */
  illumination: PIXI.Container | null;

  /**
   * A mapping of light sources which are active within the rendered Scene
   */
  sources: Collection<PointSource>;

  /**
   * An array of light sources which are currently animated
   */
  protected _animatedSources: PointSource[];

  /**
   * A flag for whether the darkness level is currently animating
   @defaultValue `false`
   */
  protected _animating: boolean;

  /**
   * The blur distance for soft shadows
   * @defaultValue `0`
   */
  protected _blurDistance: number;

  /**
   * The currently displayed darkness level, which may override the saved Scene value
   */
  protected darknessLevel: number | null;

  /**
   * Activate light source animation for AmbientLight objects within this layer
   */
  activateAnimation(): void;

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
   * Deactivate light source animation for AmbientLight objects within this layer
   */
  deactivateAnimation(): void;

  /**
   * @override
   */
  draw(): Promise<this>;

  /**
   * Does this scene currently benefit from global illumination?
   */
  hasGlobalIllumination(): boolean;

  /**
   * Refresh the active display of the LightingLayer.
   * Update the scene background color, light sources, and darkness sources
   */
  refresh(darkness?: number | null): void;

  /** @override */
  tearDown(): Promise<void>;

  /**
   * @deprecated since 0.7.3
   * @see {@link LightingLayer#refresh}
   */
  update(...args: Parameters<LightingLayer['refresh']>): void;

  /**
   * The ticker handler which manages animation delegation
   * @param dt - Delta time
   */
  protected _animateSource(dt: number): void;

  /**
   * Configure the lighting channels which are inputs to the ShadowMap
   */
  protected _configureChannels(
    darkness?: number | null
  ): Record<'background' | 'black' | 'bright' | 'canvas' | 'dark' | 'dim', LightChannel>;

  /**
   * Draw the coloration container which is responsible for rendering the visible hue of a light source.
   * Apply an additive blend to the entire container after each individual light source is blended via screen.
   */
  protected _drawColorationContainer(): PIXI.Container;

  /**
   * Draw the illumination container which is responsible for displaying darkness and light.
   */
  protected _drawIlluminationContainer(): PIXI.Container;

  /** @override */
  protected _onDragLeftCancel(event: PointerEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): Promise<AmbientLight>;

  /**
   * @override
   * @remarks Returns `Promise<AmbientLight> | undefined`
   */
  protected _onMouseWheel(event: WheelEvent): any;
}

declare interface LightChannel {
  hex: number;
  rgb: [number, number, number];
}
