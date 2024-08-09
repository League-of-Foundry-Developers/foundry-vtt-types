import type { AnyObject, EmptyObject } from "../../../../types/utils.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

/**
 * A base class for providing Actor Sheet behavior using ApplicationV2.
 */
export default class ActorSheetV2<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends
    DocumentSheetV2.Configuration<Actor.ConfiguredInstance> = DocumentSheetV2.Configuration<Actor.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends DocumentSheetV2<Actor.ConfiguredInstance, RenderContext, Configuration, RenderOptions> {}
