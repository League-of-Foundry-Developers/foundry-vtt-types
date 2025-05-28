import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with a ProseMirror editor.
 */
declare class JournalEntryPageProseMirrorSheet<
  RenderContext extends JournalEntryPageProseMirrorSheet.RenderContext = JournalEntryPageProseMirrorSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends JournalEntryPageTextSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageProseMirrorSheet {
  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {}
}

export default JournalEntryPageProseMirrorSheet;
