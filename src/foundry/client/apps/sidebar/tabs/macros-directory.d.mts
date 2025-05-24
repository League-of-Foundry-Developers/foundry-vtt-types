import type { Identity } from "#utils";

declare global {
  /**
   * The directory, not displayed in the sidebar, which organizes and displays world-level Macro documents.
   *
   * @see {@linkcode Macros}        The WorldCollection of Macro Documents
   * @see {@linkcode Macro}         The Macro Document
   * @see {@linkcode MacroConfig}   The Macro Configuration Sheet
   */
  class MacroDirectory extends DocumentDirectory<"Macro"> {
    constructor(options?: Partial<DocumentDirectory.Options>);

    static override documentName: "Macro";
  }

  namespace MacroDirectory {
    interface Any extends AnyMacroDirectory {}
    interface AnyConstructor extends Identity<typeof AnyMacroDirectory> {}
  }
}

declare abstract class AnyMacroDirectory extends MacroDirectory {
  constructor(...args: never);
}
