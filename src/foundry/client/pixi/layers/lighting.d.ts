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
declare class LightingLayer extends PlaceablesLayer<"AmbientLight", LightingLayer.LayerOptions> {
  constructor();

  /**
   * A mapping of light sources which are active within the rendered Scene
   */
  sources: foundry.utils.Collection<LightSource>;

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
  darknessLevel: number;

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
   * The background container which visualizes the background
   * @defaultValue `null`
   */
  background: PIXI.Container | null;

  /**
   * An array of light sources which are currently animated
   * @internal
   */
  protected _animatedSources: LightSource[];

  /**
   * A mapping of different light level channels
   * @defaultValue `undefined`
   */
  channels: ChannelConfig | undefined;

  static override documentName: "AmbientLight";

  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["lighting"];

  /**
   * @defaultValue
   * ```
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "lighting",
   *  rotatableObjects: true,
   *  zIndex: 300
   * })
   * ```
   */
  static override get layerOptions(): LightingLayer.LayerOptions;

  /**
   * TODO: Significant portions of this method may no longer be needed
   * Configure the lighting channels which are inputs to the ShadowMap
   * @internal
   */
  protected _configureChannels({
    darkness,
    backgroundColor
  }?: {
    /** Darkness level override. */
    darkness?: number;

    /** Canvas background color override. */
    backgroundColor?: number;
  }): ChannelConfig;

  override draw(): Promise<this>;

  masks?: PIXI.Container;

  /**
   * Draw the coloration container which is responsible for rendering the visible hue of a light source.
   * Apply an additive blend to the entire container after each individual light source is blended via screen.
   * @internal
   */
  protected _drawColorationContainer(): PIXI.Container;

  /**
   * Draw the illumination container which is responsible for displaying darkness and light.
   * @internal
   */
  protected _drawIlluminationContainer(): PIXI.Container;

  /**
   * Draw the background container which is responsible for displaying altered background.
   * @internal
   */
  protected _drawBackgroundContainer(): PIXI.Container;

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
  refresh({
    darkness,
    backgroundColor
  }?: {
    /**
     * An override darkness level to which the layer should be temporarily
     * rendered.
     */
    darkness?: number;

    /** An override canvas background color. */
    backgroundColor?: number;
  }): void;

  override tearDown(): Promise<this>;

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
   * @internal
   */
  protected _animateSource(dt: number): void;

  /**
   * Animate a smooth transition of the darkness overlay to a target value.
   * Only begin animating if another animation is not already in progress.
   * @param target   - The target darkness level between 0 and 1
   *                   (default: `1.0`)
   * @returns A Promise which resolves once the animation is complete
   */
  animateDarkness(
    target?: number,
    {
      duration
    }?: {
      /**
       * The desired animation time in milliseconds. Default is 10 seconds
       * @defaultValue `10000`
       */
      duration?: number;
    }
  ): Promise<void>;

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param darkness - The new darkness level
   * @param prior    - The prior darkness level
   * @internal
   */
  protected _onDarknessChange(darkness: number, prior: number): void;

  protected override _onDragLeftStart(event: PIXI.InteractionEvent): Promise<AmbientLight>;

  protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

  protected override _onDragLeftCancel(event: PointerEvent): void;

  protected override _onMouseWheel(event: WheelEvent): void | ReturnType<AmbientLight["rotate"]>;
}

declare namespace LightingLayer {
  interface LayerOptions extends PlaceablesLayer.LayerOptions<"AmbientLight"> {
    name: "lighting";
  }
}

type ChannelConfig = Record<"canvas" | "background" | "black" | "bright" | "dark" | "dim", LightChannel> & {
  darkness: { level: number; rgb: [r: number, g: number, b: number] };
};

interface LightChannel {
  hex: number;
  rgb: [r: number, g: number, b: number];
}
