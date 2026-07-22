import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type { FormInputConfig } from "../../forms/fields.d.mts";
import type HTMLFilePickerElement from "../../elements/file-picker.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPagePDFSheet: JournalEntryPagePDFSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying and editing a single pdf-type JournalEntryPage Document.
 */
declare class JournalEntryPagePDFSheet<
  RenderContext extends JournalEntryPagePDFSheet.RenderContext = JournalEntryPagePDFSheet.RenderContext,
  Configuration extends JournalEntryPagePDFSheet.Configuration = JournalEntryPagePDFSheet.Configuration,
  RenderOptions extends JournalEntryPagePDFSheet.RenderOptions = JournalEntryPagePDFSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["pdf"],
   *   window: {
   *     icon: "fa-solid fa-file-pdf"
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
   *     template: "templates/journal/pages/pdf/edit.hbs",
   *     classes: ["standard-form"]
   *   },
   *   footer: super.EDIT_PARTS.footer
   * }
   * ```
   */
  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   content: {
   *     template: "templates/journal/pages/pdf/view.hbs",
   *     root: true
   *   }
   * }
   * ```
   */
  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Maintain a cache of PDF sizes to avoid making HEAD requests every render.
   * @defaultValue `{}`
   */
  protected static _sizes: Record<string, number>;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Handle a request to load a PDF.
   * @param event - The triggering event.
   */
  protected _onLoadPDF(event: PointerEvent): void;

  /**
   * Marshall URL query parameters to pass to the PDF viewer.
   */
  protected _getViewerParams(): URLSearchParams;

  #JournalEntryPagePDFSheet: true;
}

declare namespace JournalEntryPagePDFSheet {
  interface Any extends AnyJournalEntryPagePDFSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPagePDFSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {
    src?: string | null | undefined;
    srcInput?:
      | ((field: foundry.data.fields.DataField.Any, inputConfig: FormInputConfig<string>) => HTMLFilePickerElement)
      | undefined;
    params?: URLSearchParams | undefined;
  }
  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPagePDFSheet extends JournalEntryPagePDFSheet<
  JournalEntryPagePDFSheet.RenderContext,
  JournalEntryPagePDFSheet.Configuration,
  JournalEntryPagePDFSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPagePDFSheet;
