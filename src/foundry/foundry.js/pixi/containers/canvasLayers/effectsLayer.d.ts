/**
 * A CanvasLayer for displaying visual effects like weather, transitions, flashes, or more
 */
declare class EffectsLayer extends CanvasLayer<EffectsLayer.LayerOptions> {
  /**
   * The weather overlay container
   * @defaultValue `undefined`
   */
  weather: PIXI.Container | undefined;

  /**
   * The currently active weather effect
   * @defaultValue `undefined`
   */
  weatherEffect: SpecialEffect | undefined;

  /**
   * Track any active emitters within this Scene
   * @defaultValue `[]`
   * @remarks I don't believe that this is ever populated right now - Bolts
   */
  emitters: unknown[];

  /**
   * An occlusion filter that prevents weather from being displayed in certain regions
   * @defaultValue `undefined`
   */
  weatherOcclusionFilter: AbstractBaseMaskFilter | undefined;

  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas['effects'];

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "effects",
   *  zIndex: 700
   * })
   * ```
   */
  static get layerOptions(): EffectsLayer.LayerOptions;

  /** @override */
  tearDown(): Promise<this>;

  /** @override */
  draw(): Promise<undefined>;

  /**
   * Draw the weather container.
   * @returns The weather container, or null if no effect is present
   */
  drawWeather(): Exclude<this['weather'], undefined> | null;
}

declare namespace EffectsLayer {
  interface LayerOptions extends CanvasLayer.LayerOptions {
    name: 'effects';
    zIndex: 700;
  }
}
