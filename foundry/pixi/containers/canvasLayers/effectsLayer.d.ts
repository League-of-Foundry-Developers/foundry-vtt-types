/**
 * A CanvasLayer for displaying visual effects like weather, transitions, flashes, or more
 */
declare class EffectsLayer extends CanvasLayer {
  constructor();

  /**
   * The weather overlay container
   * @defaultValue `null`
   */
  weather: PIXI.Container | null;

  /**
   * The currently active weather effect
   * @defaultValue `null`
   */
  weatherEffect: SpecialEffect | null;

  /**
   * Track any active emitters within this Scene
   * @defaultValue `[]`
   */
  emitters: unknown[]; // I don't believe that this is ever populated right now - Bolts

  /** @override
   * @defaultValue `mergeObject(super.layerOptions, { zIndex: 300 })`
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  /** @override */
  tearDown(): void;

  /**
   * @override
   */
  draw(): Promise<void>;

  drawWeather(): void;
}
