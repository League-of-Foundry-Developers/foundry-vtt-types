import { ConfiguredObjectClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
   * @typeParam Options - the type of the options object
   */
  class TileHUD<Options extends Application.Options = Application.Options> extends BasePlaceableHUD<
    ConcreteObject,
    Options
  > {
    /**
     * @override
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "tile-hud",
     *   template: "templates/hud/tile-hud.html"
     * })
     * ```
     */
    static get defaultOptions(): Application.Options;

    /** @override */
    getData(options?: Partial<Options>): ReturnType<BasePlaceableHUD<ConcreteObject>['getData']> & {
      isVideo: boolean;
      lockedClass: string;
      visibilityClass: string;
      overheadClass: string;
      underfootClass: string;
      videoIcon: string;
      videoTitle: string;
    };

    /**
     * @override
     * @param options - (unused)
     */
    setPosition(options?: Partial<Application.Position>): undefined;
  }
}

type ConcreteObject = InstanceType<ConfiguredObjectClassForName<'Tile'>>;
