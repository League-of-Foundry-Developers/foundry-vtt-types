import type { Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageImageSheet: JournalEntryPageImageSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying and editing a single image-type JournalEntryPage Document.
 */
declare class JournalEntryPageImageSheet<
  RenderContext extends JournalEntryPageImageSheet.RenderContext = JournalEntryPageImageSheet.RenderContext,
  Configuration extends JournalEntryPageImageSheet.Configuration = JournalEntryPageImageSheet.Configuration,
  RenderOptions extends JournalEntryPageImageSheet.RenderOptions = JournalEntryPageImageSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageImageSheet {
  interface Any extends AnyJournalEntryPageImageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageImageSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {}
  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageImageSheet extends JournalEntryPageImageSheet<
  JournalEntryPageImageSheet.RenderContext,
  JournalEntryPageImageSheet.Configuration,
  JournalEntryPageImageSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageImageSheet;
