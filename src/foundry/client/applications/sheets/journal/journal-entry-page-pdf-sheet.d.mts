import type { Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPagePDFSheet: JournalEntryPagePDFSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying and editing a single pdf-type JournalEntryPage Document.
 */
declare class JournalEntryPagePDFSheet<
  RenderContext extends JournalEntryPagePDFSheet.RenderContext = JournalEntryPagePDFSheet.RenderContext,
  Configuration extends JournalEntryPagePDFSheet.Configuration = JournalEntryPagePDFSheet.Configuration,
  RenderOptions extends JournalEntryPagePDFSheet.RenderOptions = JournalEntryPagePDFSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPagePDFSheet {
  interface Any extends AnyJournalEntryPagePDFSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPagePDFSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {}
  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPagePDFSheet extends JournalEntryPagePDFSheet<
  JournalEntryPagePDFSheet.RenderContext,
  JournalEntryPagePDFSheet.Configuration,
  JournalEntryPagePDFSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPagePDFSheet;
