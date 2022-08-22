import { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
   * @typeParam Options - the type of the options object
   */
  class DrawingHUD<Options extends ApplicationOptions = ApplicationOptions> extends BasePlaceableHUD<
    ConcreteDrawing,
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
    static override get defaultOptions(): ApplicationOptions;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override setPosition(options?: Partial<Application.Position>): void;
  }
}

type ConcreteDrawing = InstanceType<ConfiguredObjectClassForName<"Drawing">>;
