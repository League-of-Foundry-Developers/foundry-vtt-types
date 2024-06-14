export {};

declare global {
  /**
   * The sidebar directory which organizes and displays world-level RollTable documents.
   * @typeParam Options - The type of the options object
   */
  class RollTableDirectory extends DocumentDirectory<"RollTable"> {
    static override documentName: "RollTable";

    protected override _getEntryContextOptions(): ContextMenuEntry[];
  }
}
