/**
 * A directory list of JournalEntry entities in the Sidebar
 */
declare class JournalDirectory extends SidebarDirectory {
  /**
   * @override
   */
  static get defaultOptions(): JournalDirectory.Options;

  /**
   * @override
   */
  get title(): string;

  /**
   * @override
   */
  static get entity(): string;

  /**
   * @override
   */
  static get collection(): Journal;

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];
}

declare namespace JournalDirectory {
  interface Options extends SidebarDirectory.Options {
    /**
     * @defaultValue `'journal'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/journal-directory.html'`
     */
    template: string;
  }
}
