import type { AnyObject, EmptyObject } from "fvtt-types/utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

/**
 * A base class for providing Item Sheet behavior using ApplicationV2.
 */
export default class ItemSheetV2<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends
    DocumentSheetV2.Configuration<Item.ConfiguredInstance> = DocumentSheetV2.Configuration<Item.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends DocumentSheetV2<Item.ConfiguredInstance, RenderContext, Configuration, RenderOptions> {
  /**
   * The Item document managed by this sheet.
   */
  get item(): this["document"];

  /**
   * The Actor instance which owns this Item, if any.
   */
  get actor(): this["document"]["actor"];
}
