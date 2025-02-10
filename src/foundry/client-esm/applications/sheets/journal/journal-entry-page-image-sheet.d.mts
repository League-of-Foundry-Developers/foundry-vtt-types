import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";

/**
 * An Application responsible for displaying and editing a single image-type JournalEntryPage Document.
 */
declare class JournalEntryPageImageSheet<
  RenderContext extends JournalEntryPageImageSheet.RenderContext = JournalEntryPageImageSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageImageSheet {
  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {}
}

export default JournalEntryPageImageSheet;
