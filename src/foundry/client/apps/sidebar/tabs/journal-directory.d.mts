export {};

declare global {
  /**
   * The sidebar directory which organizes and displays world-level JournalEntry documents.
   * @typeParam Options - The type of the options object
   */
  class JournalDirectory extends DocumentDirectory<"JournalEntry"> {
    static override documentName: "JournalEntry";

    protected override _getEntryContextOptions(): ContextMenuEntry[];
  }
}
