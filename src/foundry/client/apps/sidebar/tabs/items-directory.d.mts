import type { Identity } from "#utils";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Item documents.
   */
  class ItemDirectory extends DocumentDirectory<"Item"> {
    static override documentName: "Item";

    protected override _canDragDrop(selector: string): boolean;

    protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];
  }

  namespace ItemDirectory {
    interface Any extends AnyItemDirectory {}
    interface AnyConstructor extends Identity<typeof AnyItemDirectory> {}
  }
}

declare abstract class AnyItemDirectory extends ItemDirectory {
  constructor(...args: never);
}
