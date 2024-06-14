export {};

declare global {
  /**
   * The directory, not displayed in the sidebar, which organizes and displays world-level Macro documents.
   *
   * @see {@link Macros}        The WorldCollection of Macro Documents
   * @see {@link Macro}         The Macro Document
   * @see {@link MacroConfig}   The Macro Configuration Sheet
   */
  class MacroDirectory extends DocumentDirectory<"Macro"> {
    constructor(options?: Partial<DocumentDirectoryOptions>);

    static override documentName: "Macro";
  }
}
