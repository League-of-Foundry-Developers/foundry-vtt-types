import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HTMLFilePickerElement from "../../elements/file-picker.d.mts";
import type { FormInputConfig } from "../../forms/fields.d.mts";
import type { DataField } from "#common/data/fields.d.mts";

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
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

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

  /**
   * @remarks Wires up the PDF loading button and, in view mode, appends the PDF's file size to it.
   */
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
}

declare namespace JournalEntryPagePDFSheet {
  interface Any extends AnyJournalEntryPagePDFSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPagePDFSheet> {}

  /**
   * @remarks Members added by
   * {@linkcode JournalEntryPagePDFSheet._prepareContentContext | #_prepareContentContext} are `IntentionalPartial`ed
   * because they are only set for the `content` part.
   */
  interface RenderContext
    extends JournalEntryPageHandlebarsSheet.RenderContext, IntentionalPartial<PrepareContentContext> {}

  /** @remarks Added for the `content` part. */
  interface PrepareContentContext {
    /** @remarks The page's PDF source path. */
    src: JournalEntryPage.Implementation["src"];

    srcInput: SourceInput;

    /** @remarks The value of {@linkcode JournalEntryPagePDFSheet._getViewerParams | #_getViewerParams}. */
    params: URLSearchParams;
  }

  /**
   * Create a FilePicker input for the PDF source field.
   * @remarks The `field` parameter exists so this can be called as a Handlebars field helper; it is ignored.
   */
  type SourceInput = (field: DataField.Any, inputConfig: FormInputConfig<string>) => HTMLFilePickerElement;

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
