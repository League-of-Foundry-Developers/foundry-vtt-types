import type { StoredDocument } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The singleton collection of Folder documents which exist within the active World.
   * This Collection is accessible within the Game object as game.fog.
   *
   * @see {@link Folder} The Folder document
   */
  class Folders extends WorldCollection<typeof foundry.documents.BaseFolder, "Folders"> {
    constructor(data?: StoredDocument<Folder.ConfiguredInstance>["_source"][]);

    /**
     * Track which Folders are currently expanded in the UI
     */
    protected _expanded: Partial<Record<string, boolean>>;

    static documentName: "Folder";

    render(force?: boolean, context?: ApplicationOptions): void;

    /**
     * Refresh the display of any active JournalSheet instances where the folder list will change.
     */
    protected _refreshJournalEntrySheets(): void;
  }
}
