/**
 * The default Item Sheet
 *
 * This Application is responsible for rendering an item's attributes and allowing the item to be edited.
 *
 * System modifications may elect to override this class to better suit their own game system by re-defining the value
 * `CONFIG.Item.sheetClass`.
 *
 * @param item - The Item instance being displayed within the sheet.
 * @param options - Additional options which modify the rendering of the item.
 * @param editable - Is the item editable? Default is true.
 * @typeParam T - the type of the data used to render the inner template
 * @typeParam D - the type of the data in the Entity
 * @typeParam O - the type of the Entity which should be managed by this form
 *                sheet
 * @typeParam F - the type of the of validated form data with which to update
 *                the Entity
 */
declare class ItemSheet<
  T = object,
  D = object,
  O extends Item<D> = Item<D>,
  F = object
> extends BaseEntitySheet<T, D, O, F> {
  /**
   * Assign the default options which are supported by this Application
   */
  static get defaultOptions (): BaseEntitySheet.Options

  /**
   * Provide a unique CSS ID for owned Item sheets
   */
  get id (): string

  /**
   * A convenience reference to the Item entity
   */
  get item (): O

  /**
   * The Actor instance which owns this item. This may be null if the item is unowned.
   */
  get actor (): Actor<D>

  /**
   * Activate listeners which provide interactivity for item sheet events
   * @param html - The HTML object returned by template rendering
   */
  activateListeners (html: JQuery): void

  /**
   * @param options - (unused)
   * @override
   */
  getData (options?: any): ItemSheet.Data<D, O>
}

declare namespace ItemSheet {
  /**
   * @typeParam D - the type of the data in the Entity
   * @typeParam O - the type of the Entity which should be managed by this form
   *                sheet
   */
  interface Data<D, O> extends BaseEntitySheet.Data<D, O> {
    data: any
    item: Item<D>
  }
}
