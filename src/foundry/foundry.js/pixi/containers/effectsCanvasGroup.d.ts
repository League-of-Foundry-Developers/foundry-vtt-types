/**
 * A container group which contains visual effects rendered above the primary group.
 */
declare class EffectsCanvasGroup extends PIXI.Container {
  constructor();

  walls: WallsLayer;

  lighting: LightingLayer;

  weather: WeatherLayer;

  sight: SightLayer;

  /** @defaultValue `true` */
  sortableChildren: boolean;

  /**
   * The name of this canvas group
   * @defaultValue `"effects"`
   */
  static groupName: string;

  /**
   * Create the member layers of the scene container
   * @internal
   */
  protected _createLayers(): void;
}
