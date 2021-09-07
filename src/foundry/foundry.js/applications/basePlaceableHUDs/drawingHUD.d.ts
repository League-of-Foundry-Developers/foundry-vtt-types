import { ConfiguredObjectClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Drawing objects.
   * @typeParam Options - the type of the options object
   */
  class DrawingHUD<Options extends Application.Options = Application.Options> extends BasePlaceableHUD<
    ConcreteObject,
    Options
  > {
    /**
     * @override
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "drawing-hud",
     *   template: "templates/hud/drawing-hud.html"
     * })
     * ```
     */
    static get defaultOptions(): Application.Options;

    /** @override */
    getData(options?: Partial<Options>): ReturnType<BasePlaceableHUD<ConcreteObject>['getData']> & {
      lockedClass: string;
      visibilityClass: string;
    };

    /**
     * @override
     * @param options - (unused)
     */
    setPosition(options?: Partial<Application.Position>): undefined;
  }
}

type ConcreteObject = InstanceType<ConfiguredObjectClassForName<'Drawing'>>;
