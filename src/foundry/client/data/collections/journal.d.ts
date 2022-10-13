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
   * Display a dialog which prompts the user to show a JournalEntry or JournalEntryPage to other players.
   * @param doc - The JournalEntry or JournalEntryPage to show.
   */
  static showDialog<ConcreteJournalDocument extends JournalEntry | JournalEntryPage>(
    doc: ConcreteJournalDocument
  ): Promise<ConcreteJournalDocument | void>;

  /**
   * Show the JournalEntry or JournalEntryPage to connected players.
   * By default, the document will only be shown to players who have permission to observe it.
   * If the force parameter is passed, the document will be shown to all players regardless of normal permission.
   * @param doc - The JournalEntry or JournalEntryPage to show.
   * @param options - Additional options to configure behaviour.
   * @returns A Promise that resolves back to the shown document once the request is processed.
   * @throws If the user does not own the document they are trying to show.
   */
  static show<T extends JournalEntry | JournalEntryPage = JournalEntry | JournalEntryPage>(
    doc: T,
    options: Journal.ShowOptions
  ): Promise<T>;

  // FIXME: use image-popout's ShareImageConfig interface for config once it's available
  /**
   * Share an image with connected players.
   * @param src - The image URL to share.
   * @param config - Image sharing configuration.
   */
  static showImage(src: string, config: Journal.ShareImageConfig): void;

  /**
   * Open Socket listeners which transact JournalEntry data
   * @param socket - The open websocket
   */
  static _activateSocketListeners(socket: io.Socket): void;

  /**
   * Handle a received request to show a JournalEntry or JournalEntryPage to the current client
   * @param uuid - The UUID of the document to display for other players
   * @param force - Display the document regardless of normal permissions (default: `false`)
   * @internal
   */
  static _showEntry(uuid: string, force: boolean): Promise<void>;
}
declare namespace Journal {
  interface ShowOptions {
    /**
     * Display the entry to all players regardless of normal permissions.
     * @defaultValue `false`
     */
    force?: boolean | undefined;
    /**
     * An optional list of user IDs to show the document to. Otherwise it will be shown to all connected clients.
     */
    users?: string[] | undefined;
  }
  // FIXME: use image-popout's ShareImageConfig interface for config once it's available
  interface ShareImageConfig {
    /**
     * The image URL to share.
     */
    image: string;

    /**
     * The image title.
     */
    title: string;

    /**
     * The UUID of a Document related to the image, used to determine permission to see the image title.
     */
    uuid?: string | undefined;

    /**
     * If this is provided, the permissions of the related Document will be ignored and the title will be shown based on this parameter.
     */
    showTitle?: boolean | undefined;

    /**
     * A list of user IDs to show the image to.
     */
    users?: string[] | undefined;
  }
}
