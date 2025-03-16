import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Item documents.
   */
  class ItemDirectory extends DocumentDirectory<"Item"> {
    static override documentName: "Item";

    protected override _canDragDrop(selector: string): boolean;

    protected override _getEntryContextOptions(): ContextMenu.Entry[];
  }

  namespace ItemDirectory {
    interface Any extends AnyItemDirectory {}
    interface AnyConstructor extends Identity<typeof AnyItemDirectory> {}
  }
}

declare abstract class AnyItemDirectory extends ItemDirectory {
  constructor(arg0: never, ...args: never[]);
}
