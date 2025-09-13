import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ItemSheetV2: ItemSheetV2.Any;
    }
  }
}

/**
 * A base class for providing Item Sheet behavior using ApplicationV2.
 */
declare class ItemSheetV2<
  RenderContext extends ItemSheetV2.RenderContext = ItemSheetV2.RenderContext,
  Configuration extends ItemSheetV2.Configuration = ItemSheetV2.Configuration,
  RenderOptions extends ItemSheetV2.RenderOptions = ItemSheetV2.RenderOptions,
> extends DocumentSheetV2<Item.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * The Item document managed by this sheet.
   */
  get item(): this["document"];

  /**
   * The Actor instance which owns this Item, if any.
   */
  get actor(): this["document"]["actor"];
}

declare namespace ItemSheetV2 {
  interface Any extends AnyItemSheetV2 {}
  interface AnyConstructor extends Identity<typeof AnyItemSheetV2> {}

  interface RenderContext extends DocumentSheetV2.RenderContext<Item.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Item.Implementation> {}

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyItemSheetV2 extends ItemSheetV2<
  ItemSheetV2.RenderContext,
  ItemSheetV2.Configuration,
  ItemSheetV2.RenderOptions
> {
  constructor(...args: never);
}

export default ItemSheetV2;
