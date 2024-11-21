import type { AnyObject } from "../../../../types/utils.d.mts";
import type { DatabaseAction, DatabaseOperationMap } from "../../../common/abstract/_types.d.mts";

declare global {
  /**
   * The singleton collection of Folder documents which exist within the active World.
   * This Collection is accessible within the Game object as game.fog.
   *
   * @see {@link Folder} The Folder document
   */
  class Folders extends WorldCollection<typeof foundry.documents.BaseFolder, "Folders"> {
    static documentName: "Folder";

    /**
     * Track which Folders are currently expanded in the UI
     */
    _expanded: Partial<Record<string, boolean>>;

    _onModifyContents<A extends DatabaseAction>(
      action: A,
      documents: Folder.ConfiguredInstance[],
      result: AnyObject[] | readonly string[],
      operation: DatabaseOperationMap[A],
      user: User.ConfiguredInstance,
    ): void;

    /**
     * Refresh the display of any active JournalSheet instances where the folder list will change.
     */
    protected _refreshJournalEntrySheets(): void;

    render(force?: boolean, context?: ApplicationOptions): void;
  }
}
