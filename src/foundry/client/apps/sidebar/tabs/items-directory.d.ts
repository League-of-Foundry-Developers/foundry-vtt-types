/**
 * The sidebar directory which organizes and displays world-level Item documents.
 */
declare class ItemDirectory extends SidebarDirectory<'Item'> {
  /** @override */
  static documentName: 'Item';

  /** @override */
  protected _canDragDrop(selector: string): boolean;

  /** @override */
  protected _getEntryContextOptions(): ContextMenuEntry[];
}
