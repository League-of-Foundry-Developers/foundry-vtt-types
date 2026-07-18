import type { DeepPartial, Identity } from "#utils";
import type Showdown from "showdown";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
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
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["text"],
   *   includeTOC: true
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * Bi-directional HTML \<-\> Markdown converter.
   */
  protected static _converter: Showdown.Converter;

  /**
   * The format used to edit text content in this sheet.
   */
  static format: CONST.JOURNAL_ENTRY_PAGE_FORMATS;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Determine if any editors have unsaved changes.
   * @remarks Core's implementation always returns `false`.
   */
  protected _isEditorDirty(): boolean | undefined;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  #JournalEntryPageTextSheet: true;
}

declare namespace JournalEntryPageTextSheet {
  interface Any extends AnyJournalEntryPageTextSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageTextSheet> {}

  interface TextContext {
    content: string | undefined;
    markdown: string | undefined;
    format: CONST.JOURNAL_ENTRY_PAGE_FORMATS;

    /** @remarks Added by {@linkcode foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet} in view mode. */
    enriched?: string | undefined;

    /** @remarks Added by {@linkcode foundry.applications.sheets.journal.JournalEntryPageHTMLSheet} in edit mode. */
    formatted?: string | undefined;
  }

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {
    text: TextContext;
  }
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
