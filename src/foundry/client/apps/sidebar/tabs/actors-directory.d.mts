export {};

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Actor documents.
   */
  class ActorDirectory extends DocumentDirectory<"Actor"> {
    constructor(...args: ConstructorParameters<typeof DocumentDirectory>);

    static override documentName: "Actor";

    protected override _canDragStart(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): void;

    protected override _canDragDrop(selector: string): boolean;

    protected override _getEntryContextOptions(): ContextMenuEntry[];
  }
}
