import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * An Application responsible for managing a journal entry's categories.
 * @remarks TODO: Stub
 */
declare class JournalEntryCategoryConfig<
  RenderContext extends JournalEntryCategoryConfig.RenderContext = JournalEntryCategoryConfig.RenderContext,
  Configuration extends JournalEntryCategoryConfig.Configuration = JournalEntryCategoryConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace JournalEntryCategoryConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<JournalEntry.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<JournalEntry.Implementation> {}
}

export default JournalEntryCategoryConfig;
