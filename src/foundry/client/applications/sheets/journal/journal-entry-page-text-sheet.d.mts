import type { Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageTextSheet: JournalEntryPageTextSheet.Any;
    }
  }
}

/**
 * An abstract Application responsible for displaying and editing a single text-type JournalEntryPage Document.
 */
declare class JournalEntryPageTextSheet<
  RenderContext extends JournalEntryPageTextSheet.RenderContext = JournalEntryPageTextSheet.RenderContext,
  Configuration extends JournalEntryPageTextSheet.Configuration = JournalEntryPageTextSheet.Configuration,
  RenderOptions extends JournalEntryPageTextSheet.RenderOptions = JournalEntryPageTextSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageTextSheet {
  interface Any extends AnyJournalEntryPageTextSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageTextSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {}
  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageTextSheet extends JournalEntryPageTextSheet<
  JournalEntryPageTextSheet.RenderContext,
  JournalEntryPageTextSheet.Configuration,
  JournalEntryPageTextSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageTextSheet;
