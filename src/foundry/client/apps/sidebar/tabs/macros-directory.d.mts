export {};

declare global {
  /**
   * The directory, not displayed in the sidebar, which organizes and displays world-level Macro documents.
   *
   * @see {@link Macros | `Macros`}        The WorldCollection of Macro Documents
   * @see {@link Macro | `Macro`}         The Macro Document
   * @see {@link MacroConfig | `MacroConfig`}   The Macro Configuration Sheet
   */
  class MacroDirectory extends DocumentDirectory<"Macro"> {
    constructor(options?: Partial<DocumentDirectoryOptions>);

    static override documentName: "Macro";
  }

  namespace MacroDirectory {
    type Any = AnyMacroDirectory;
    type AnyConstructor = typeof AnyMacroDirectory;
  }
}

declare abstract class AnyMacroDirectory extends MacroDirectory {
  constructor(arg0: never, ...args: never[]);
}
