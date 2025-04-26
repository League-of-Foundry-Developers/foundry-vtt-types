import type { Identity } from "fvtt-types/utils";
import type { DatabaseAction, DatabaseOperationMap } from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Folder documents which exist within the active World.
   * This Collection is accessible within the Game object as game.fog.
   *
   * @see {@link Folder | `Folder`} The Folder document
   */
  class Folders extends WorldCollection<Folder.ImplementationClass, "Folders"> {
    static documentName: "Folder";

    /**
     * Track which Folders are currently expanded in the UI
     */
    _expanded: Partial<Record<string, boolean>>;

    _onModifyContents<A extends DatabaseAction>(
      action: A,
      documents: readonly Folder.Implementation[],
      result: readonly foundry.documents.BaseFolder.UpdateData[] | readonly string[],
      operation: DatabaseOperationMap[A],
      user: User.Implementation,
    ): void;

    /**
     * Refresh the display of any active JournalSheet instances where the folder list will change.
     */
    protected _refreshJournalEntrySheets(): void;

    render(force?: boolean, context?: Application.Options): void;
  }

  namespace Folders {
    interface Any extends AnyFolders {}
    interface AnyConstructor extends Identity<typeof AnyFolders> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Folder"> {}
    interface Configured extends Document.ConfiguredCollection<"Folder"> {}
  }
}

declare abstract class AnyFolders extends Folders {
  constructor(...args: never);
}
