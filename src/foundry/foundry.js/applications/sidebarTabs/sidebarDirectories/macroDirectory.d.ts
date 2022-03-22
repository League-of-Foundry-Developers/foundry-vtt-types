/**
 * The directory, not displayed in the sidebar, which organizes and displays world-level Macro documents.
 *
 * @see {@link Macros}        The WorldCollection of Macro Entities
 * @see {@link Macro}         The Macro Entity
 * @see {@link MacroConfig}   The Macro Configuration Sheet
 */
declare class MacroDirectory extends SidebarDirectory<'Macro'> {
  constructor(options?: Partial<SidebarDirectoryOptions>);

  /** @override */
  static documentName: 'Macro';

  /**
   * @override
   * @remarks This is never called.
   */
  protected _onCreate(event: Event): Promise<void>;
}
