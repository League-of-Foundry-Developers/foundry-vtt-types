import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} document.
   */
  abstract class JournalPageSheet<
    Options extends JournalPageSheet.Options = JournalPageSheet.Options
  > extends DocumentSheet<Options, ConcreteJournalPage> {
    /**
     * @param object - The JournalEntryPage instance which is being edited.
     * @param options - Application options
     */
    constructor(object: ConcreteJournalPage, options?: Partial<Options>);

    /**
     * @default
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "journal-sheet", "journal-entry-page"],
     *   width: 600,
     *   height: 680,
     *   resizable: true,
     *   closeOnSubmit: false,
     *   submitOnClose: true,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
     * });
     * ```
     */
    static override get defaultOptions(): JournalPageSheet.Options;
  }

  namespace JournalPageSheet {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Options extends DocumentSheetOptions {}
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} text document.
   */
  abstract class JournalTextPageSheet extends JournalPageSheet {
    // TODO: type declarations for this class
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} image document.
   */
  class JournalImagePageSheet extends JournalPageSheet {
    // TODO: type declarations for this class
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} video document.
   */
  class JournalVideoPageSheet extends JournalPageSheet {
    // TODO: type declarations for this class
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} PDF document.
   */
  class JournalPDFPageSheet extends JournalPageSheet {
    // TODO: type declarations for this class
  }
  /**
   * A subclass of {@link JournalTextPageSheet} that implements a TinyMCE editor.
   */
  class JournalTextTinyMCESheet extends JournalTextPageSheet {
    // TODO: type declarations for this class
  }
  /**
   * A subclass of {@link JournalTextPageSheet} that implements a markdown editor for editing the text content.
   */
  class MarkdownJournalPageSheet extends JournalTextPageSheet {
    // TODO: type declarations for this class
  }
}

type ConcreteJournalPage = InstanceType<ConfiguredDocumentClass<typeof JournalEntryPage>>;
