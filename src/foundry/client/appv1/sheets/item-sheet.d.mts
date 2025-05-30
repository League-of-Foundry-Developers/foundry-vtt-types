import type { GetDataReturnType, MaybePromise } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      ItemSheet: ItemSheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single Item document.
 *
 * @param item    - The Item instance being displayed within the sheet.
 * @param options - Additional application configuration options.
 *
 * @template Options - the type of the options object
 */
declare class ItemSheet<
  Options extends DocumentSheet.Options<Item.Implementation> = DocumentSheet.Options<Item.Implementation>,
> extends DocumentSheet<Item.Implementation, Options> {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/sheets/item-sheet.html",
   *   width: 500,
   *   closeOnSubmit: false,
   *   submitOnClose: true,
   *   submitOnChange: true,
   *   resizable: true,
   *   baseApplication: "ItemSheet",
   *   id: "item",
   *   secrets: [{parentSelector: ".editor"}]
   * })
   * ```
   */
  static get defaultOptions(): DocumentSheet.Options<Item.Implementation>;

  override get title(): string;

  /**
   * A convenience reference to the Item document
   */
  get item(): this["object"];

  /**
   * The Actor instance which owns this item. This may be null if the item is
   * unowned.
   */
  get actor(): this["item"]["actor"];

  override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<ItemSheet.ItemSheetData>>;
}

declare namespace ItemSheet {
  interface Any extends ItemSheet<any> {}

  interface ItemSheetData<
    Options extends DocumentSheet.Options<Item.Implementation> = DocumentSheet.Options<Item.Implementation>,
  > extends DocumentSheet.DocumentSheetData<Options, Item.Implementation> {
    item: this["document"];
  }
}
export default ItemSheet;
