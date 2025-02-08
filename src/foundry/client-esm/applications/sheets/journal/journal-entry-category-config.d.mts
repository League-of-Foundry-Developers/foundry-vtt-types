import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

// TODO: Replace these references once the new document type is implemented
declare namespace JournalEntryCategory {
  type Implementation = foundry.abstract.Document.Any;
}

/**
 * An Application responsible for managing a journal entry's categories.
 * @remarks TODO: Stub
 */
declare class JournalEntryCategoryConfig<
  RenderContext extends JournalEntryCategoryConfig.RenderContext = JournalEntryCategoryConfig.RenderContext,
  Configuration extends DocumentSheetV2.Configuration = DocumentSheetV2.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntryCategory.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace JournalEntryCategoryConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<JournalEntryCategory.Implementation> {}
}

export default JournalEntryCategoryConfig;
