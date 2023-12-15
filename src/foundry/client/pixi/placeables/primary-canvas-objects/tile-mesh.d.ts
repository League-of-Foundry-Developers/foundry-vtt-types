export {};

declare global {
  /**
   * A SpriteMesh which visualizes a Tile object in the PrimaryCanvasGroup.
   */
  class TileMesh extends OccludableObjectMixin(SpriteMesh) {
    override refresh(): void;

    override setPosition(x: number, y: number): void;

    override updateBounds(): void;
  }
}
