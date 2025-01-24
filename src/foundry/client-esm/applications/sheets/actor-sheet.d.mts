import type { AnyObject, EmptyObject } from "../../../../utils/index.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

/**
 * A base class for providing Actor Sheet behavior using ApplicationV2.
 */
export default class ActorSheetV2<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends
    DocumentSheetV2.Configuration<Actor.Implementation> = DocumentSheetV2.Configuration<Actor.Implementation>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends DocumentSheetV2<Actor.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * The Actor document managed by this sheet.
   */
  get actor(): this["document"];

  /**
   * If this sheet manages the ActorDelta of an unlinked Token, reference that Token document.
   */
  get token(): this["document"]["token"];

  protected override _getHeaderControls(): ApplicationV2.HeaderControlsEntry[];

  // ActorSheetV2 *does* override _renderHTML and _replaceHTML but these should always be overridden by the rendering mixin
  // They are both leftovers from Atro hastily testing/putting together these subclasses

  // The class includes a number of protected static functions for its actions
  static #protected;
}
