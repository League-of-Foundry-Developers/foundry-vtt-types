import type { GetDataReturnType, MaybePromise } from "../../../../utils/index.d.mts";

declare global {
  /**
   * The Application responsible for displaying and editing a single Item document.
   *
   * @param item    - The Item instance being displayed within the sheet.
   * @param options - Additional application configuration options.
   *
   * @typeParam Options - the type of the options object
   */
  class ItemSheet<
    Options extends DocumentSheetOptions<Item.ConfiguredInstance> = DocumentSheetOptions<Item.ConfiguredInstance>,
  > extends DocumentSheet<Options, Item.ConfiguredInstance> {
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
    static get defaultOptions(): DocumentSheetOptions<Item.ConfiguredInstance>;

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
    type Any = ItemSheet<any>;

    interface ItemSheetData<
      Options extends DocumentSheetOptions<Item.ConfiguredInstance> = DocumentSheetOptions<Item.ConfiguredInstance>,
    > extends DocumentSheet.DocumentSheetData<Options, Item.ConfiguredInstance> {
      item: this["document"];
    }
  }
}
