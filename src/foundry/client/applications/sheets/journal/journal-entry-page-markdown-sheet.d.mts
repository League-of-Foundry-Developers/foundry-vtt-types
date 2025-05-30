import type { Identity } from "#utils";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageMarkdownSheet: JournalEntryPageMarkdownSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with a Markdown editor.
 */
declare class JournalEntryPageMarkdownSheet<
  RenderContext extends JournalEntryPageMarkdownSheet.RenderContext = JournalEntryPageMarkdownSheet.RenderContext,
  Configuration extends JournalEntryPageMarkdownSheet.Configuration = JournalEntryPageMarkdownSheet.Configuration,
  RenderOptions extends JournalEntryPageMarkdownSheet.RenderOptions = JournalEntryPageMarkdownSheet.RenderOptions,
> extends JournalEntryPageTextSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageMarkdownSheet {
  interface Any extends AnyJournalEntryPageMarkdownSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageMarkdownSheet> {}

  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {}
  interface Configuration extends JournalEntryPageTextSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageTextSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageMarkdownSheet extends JournalEntryPageMarkdownSheet<
  JournalEntryPageMarkdownSheet.RenderContext,
  JournalEntryPageMarkdownSheet.Configuration,
  JournalEntryPageMarkdownSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageMarkdownSheet;
