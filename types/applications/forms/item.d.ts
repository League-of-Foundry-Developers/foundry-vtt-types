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
 */
declare class ItemSheet<
  DataType = any,
  ItemType extends Item<DataType> = any
> extends BaseEntitySheet {
  /**
   * Assign the default options which are supported by this Application
   */
  static get defaultOptions (): FormApplication.Options

  /**
   * Provide a unique CSS ID for owned Item sheets
   */
  get id (): string

  /**
   * A convenience reference to the Item entity
   */
  get item (): ItemType

  /**
   * The Actor instance which owns this item. This may be null if the item is unowned.
   */
  get actor (): Actor<DataType>

  /**
   * @param options - (unused)
   * @override
   */
  getData (options?: any): ItemSheet.Data<DataType>

  /**
   * Activate listeners which provide interactivity for item sheet events
   * @param html - The HTML object returned by template rendering
   */
  activateListeners (html: JQuery): void
}

declare namespace ItemSheet {
  interface Data<DataType = any> extends BaseEntitySheet.Data<DataType> {
    data: any
    item: Item<DataType>
  }
}
