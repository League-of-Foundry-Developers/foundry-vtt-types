/**
 * A specialized container where bounds are not computed with children, but with canvas dimensions.
 */
declare class FullCanvasContainer extends PIXI.Container {
  override calculateBounds(): void;
}
