/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
 */
declare class TileHUD extends BasePlaceableHUD<Tile> {
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
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  getData(): ReturnType<BasePlaceableHUD<Tile>['getData']> & {
    lockedClass: string;
    visibilityClass: string;
  };

  /** @override */
  setPosition(): void;
}
