import type { Identity } from "#utils";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageProseMirrorSheet: JournalEntryPageProseMirrorSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with a ProseMirror editor.
 */
declare class JournalEntryPageProseMirrorSheet<
  RenderContext extends JournalEntryPageProseMirrorSheet.RenderContext = JournalEntryPageProseMirrorSheet.RenderContext,
  Configuration extends JournalEntryPageProseMirrorSheet.Configuration = JournalEntryPageProseMirrorSheet.Configuration,
  RenderOptions extends JournalEntryPageProseMirrorSheet.RenderOptions = JournalEntryPageProseMirrorSheet.RenderOptions,
> extends JournalEntryPageTextSheet<RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageProseMirrorSheet {
  interface Any extends AnyJournalEntryPageProseMirrorSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageProseMirrorSheet> {}

  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {}
  interface Configuration extends JournalEntryPageTextSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageTextSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageProseMirrorSheet extends JournalEntryPageProseMirrorSheet<
  JournalEntryPageProseMirrorSheet.RenderContext,
  JournalEntryPageProseMirrorSheet.Configuration,
  JournalEntryPageProseMirrorSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageProseMirrorSheet;
