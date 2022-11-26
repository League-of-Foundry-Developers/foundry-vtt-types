import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

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
     *   id: "item"
     * })
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions<Item>;

    override get id(): string;

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

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle changing the item image
     * @internal
     */
    protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker["browse"]>;
  }
}
