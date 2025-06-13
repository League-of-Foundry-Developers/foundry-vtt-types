import type JournalEntryPageSheet from "./journal-entry-page-sheet.mjs";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageHandlebarsSheet: JournalEntryPageHandlebarsSheet.Any;
    }
  }
}

/**
 * An abstract subclass that contains specialised handlebars logic for JournalEntryPageSheets.
 * @remarks TODO: Stub
 */
declare class JournalEntryPageHandlebarsSheet<
  RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext = JournalEntryPageHandlebarsSheet.RenderContext,
  Configuration extends JournalEntryPageHandlebarsSheet.Configuration = JournalEntryPageHandlebarsSheet.Configuration,
  RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions = JournalEntryPageHandlebarsSheet.RenderOptions,
> extends HandlebarsApplicationMixin(JournalEntryPageSheet)<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageHandlebarsSheet {
  interface Any extends AnyJournalEntryPageHandlebarsSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageHandlebarsSheet> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, JournalEntryPageSheet.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, JournalEntryPageSheet.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryPageHandlebarsSheet extends JournalEntryPageHandlebarsSheet<
  JournalEntryPageHandlebarsSheet.RenderContext,
  JournalEntryPageHandlebarsSheet.Configuration,
  JournalEntryPageHandlebarsSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageHandlebarsSheet;
