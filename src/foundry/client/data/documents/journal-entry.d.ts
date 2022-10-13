import { DocumentDataType, DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { JournalEntryDataConstructorData } from "../../../common/data/data.mjs/journalEntryData.js";
import type { BaseUser } from "../../../common/documents.mjs/baseUser.js";

declare global {
  /**
   * The client-side JournalEntry document which extends the common BaseJournalEntry model.
   *
   * @see {@link Journal} The world-level collection of JournalEntry documents
   * @see {@link JournalSheet} The JournalEntry configuration application
   */
  class JournalEntry extends ClientDocumentMixin(foundry.documents.BaseJournalEntry) {
    /**
     * A boolean indicator for whether the JournalEntry is visible to the current user in the directory sidebar
     */
    get visible(): boolean;

    /**
     * Return a reference to the Note instance for this Journal Entry in the current Scene, if any.
     * If multiple notes are placed for this Journal Entry, only the first will be returned.
     */
    get sceneNote(): Note | null;

    /**
     * Show the JournalEntry to connected players.
     * By default, the entry will only be shown to players who have permission to observe it.
     * If the parameter force is passed, the entry will be shown to all players regardless of normal permission.
     *
     * @param force - Display the entry to all players regardless of normal permissions (default: `false`)
     * @returns A Promise that resolves back to the shown entry once the request is processed
     * @remarks Alias for {@link Journal.show}.
     */
    show(force?: boolean): ReturnType<typeof Journal.show<typeof this>>;

    /**
     * If the JournalEntry has a pinned note on the canvas, this method will animate to that note
     * The note will also be highlighted as if hovered upon by the mouse
     * @param options - Options which modify the pan operation (default: `{}`)
     * @returns A Promise which resolves once the pan animation has concluded
     */
    panToNote(options?: JournalEntry.PanToNoteOptions): Promise<void>;

    protected _preCreate(
      data: JournalEntryDataConstructorData,
      options: DocumentModificationOptions,
      user: BaseUser
    ): Promise<void>;

    protected _preUpdate(
      changed: DeepPartial<JournalEntryDataConstructorData>,
      options: DocumentModificationOptions,
      user: BaseUser
    ): Promise<void>;

    protected override _onUpdate(
      data: DeepPartial<DocumentDataType<foundry.documents.BaseJournalEntry>>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;
  }

  namespace JournalEntry {
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
  }
}

export {};
