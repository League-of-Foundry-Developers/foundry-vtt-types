export {};

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Cards documents.
   */
  class CardsDirectory extends DocumentDirectory<"Cards"> {
    static override documentName: "Cards";

    protected override _getEntryContextOptions(): ContextMenu.Entry[];
  }

  namespace CardsDirectory {
    type Any = AnyCardsDirectory;
    type AnyConstructor = typeof AnyCardsDirectory;
  }
}

declare abstract class AnyCardsDirectory extends CardsDirectory {
  constructor(arg0: never, ...args: never[]);
}
