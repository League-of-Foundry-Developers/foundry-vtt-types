import type { BaseJournalEntry } from "../../../common/documents/_module.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  namespace JournalEntry {
    type Metadata = Document.MetadataFor<JournalEntry>;

    type ConfiguredClass = Document.ConfiguredClassForName<"JournalEntry">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"JournalEntry">;

    interface DatabaseOperations extends Document.Database.Operations<JournalEntry> {}

    // Helpful aliases
    type ConstructorData = BaseJournalEntry.ConstructorData;
    type UpdateData = BaseJournalEntry.UpdateData;
    type Schema = BaseJournalEntry.Schema;
    type Source = BaseJournalEntry.Source;
  }

  /**
   * The client-side JournalEntry document which extends the common BaseJournalEntry model.
   *
   * @see {@link Journal}                  The world-level collection of JournalEntry documents
   * @see {@link JournalSheet}          The JournalEntry configuration application
   */
  class JournalEntry extends ClientDocumentMixin(foundry.documents.BaseJournalEntry) {
    static override metadata: JournalEntry.Metadata;

    static get implementation(): JournalEntry.ConfiguredClass;

    /**
     * A boolean indicator for whether or not the JournalEntry is visible to the current user in the directory sidebar
     */
    get visible(): boolean;

    override getUserLevel(user?: User): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

    /**
     * Return a reference to the Note instance for this Journal Entry in the current Scene, if any.
     * If multiple notes are placed for this Journal Entry, only the first will be returned.
     */
    get sceneNote(): Note | null;

    /**
     * Show the JournalEntry to connected players.
     * By default the entry will only be shown to players who have permission to observe it.
     * If the parameter force is passed, the entry will be shown to all players regardless of normal permission.
     *
     * @param force - Display the entry to all players regardless of normal permissions
     *                (default: `false`)
     * @returns A Promise that resolves back to the shown entry once the request is processed
     */
    show(force?: boolean): Promise<this>;

    /**
     * If the JournalEntry has a pinned note on the canvas, this method will animate to that note
     * The note will also be highlighted as if hovered upon by the mouse
     * @param options - Options which modify the pan operation
     * @returns A Promise which resolves once the pan animation has concluded
     */
    panToNote(options?: PanToNoteOptions): Promise<void>;

    /**
     * @privateRemarks _onUpdate and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */
  }
}

interface PanToNoteOptions {
  /**
   * The speed of the pan animation in milliseconds
   * @defaultValue `250`
   */
  duration?: number;

  /**
   * The resulting zoom level
   * @defaultValue `1.5`
   */
  scale?: number;
}
