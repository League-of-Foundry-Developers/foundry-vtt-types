import type { DeepPartial, Identity } from "#utils";
import type Showdown from "showdown";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";

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
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  /**
   * Bi-directional HTML \<-\> Markdown converter.
   * @remarks Constructed after applying {@linkcode CONST.SHOWDOWN_OPTIONS} to the global `showdown` instance.
   */
  protected static _converter: Showdown.Converter;

  /**
   * The format used to edit text content in this sheet.
   * @defaultValue {@linkcode CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML}
   */
  static format: CONST.JOURNAL_ENTRY_PAGE_FORMATS;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Determine if any editors have unsaved changes.
   * @remarks Always `false` in `JournalEntryPageTextSheet`; subclasses which provide an editor override this.
   * @privateRemarks Foundry documents this as returning `boolean`, but
   * {@linkcode foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet._isEditorDirty | JournalEntryPageProseMirrorSheet#_isEditorDirty}
   * returns `undefined` when no editor element is present, so the union is carried here for assignability.
   */
  protected _isEditorDirty(): boolean | undefined;

  /**
   * @remarks Clears any stored markdown so it can be re-converted, when this sheet edits HTML and
   * {@linkcode JournalEntryPageTextSheet._isEditorDirty | #_isEditorDirty} reports unsaved changes.
   */
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>,
  ): DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>;

  #JournalEntryPageTextSheet: true;
}

declare namespace JournalEntryPageTextSheet {
  interface Any extends AnyJournalEntryPageTextSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageTextSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {
    text: TextContext;
  }

  /**
   * @remarks An interface may only extend an identifier, so the page's `text` data is aliased before being
   * extended by {@linkcode TextContext}.
   * @internal
   */
  type _PageTextData = JournalEntryPage.Implementation["text"];

  /**
   * A shallow copy of the page's `text` data. When this sheet edits markdown but the page only has HTML content,
   * `markdown` is populated by converting that content.
   */
  interface TextContext extends _PageTextData {}

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
