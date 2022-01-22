import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for displaying and editing a single Item document.
   *
   * @param item    - The Item instance being displayed within the sheet.
   * @param options - Additional application configuration options.
   *
   * @typeParam Options      - the type of the options object
   * @typeParam ConcreteItem - The concrete Item document class that this sheet manages
   * @typeParam Data         - The data structure used to render the handlebars template.
   */
  class ItemSheet<
    Options extends ItemSheet.Options = ItemSheet.Options,
    ConcreteItem extends InstanceType<ConfiguredDocumentClass<typeof Item>> = InstanceType<
      ConfiguredDocumentClass<typeof Item>
    >,
    Data extends object = ItemSheet.Data<Options, ConcreteItem>
  > extends DocumentSheet<Options, Data, ConcreteItem> {
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
     * ```
     */
    static get defaultOptions(): ItemSheet.Options;

    /** @override */
    get id(): string;

    /** @override */
    get title(): string;

    /**
     * A convenience reference to the Item entity
     */
    get item(): InstanceType<ConfiguredDocumentClass<typeof Item>>;

    /**
     * The Actor instance which owns this item. This may be null if the item is
     * unowned.
     */
    get actor(): this['item']['actor'];

    /**
     * @param options - (unused)
     * @override
     *
     * @remarks The implementation in {@link ItemSheet} doesn't return a
     * `Promise` but the return type includes it to allow extending classes to
     * do that.
     */
    getData(options?: Partial<Options>): Data | Promise<Data>;

    /** @override */
    protected _getHeaderButtons(): Application.HeaderButton[];

    /** @override */
    activateListeners(html: JQuery): void;

    /**
     * Handle requests to configure the default sheet used by this Item
     */
    protected _onConfigureSheet(event: JQuery.ClickEvent): void;

    /**
     * Handle changing the item image
     */
    protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;
  }

  namespace ItemSheet {
    /**
     * @typeParam Options - the type of the options object
     */
    interface Data<
      Options extends ItemSheet.Options = ItemSheet.Options,
      ConcreteItem extends InstanceType<ConfiguredDocumentClass<typeof Item>> = InstanceType<
        ConfiguredDocumentClass<typeof Item>
      >
    > extends DocumentSheet.Data<ConcreteItem, Options> {
      item: this['document'];
    }

    type Options = DocumentSheet.Options;
  }
}
