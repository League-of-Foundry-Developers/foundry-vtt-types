import { ConfiguredObjectClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
   * @typeParam Options - the type of the options object
   */
  class TileHUD<Options extends ApplicationOptions = ApplicationOptions> extends BasePlaceableHUD<
    ConcreteTile,
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

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override setPosition(options?: Partial<Application.Position>): void;
  }
}

type ConcreteTile = InstanceType<ConfiguredObjectClassForName<"Tile">>;
