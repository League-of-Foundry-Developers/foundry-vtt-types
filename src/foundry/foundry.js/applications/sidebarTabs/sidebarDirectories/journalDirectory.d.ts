/**
 * The sidebar directory which organizes and displays world-level JournalEntry documents.
 */
declare class JournalDirectory extends SidebarDirectory<'JournalEntry'> {
  /** @override */
  static documentName: 'JournalEntry';

  /**
   * @override
   * @defaultValue
   * ```typescript
   * const options = super.defaultOptions;
   * options.id = "journal";
   * options.template = "templates/sidebar/journal-directory.html";
   * return options;
   * ```
   */
  static get defaultOptions(): SidebarDirectoryOptions;

  /**
   * @override
   */
  get title(): string;

  /** @override */
  protected _getEntryContextOptions(): ContextMenuEntry[];
}
