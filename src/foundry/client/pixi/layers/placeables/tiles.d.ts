export {};

declare global {
  /**
   * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
   */
  class TilesLayer extends PlaceablesLayer<"Tile"> {}
}
