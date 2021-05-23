/**
 * The Folders EntityCollection
 */
declare class Folders extends EntityCollection<Folder> {
  /**
   * This tracks which folders are currently expanded in the UI
   */
  protected _expanded: {
    [id: string]: boolean;
  };

  /** @override */
  get entity(): string;

  /** @override */
  render(force?: boolean, context?: any): any; // Mismatched return type

  /**
   * Refresh the display of any active JournalSheet instances where the folder list will change.
   */
  protected _refreshJournalEntrySheets(): void;
}
