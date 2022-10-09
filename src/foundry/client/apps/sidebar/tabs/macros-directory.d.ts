/**
 * The directory, not displayed in the sidebar, which organizes and displays world-level Macro documents.
 *
 * @see {@link Macros}        The WorldCollection of Macro Documents
 * @see {@link Macro}         The Macro Document
 * @see {@link MacroConfig}   The Macro Configuration Sheet
 */
declare class MacroDirectory extends SidebarDirectory<"Macro"> {
  constructor(options?: Partial<SidebarDirectory.Options>);

  static override documentName: "Macro";
}
