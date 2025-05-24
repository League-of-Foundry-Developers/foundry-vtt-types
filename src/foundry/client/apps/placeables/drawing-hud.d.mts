import type { MaybePromise } from "#utils";

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
   * @template Options - the type of the options object
   */
  class DrawingHUD<Options extends Application.Options = Application.Options> extends BasePlaceableHUD<
    Drawing.Implementation,
    Options
  > {
    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "drawing-hud",
     *   template: "templates/hud/drawing-hud.html"
     * })
     * ```
     */
    static override get defaultOptions(): Application.Options;

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: Implement GetDataReturnType

    override setPosition(options?: Partial<Application.Position>): void;
  }

  namespace DrawingHUD {
    interface Any extends DrawingHUD<any> {}
  }
}
