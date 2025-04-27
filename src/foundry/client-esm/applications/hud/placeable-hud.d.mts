import type ApplicationV2 from "../api/application.d.mts";

/**
 * An abstract base class for displaying a heads-up-display interface bound to a Placeable Object on the Canvas.
 * @remarks TODO: Stub
 */
declare class BasePlaceableHUD<
  ActiveHUDObject extends PlaceableObject.Any = PlaceableObject,
  RenderContext extends object = BasePlaceableHUD.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
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
  // TODO: Make generic so it can extend the document source data (calls document#toObject with Object.assign)
  interface RenderContext {
    id: string;
    classes: string;
    appId: string;
    isGM: boolean;
    isGamePaused: boolean;
    // TODO: Remaining properties
  }
}

export default BasePlaceableHUD;
