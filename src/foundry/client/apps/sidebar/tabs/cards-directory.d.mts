export {};

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Cards documents.
   */
  class CardsDirectory extends DocumentDirectory<"Cards"> {
    static override documentName: "Cards";

    protected override _getEntryContextOptions(): ContextMenuEntry[];
  }
}
