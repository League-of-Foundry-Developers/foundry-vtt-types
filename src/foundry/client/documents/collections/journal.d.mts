import type { InexactPartial, Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";
import type { ImagePopout } from "#client/applications/apps/_module.d.mts";

/**
 * The singleton collection of JournalEntry documents which exist within the active World.
 * This Collection is accessible within the Game object as game.journal.
 *
 * @see {@linkcode foundry.documents.JournalEntry}: The JournalEntry document
 * @see {@linkcode foundry.applications.sidebar.tabs.JournalDirectory}: The JournalDirectory sidebar
 */
declare class Journal extends WorldCollection<"JournalEntry", "Journal"> {
  static documentName: "JournalEntry";

  /**
   * Display a dialog which prompts the user to show a JournalEntry or JournalEntryPage to other players.
   * @param doc - The JournalEntry or JournalEntryPage to show.
   */
  static showDialog(doc: JournalEntry.Implementation | JournalEntryPage.Implementation): Promise<void>;

  /**
   * Show the JournalEntry or JournalEntryPage to connected players.
   * By default, the document will only be shown to players who have permission to observe it.
   * If the force parameter is passed, the document will be shown to all players regardless of normal permission.
   * @param doc     - The JournalEntry or JournalEntryPage to show.
   * @param options - Additional options to configure behaviour.
   * @returns A Promise that resolves back to the shown document once the request is processed.
   * @throws If the user does not own the document they are trying to show.
   *
   * @remarks Foundry types the returned `Promise` as including `| void`, but that only occurs if a non-`JournalEntry`,
   * non-`JournalEntryPage` value is passed to `doc`, so it is prevented by typescript.
   */
  static show<Doc extends JournalEntry.Implementation | JournalEntryPage.Implementation>(
    doc: Doc,
    options?: Journal.ShowOptions,
  ): Promise<Doc>;

  /**
   * Share an image with connected players.
   * @param src    - The image URL to share.
   * @param config - Image sharing configuration.
   *
   * @remarks Requires a `title` to be passed in config, or player clients receiving the socket message will error.
   */
  static showImage(src: string, config: Journal.ShowImageOptions): void;

  /**
   * Open Socket listeners which transact JournalEntry data
   * @remarks This is not marked as protected because it is used in {@link Game.activateSocketListeners | `Game#activateSocketListeners`}
   */
  protected static _activateSocketListeners(socket: io.Socket): void;

  /**
   * Handle a received request to show a JournalEntry or JournalEntryPage to the current client
   * @param uuid - The UUID of the document to display for other players
   * @param force   - Display the document regardless of normal permissions (default: `true`)
   */
  protected static _showEntry(uuid: string, force?: boolean): Promise<void>;
}

declare namespace Journal {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyJournal {}
    interface AnyConstructor extends Identity<typeof AnyJournal> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"JournalEntry"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"JournalEntry"> {}

  type _ShowOptions = InexactPartial<{
    /**
     * Display the entry to all players regardless of normal permissions.
     */
    force: boolean;

    /**
     * An optional list of user IDs to show the document to. Otherwise it will be shown to all connected clients.
     */
    users: string[];
  }>;

  interface ShowOptions extends _ShowOptions {}

  /**
   * @remarks `image` is provided by the first param of {@linkcode Journal.showImage}.
   */
  interface ShowImageOptions extends Omit<ImagePopout.ShareImageConfig, "image"> {}

  /**  @deprecated Replaced by {@linkcode Journal.ImplementationClass}. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Journal.Implementation}. */
  type Configured = Implementation;
}

declare abstract class AnyJournal extends Journal {
  constructor(...args: never);
}

export default Journal;
