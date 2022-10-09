import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  class JournalPageSheet<Options extends JournalSheetOptions = JournalSheetOptions> extends DocumentSheet<
    Options,
    ConcreteJournalPage
  > {
    /**
     * @default
     * ```typescript
     * return foundry.utils.mergeObject(super.defaultOptions, {
     *  classes: ["sheet", "journal-sheet", "journal-entry-page"],
     *  width: 600,
     *  height: 680,
     *  resizable: true,
     *  closeOnSubmit: false,
     *  submitOnClose: true,
     *  viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
     * });
     * ```
     */
    static override get defaultOptions(): JournalPageSheet.Options;
  }

  namespace JournalPageSheet {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Options extends DocumentSheetOptions {}
  }
}

type ConcreteJournalPage = InstanceType<ConfiguredDocumentClass<typeof JournalEntryPage>>;
