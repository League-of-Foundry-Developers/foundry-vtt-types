import type { Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageVideoSheet: JournalEntryPageVideoSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying and editing a single video-type JournalEntryPage Document.
 */
declare class JournalEntryPageVideoSheet<
  RenderContext extends JournalEntryPageVideoSheet.RenderContext = JournalEntryPageVideoSheet.RenderContext,
  Configuration extends JournalEntryPageVideoSheet.Configuration = JournalEntryPageVideoSheet.Configuration,
  RenderOptions extends JournalEntryPageVideoSheet.RenderOptions = JournalEntryPageVideoSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageVideoSheet {
  interface Any extends AnyJournalEntryPageVideoSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageVideoSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {}

  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}

  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageVideoSheet extends JournalEntryPageVideoSheet<
  JournalEntryPageVideoSheet.RenderContext,
  JournalEntryPageVideoSheet.Configuration,
  JournalEntryPageVideoSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageVideoSheet;
