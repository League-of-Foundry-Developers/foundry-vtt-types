import { DocumentDataType, DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * The client-side JournalEntry document which extends the common BaseJournalEntry model.
   * Each JournalEntry document contains JournalEntryData which defines its data schema.
   *
   * @see {@link data.JournalEntryData}              The JournalEntry data schema
   * @see {@link documents.Journal}                  The world-level collection of JournalEntry documents
   * @see {@link applications.JournalSheet}          The JournalEntry configuration application
   *
   * @param data - Initial data provided to construct the JournalEntry document
   */
  class JournalEntry extends ClientDocumentMixin(foundry.documents.BaseJournalEntry) {
    /**
     * A boolean indicator for whether or not the JournalEntry is visible to the current user in the directory sidebar
     */
    get visible(): boolean;

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
     * @param mode  - Which JournalEntry mode to display? Default is text.
     *                (default: `"text"`)
     * @param force - Display the entry to all players regardless of normal permissions
     *                (default: `false`)
     * @returns A Promise that resolves back to the shown entry once the request is processed
     */
    show(mode?: "text" | "image", force?: boolean): Promise<this>;

    /**
     * If the JournalEntry has a pinned note on the canvas, this method will animate to that note
     * The note will also be highlighted as if hovered upon by the mouse
     * @param options - Options which modify the pan operation
     * @returns A Promise which resolves once the pan animation has concluded
     */
    panToNote(options?: PanToNoteOptions): Promise<void>;

    protected override _onUpdate(
      data: DeepPartial<DocumentDataType<foundry.documents.BaseJournalEntry>>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;
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

export {};
