/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
 */
declare class DrawingHUD extends BasePlaceableHUD<Drawing, DrawingsLayer> {
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
  static get defaultOptions(): Application.Options;

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
  getData(): ReturnType<BasePlaceableHUD<Drawing, DrawingsLayer>['getData']> & {
    lockedClass: string;
    visibilityClass: string;
  };

  /** @override */
  setPosition(): void;
}
