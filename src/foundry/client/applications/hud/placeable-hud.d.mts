import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      BasePlaceableHUD: BasePlaceableHUD.Any;
    }
  }
}

/**
 * An abstract base class for displaying a heads-up-display interface bound to a Placeable Object on the Canvas.
 * @remarks TODO: Stub
 */
declare class BasePlaceableHUD<
  ActiveHUDObject extends PlaceableObject.Any = PlaceableObject,
  RenderContext extends object = BasePlaceableHUD.RenderContext,
  Configuration extends BasePlaceableHUD.Configuration = BasePlaceableHUD.Configuration,
  RenderOptions extends BasePlaceableHUD.RenderOptions = BasePlaceableHUD.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: BasePlaceableHUD.DefaultOptions;

  /**
   * Reference a PlaceableObject this HUD is currently bound to.
   */
  get object(): ActiveHUDObject;

  /**
   * Convenience access to the Document which this HUD modifies.
   */
  get document(): ActiveHUDObject["document"];

  /**
   * Convenience access for the canvas layer which this HUD modifies
   */
  get layer(): ActiveHUDObject["layer"];
}

declare namespace BasePlaceableHUD {
  interface Any extends AnyBasePlaceableHUD {}
  interface AnyConstructor extends Identity<typeof AnyBasePlaceableHUD> {}

  // TODO: Make generic so it can extend the document source data (calls document#toObject with Object.assign)
  interface RenderContext {
    id: string;
    classes: string;
    appId: string;
    isGM: boolean;
    isGamePaused: boolean;
    // TODO: Remaining properties
  }

  interface Configuration<
    BasePlaceableHUD extends BasePlaceableHUD.Any = BasePlaceableHUD.Any,
  > extends ApplicationV2.Configuration<BasePlaceableHUD> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<BasePlaceableHUD extends BasePlaceableHUD.Any = BasePlaceableHUD.Any> = DeepPartial<
    Configuration<BasePlaceableHUD>
  > &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyBasePlaceableHUD extends BasePlaceableHUD<
  PlaceableObject.Any,
  object,
  BasePlaceableHUD.Configuration,
  BasePlaceableHUD.RenderOptions
> {
  constructor(...args: never);
}

export default BasePlaceableHUD;
