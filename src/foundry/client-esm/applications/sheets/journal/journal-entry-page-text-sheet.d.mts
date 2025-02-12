import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";

/**
 * An abstract Application responsible for displaying and editing a single text-type JournalEntryPage Document.
 */
declare class JournalEntryPageTextSheet<
  RenderContext extends JournalEntryPageTextSheet.RenderContext = JournalEntryPageTextSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageTextSheet {
  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {}
}

export default JournalEntryPageTextSheet;
