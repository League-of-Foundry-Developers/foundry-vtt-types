import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Cards documents.
   */
  class CardsDirectory extends DocumentDirectory<"Cards"> {
    static override documentName: "Cards";

    protected override _getEntryContextOptions(): ContextMenuEntry[];
  }

  namespace CardsDirectory {
    interface Any extends AnyCardsDirectory {}
    interface AnyConstructor extends Identity<typeof AnyCardsDirectory> {}
  }
}

declare abstract class AnyCardsDirectory extends CardsDirectory {
  constructor(arg0: never, ...args: never[]);
}
