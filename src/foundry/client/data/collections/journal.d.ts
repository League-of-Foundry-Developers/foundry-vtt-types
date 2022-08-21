/**
 * The singleton collection of JournalEntry documents which exist within the active World.
 * This Collection is accessible within the Game object as game.journal.
 *
 * @see {@link JournalEntry} The JournalEntry document
 * @see {@link JournalDirectory} The JournalDirectory sidebar directory
 */
declare class Journal extends WorldCollection<typeof foundry.documents.BaseJournalEntry, "Journal"> {
  static override documentName: "JournalEntry";

  /**
   * Open Socket listeners which transact JournalEntry data
   * @remarks This is not marked as protected because it is used in {@link Game#activateSocketListeners}
   */
  protected static _activateSocketListeners(socket: io.Socket): void;

  /**
   * Handle a received request to show a JournalEntry to the current client
   * @param entryId - The ID of the journal entry to display for other players
   * @param mode    - The JournalEntry mode to display
   *                  (default: `"text"`)
   * @param force   - Display the entry to all players regardless of normal permissions
   *                  (default: `true`)
   */
  protected static _showEntry(entryId: string, mode?: "text" | "image", force?: boolean): Promise<void>;
}
