import type DocumentSheetV2 from "../../api/document-sheet.d.mts";

/**
 * An abstract Application responsible for displaying and editing a single JournalEntryPage Document.
 * @remarks TODO: Stub
 */
declare class JournalEntryPageSheet<
  RenderContext extends JournalEntryPageSheet.RenderContext = JournalEntryPageSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends DocumentSheetV2<JournalEntryPage.Implementation, RenderContext, Configuration, RenderOptions> {}

declare namespace JournalEntryPageSheet {
  interface RenderContext extends DocumentSheetV2.RenderContext<JournalEntryPage.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<JournalEntryPage.Implementation> {
    /** Whether the sheet includes additional table of contents elements besides its title. */
    includeTOC: boolean;

    /** Whether the sheet is in edit or view mode. */
    mode: "edit" | "view";

    /** Classes appended to the page's root element when embedded in another sheet in view mode. */
    viewClasses: string[];
  }
}

export default JournalEntryPageSheet;
