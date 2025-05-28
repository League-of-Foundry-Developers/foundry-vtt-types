import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * The Application responsible for displaying and editing a single JournalEntry Document.
 * @remarks TODO: Stub
 */
declare class JournalEntrySheet<
  RenderContext extends JournalEntrySheet.RenderContext = JournalEntrySheet.RenderContext,
  Configuration extends JournalEntrySheet.Configuration = JournalEntrySheet.Configuration,
  RenderOptions extends JournalEntrySheet.RenderOptions = JournalEntrySheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace JournalEntrySheet {
  interface RenderContext extends DocumentSheetV2.RenderContext<JournalEntry.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<JournalEntry.Implementation> {}

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}

  interface CategoryContext {
    /** The category ID. */
    id: string;

    /** The category name. */
    name: string;
  }
}

export default JournalEntrySheet;
