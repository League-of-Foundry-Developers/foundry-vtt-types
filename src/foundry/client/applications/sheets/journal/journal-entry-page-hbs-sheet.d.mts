import type JournalEntryPageSheet from "./journal-entry-page-sheet.mjs";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";

/**
 * An abstract subclass that contains specialised handlebars logic for JournalEntryPageSheets.
 * @remarks TODO: Stub
 */
declare class JournalEntryPageHandlebarsSheet<
  RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext = JournalEntryPageHandlebarsSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(JournalEntryPageSheet)<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageHandlebarsSheet {
  interface RenderContext extends JournalEntryPageSheet.RenderContext {}
}

export default JournalEntryPageHandlebarsSheet;
