import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level JournalEntry documents.
   * @template Options - The type of the options object
   */
  class JournalDirectory extends DocumentDirectory<"JournalEntry"> {
    static override documentName: "JournalEntry";

    protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];
  }

  namespace JournalDirectory {
    interface Any extends AnyJournalDirectory {}
    interface AnyConstructor extends Identity<typeof AnyJournalDirectory> {}
  }
}

declare abstract class AnyJournalDirectory extends JournalDirectory {
  constructor(...args: never);
}
