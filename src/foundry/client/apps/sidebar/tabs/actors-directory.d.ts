/**
 * The sidebar directory which organizes and displays world-level Actor documents.
 */
declare class ActorDirectory extends SidebarDirectory<"Actor"> {
  constructor(...args: ConstructorParameters<typeof SidebarDirectory>);

  static override documentName: "Actor";

  protected override _canDragStart(selector: string): boolean;

  protected override _onDragStart(event: DragEvent): void;

  protected override _canDragDrop(selector: string): boolean;

  protected override _getEntryContextOptions(): ContextMenuEntry[];
}
