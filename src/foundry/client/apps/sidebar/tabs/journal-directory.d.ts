/**
 * The sidebar directory which organizes and displays world-level JournalEntry documents.
 * @typeParam Options - The type of the options object
 */
declare class JournalDirectory<
  Options extends SidebarDirectory.Options = SidebarDirectory.Options
> extends SidebarDirectory<"JournalEntry", Options> {
  static override documentName: "JournalEntry";

  protected override _getEntryContextOptions(): ContextMenuEntry[];
}
