/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
 */
declare class TileHUD extends BasePlaceableHUD<Tile, TilesLayer> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   id: "tile-hud",
   *   template: "templates/hud/drawing-hud.html"
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

  /** @override */
  getData(): ReturnType<BasePlaceableHUD<Tile, TilesLayer>['getData']> & {
    lockedClass: string;
    visibilityClass: string;
  };

  /** @override */
  setPosition(): void;
}
