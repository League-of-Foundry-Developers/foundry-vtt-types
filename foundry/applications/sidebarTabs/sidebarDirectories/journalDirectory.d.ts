/**
 * A directory list of JournalEntry entities in the Sidebar
 */
declare class JournalDirectory extends SidebarDirectory<JournalDirectory.Options> {
  /**
   * @override
   * @see {@link Game.journal}
   */
  static get collection(): Game['journal'];

  /**
   * @override
   */
  static get defaultOptions(): JournalDirectory.Options;

  /**
   * @override
   */
  static get entity(): 'JournalEntry';

  /**
   * @override
   */
  get title(): string;

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
