// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The default Item Sheet
 *
 * This Application is responsible for rendering an item's attributes and allowing the item to be edited.
 *
 * System modifications may elect to override this class to better suit their own game system by re-defining the value
 * `CONFIG.Item.sheetClass`.
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the Entity which should be managed by this form sheet
 * @typeParam P - the type of the options object
 */
declare class ItemSheet<
  D extends object = ActorSheet.Data<Actor>,
  O extends Item = D extends ItemSheet.Data<infer T> ? T : Item,
  P extends DocumentSheet.Options = DocumentSheet.Options
> extends DocumentSheet<P, D, O> {
  /**
   * @param item    - The Item instance being displayed within the sheet.
   * @param options - Additional options which modify the rendering of the item.
   */
  constructor(item: O, options?: Partial<P>);

  /**
   * Assign the default options which are supported by this Application
   *
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: 'templates/sheets/item-sheet.html',
   *   width: 500,
   *   closeOnSubmit: false,
   *   submitOnClose: true,
   *   submitOnChange: true,
   *   resizable: true,
   *   baseApplication: 'ItemSheet',
   * });
   * ```
   */
  static get defaultOptions(): typeof DocumentSheet['defaultOptions'];

  /**
   * Provide a unique CSS ID for owned Item sheets
   */
  get id(): string;

  /**
   * A convenience reference to the Item entity
   */
  get item(): O;

  /**
   * The Actor instance which owns this item. This may be null if the item is
   * unowned.
   */
  get actor(): Actor<Actor.Data<any, O['data']>, O> | null;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: any): D | Promise<D>;

  /** @override */
  protected _getHeaderButtons(): Application.HeaderButton[];

  /**
   * Activate listeners which provide interactivity for item sheet events
   * @param html - The HTML object returned by template rendering
   */
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

declare namespace ItemSheet {
  /**
   * @typeParam O - the type of the Entity which should be managed by this form
   *                sheet
   */
  interface Data<O extends Item = Item> extends DocumentSheet.Data<O> {
    data: DocumentSheet.Data<O>['document']['data'];
    item: DocumentSheet.Data<O>['document'];
  }
}
