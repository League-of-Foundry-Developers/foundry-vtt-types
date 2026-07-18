import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageCodeMirrorSheet from "./journal-entry-page-code-mirror-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageHTMLSheet: JournalEntryPageHTMLSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with an
 * HTML editor.
 */
declare class JournalEntryPageHTMLSheet<
  RenderContext extends JournalEntryPageHTMLSheet.RenderContext = JournalEntryPageHTMLSheet.RenderContext,
  Configuration extends JournalEntryPageHTMLSheet.Configuration = JournalEntryPageHTMLSheet.Configuration,
  RenderOptions extends JournalEntryPageHTMLSheet.RenderOptions = JournalEntryPageHTMLSheet.RenderOptions,
> extends JournalEntryPageCodeMirrorSheet<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   window: {
   *     icon: "fa-brands fa-html5"
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
   *     template: "templates/journal/pages/html/edit.hbs"
   *   },
   *   footer: super.EDIT_PARTS.footer
   * }
   * ```
   */
  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

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

  /**
   * Auto-format an HTML string.
   * @param html    - The HTML string.
   * @param options - (default: `{}`)
   */
  static formatHTML(
    html: string,
    options?: {
      /**
       * The number of spaces to indent by, or a string to use as indentation.
       * @defaultValue `4`
       */
      spaces?: string | number | undefined;
    },
  ): string;
}

declare namespace JournalEntryPageHTMLSheet {
  interface Any extends AnyJournalEntryPageHTMLSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageHTMLSheet> {}

  interface RenderContext extends JournalEntryPageCodeMirrorSheet.RenderContext {}
  interface Configuration extends JournalEntryPageCodeMirrorSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageCodeMirrorSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageHTMLSheet extends JournalEntryPageHTMLSheet<
  JournalEntryPageHTMLSheet.RenderContext,
  JournalEntryPageHTMLSheet.Configuration,
  JournalEntryPageHTMLSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageHTMLSheet;
