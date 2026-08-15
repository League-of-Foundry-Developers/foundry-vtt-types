import type { DeepPartial, Identity, InexactPartial } from "#utils";
import type JournalEntryPageCodeMirrorSheet from "./journal-entry-page-code-mirror-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
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
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with an HTML
 * editor.
 */
declare class JournalEntryPageHTMLSheet<
  RenderContext extends JournalEntryPageHTMLSheet.RenderContext = JournalEntryPageHTMLSheet.RenderContext,
  Configuration extends JournalEntryPageHTMLSheet.Configuration = JournalEntryPageHTMLSheet.Configuration,
  RenderOptions extends JournalEntryPageHTMLSheet.RenderOptions = JournalEntryPageHTMLSheet.RenderOptions,
> extends JournalEntryPageCodeMirrorSheet<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Auto-formats the page's content into `context.text.formatted` while in edit mode.
   */
  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * @remarks Collapses the whitespace introduced between tags by the editor's auto-formatting.
   */
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>,
  ): DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>;

  /**
   * Auto-format an HTML string.
   * @param html    - The HTML string.
   * @param options - Additional options to configure formatting.
   * @remarks Returns `""` for blank input, and logs a warning and returns `""` if the string cannot be parsed.
   */
  static formatHTML(html: string, options?: JournalEntryPageHTMLSheet.FormatHTMLOptions): string;
}

declare namespace JournalEntryPageHTMLSheet {
  interface Any extends AnyJournalEntryPageHTMLSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageHTMLSheet> {}

  interface RenderContext extends JournalEntryPageCodeMirrorSheet.RenderContext {
    text: TextContext;
  }

  interface TextContext extends JournalEntryPageCodeMirrorSheet.TextContext {
    /**
     * @remarks The auto-formatted page content. Only added in edit mode.
     */
    formatted?: string | undefined;
  }

  /** @internal */
  interface _FormatHTMLOptions {
    /**
     * The number of spaces to indent by, or a string to use as indentation.
     * @defaultValue `4`
     */
    spaces: string | number;
  }

  interface FormatHTMLOptions extends InexactPartial<_FormatHTMLOptions> {}

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
