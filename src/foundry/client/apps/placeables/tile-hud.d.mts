import type { MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
   * @typeParam Options - the type of the options object
   */
  class TileHUD<Options extends ApplicationOptions = ApplicationOptions> extends BasePlaceableHUD<
    Tile.ConfiguredInstance,
    Options
  > {
    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "tile-hud",
     *   template: "templates/hud/tile-hud.html"
     * })
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: Implement GetDataReturnType

    override setPosition(options?: Partial<Application.Position>): void;

    protected override _onClickControl(event: JQuery.ClickEvent): void | this;

    protected _onToggleOverhead(event: PointerEvent, overhead: boolean): Promise<ReturnType<this["render"]>>;

    protected _onControlVideo(event: PointerEvent): this;
  }

  namespace TileHUD {
    type Any = TileHUD<any>;
  }
}
