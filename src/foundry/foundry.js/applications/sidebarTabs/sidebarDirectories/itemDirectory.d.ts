// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * A directory of Item entities in the Sidebar
 */
declare class ItemDirectory extends SidebarDirectory {
  /**
   * @override
   */
  static get entity(): 'Item';

  /**
   * @override
   * @see {@link Game.items}
   */
  static get collection(): Game['items'];

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragStart(selector: string | null): boolean;

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragDrop(selector: string | null): boolean;

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];
}
