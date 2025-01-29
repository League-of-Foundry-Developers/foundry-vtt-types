import type { InexactPartial } from "../../../../utils/index.d.mts";

declare global {
  /**
   * The singleton collection of JournalEntry documents which exist within the active World.
   * This Collection is accessible within the Game object as game.journal.
   *
   * @see {@link JournalEntry} The JournalEntry document
   * @see {@link JournalDirectory} The JournalDirectory sidebar directory
   */
  class Journal extends WorldCollection<JournalEntry.ImplementationClass, "Journal"> {
    static documentName: "JournalEntry";

    /**
     * Display a dialog which prompts the user to show a JournalEntry or JournalEntryPage to other players.
     * @param doc - The JournalEntry or JournalEntryPage to show.
     */
    static showDialog<T extends JournalEntry | JournalEntryPage>(doc: T): Promise<T | void>;

    /**
     * Show the JournalEntry or JournalEntryPage to connected players.
     * By default, the document will only be shown to players who have permission to observe it.
     * If the force parameter is passed, the document will be shown to all players regardless of normal permission.
     * @param doc     - The JournalEntry or JournalEntryPage to show.
     * @param options - Additional options to configure behaviour.
     * @returns A Promise that resolves back to the shown document once the request is processed.
     * @throws If the user does not own the document they are trying to show.
     */
    static show<T extends JournalEntry | JournalEntryPage>(
      doc: T,
      options?: InexactPartial<{
        /**
         * Display the entry to all players regardless of normal permissions.
         */
        force: boolean;
        /**
         * An optional list of user IDs to show the document to. Otherwise it will be shown to all connected clients.
         */
        users: string[];
      }>,
    ): Promise<T | void>;

    /**
     * Share an image with connected players.
     * @param src    - The image URL to share.
     * @param config - Image sharing configuration.
     */
    static showImage(src: string, config?: InexactPartial<ImagePopout.ShareImageConfig>): void;

    /**
     * Open Socket listeners which transact JournalEntry data
     * @remarks This is not marked as protected because it is used in {@link Game#activateSocketListeners}
     */
    protected static _activateSocketListeners(socket: io.Socket): void;

    /**
     * Handle a received request to show a JournalEntry or JournalEntryPage to the current client
     * @param uuid - The UUID of the document to display for other players
     * @param force   - Display the document regardless of normal permissions
     *                  (default: `true`)
     */
    protected static _showEntry(uuid: string, force?: boolean): Promise<void>;
  }

  namespace Journal {
    type Any = AnyJournal;
    type AnyConstructor = typeof AnyJournal;
  }
}

declare abstract class AnyJournal extends Journal {
  constructor(arg0: never, ...args: never[]);
}
