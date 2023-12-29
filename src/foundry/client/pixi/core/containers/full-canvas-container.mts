declare global {
  /**
   * A specialized container where bounds are not computed with children, but with canvas dimensions.
   */
  class FullCanvasContainer extends PIXI.Container {
    override calculateBounds(): void;
  }
}
