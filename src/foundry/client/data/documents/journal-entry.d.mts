import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { BaseUser } from "../../../common/documents/_module.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace JournalEntry {
    type ConfiguredClass = ConfiguredDocumentClassForName<"JournalEntry">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations<Temporary extends boolean = false> {
      create: DatabaseCreateOperation<JournalEntry, Temporary>;
      update: DatabaseUpdateOperation<JournalEntry>;
      delete: DatabaseDeleteOperation;
    }
  }

  /**
   * The client-side JournalEntry document which extends the common BaseJournalEntry model.
   *
   * @see {@link Journal}                  The world-level collection of JournalEntry documents
   * @see {@link JournalSheet}          The JournalEntry configuration application
   */
  class JournalEntry extends ClientDocumentMixin(foundry.documents.BaseJournalEntry) {
    /**
     * A boolean indicator for whether or not the JournalEntry is visible to the current user in the directory sidebar
     */
    get visible(): boolean;

    override getUserLevel(user: BaseUser): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

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
