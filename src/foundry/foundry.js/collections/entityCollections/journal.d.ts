// TODO: Update this class once the `WorldCollection` is available and typed correctly!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * A directory list of JournalEntry entities in the Sidebar
 */
declare class Journal extends EntityCollection<JournalEntry> {
  /** @override */
  get entity(): string;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /**
   * Open Socket listeners which transact JournalEntry data
   */
  static socketListeners(socket: SocketIOClient.Socket): void;

  /**
   * Handle a received request to show a JournalEntry to the current client
   * @param entryId - The ID of the journal entry to display for other players
   * @param mode    - The JournalEntry mode to display
   * @param force   - Display the entry to all players regardless of normal permissions
   */
  protected static _showEntry(entryId: string, mode?: 'text' | 'image', force?: boolean): void;
}
