import type { Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryCategoryConfig: JournalEntryCategoryConfig.Any;
    }
  }
}

/**
 * An Application responsible for managing a journal entry's categories.
 * @remarks TODO: Stub
 */
declare class JournalEntryCategoryConfig<
  RenderContext extends JournalEntryCategoryConfig.RenderContext = JournalEntryCategoryConfig.RenderContext,
  Configuration extends JournalEntryCategoryConfig.Configuration = JournalEntryCategoryConfig.Configuration,
  RenderOptions extends JournalEntryCategoryConfig.RenderOptions = JournalEntryCategoryConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace JournalEntryCategoryConfig {
  interface Any extends AnyJournalEntryCategoryConfig {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryCategoryConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<JournalEntry.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<JournalEntry.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryCategoryConfig extends JournalEntryCategoryConfig<
  JournalEntryCategoryConfig.RenderContext,
  JournalEntryCategoryConfig.Configuration,
  JournalEntryCategoryConfig.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryCategoryConfig;
