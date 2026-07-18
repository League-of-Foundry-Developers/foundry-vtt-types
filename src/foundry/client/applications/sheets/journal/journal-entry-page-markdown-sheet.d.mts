import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageCodeMirrorSheet from "./journal-entry-page-code-mirror-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageMarkdownSheet: JournalEntryPageMarkdownSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with a
 * Markdown editor.
 */
declare class JournalEntryPageMarkdownSheet<
  RenderContext extends JournalEntryPageMarkdownSheet.RenderContext = JournalEntryPageMarkdownSheet.RenderContext,
  Configuration extends JournalEntryPageMarkdownSheet.Configuration = JournalEntryPageMarkdownSheet.Configuration,
  RenderOptions extends JournalEntryPageMarkdownSheet.RenderOptions = JournalEntryPageMarkdownSheet.RenderOptions,
> extends JournalEntryPageCodeMirrorSheet<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   window: {
   *     icon: "fa-brands fa-markdown"
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: super.EDIT_PARTS.header,
   *   content: {
   *     classes: ["flex1", "flexcol"],
   *     template: "templates/journal/pages/markdown/edit.hbs"
   *   },
   *   footer: super.EDIT_PARTS.footer
   * }
   * ```
   */
  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue `CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN`
   */
  static override format: CONST.JOURNAL_ENTRY_PAGE_FORMATS;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;
}

declare namespace JournalEntryPageMarkdownSheet {
  interface Any extends AnyJournalEntryPageMarkdownSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageMarkdownSheet> {}

  interface RenderContext extends JournalEntryPageCodeMirrorSheet.RenderContext {
    /** @remarks Only set in edit mode. */
    markdownFormat?: CONST.JOURNAL_ENTRY_PAGE_FORMATS | undefined;
  }
  interface Configuration extends JournalEntryPageCodeMirrorSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageCodeMirrorSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageMarkdownSheet extends JournalEntryPageMarkdownSheet<
  JournalEntryPageMarkdownSheet.RenderContext,
  JournalEntryPageMarkdownSheet.Configuration,
  JournalEntryPageMarkdownSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageMarkdownSheet;
