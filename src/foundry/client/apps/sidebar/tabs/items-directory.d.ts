/**
 * The sidebar directory which organizes and displays world-level Item documents.
 */
declare class ItemDirectory extends SidebarDirectory<"Item"> {
  static override documentName: "Item";

  protected override _canDragDrop(selector: string): boolean;

  protected override _getEntryContextOptions(): ContextMenuEntry[];
}
