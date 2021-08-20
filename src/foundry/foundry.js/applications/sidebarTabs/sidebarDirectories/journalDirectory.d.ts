/**
 * A directory list of JournalEntry entities in the Sidebar
 */
// TODO: Remove when this class is updated!!!
// eslint-disable-next-line
// @ts-ignore
declare class JournalDirectory extends SidebarDirectory<JournalDirectory.Options> {
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
  static get entity(): 'JournalEntry';

  /**
   * @override
   * @see {@link Game.journal}
   */
  static get collection(): Game['journal'];

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenuEntry[];
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
