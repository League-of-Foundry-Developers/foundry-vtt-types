import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { GetDataReturnType, MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The Application responsible for displaying and editing a single Item document.
   *
   * @param item    - The Item instance being displayed within the sheet.
   * @param options - Additional application configuration options.
   *
   * @typeParam Options - the type of the options object
   */
  class ItemSheet<Options extends DocumentSheetOptions<Item> = DocumentSheetOptions<Item>> extends DocumentSheet<
    Options,
    InstanceType<ConfiguredDocumentClass<typeof Item>>
  > {
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
    static get defaultOptions(): DocumentSheetOptions<Item>;

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

  namespace ItemSheet {
    interface ItemSheetData<Options extends DocumentSheetOptions<Item> = DocumentSheetOptions<Item>>
      extends DocumentSheet.DocumentSheetData<Options, InstanceType<ConfiguredDocumentClass<typeof Item>>> {
      item: this["document"];
    }
  }
}
