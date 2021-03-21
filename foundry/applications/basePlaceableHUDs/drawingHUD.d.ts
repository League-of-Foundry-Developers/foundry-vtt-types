/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
 */
declare class DrawingHUD extends BasePlaceableHUD<Drawing> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   id: "drawing-hud",
   *   template: "templates/hud/drawing-hud.html"
   * })
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.getData(), {
   *   lockedClass: data.locked ? "active" : "",
   *   visibilityClass: data.hidden ? "active" : "",
   * })
   * ```
   */
  getData(): ReturnType<BasePlaceableHUD<Drawing>['getData']> & {
    lockedClass: string;
    visibilityClass: string;
  };

  /** @override */
  setPosition(): void;
}
