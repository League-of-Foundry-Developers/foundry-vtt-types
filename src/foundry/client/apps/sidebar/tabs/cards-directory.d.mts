import type { Identity } from "#utils";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Cards documents.
   */
  class CardsDirectory extends DocumentDirectory<"Cards"> {
    static override documentName: "Cards";

    protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];
  }

  namespace CardsDirectory {
    interface Any extends AnyCardsDirectory {}
    interface AnyConstructor extends Identity<typeof AnyCardsDirectory> {}
  }
}

declare abstract class AnyCardsDirectory extends CardsDirectory {
  constructor(...args: never);
}
