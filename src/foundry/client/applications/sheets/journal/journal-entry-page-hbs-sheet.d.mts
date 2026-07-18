import type JournalEntryPageSheet from "./journal-entry-page-sheet.mjs";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type { DeepPartial, Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageHandlebarsSheet: JournalEntryPageHandlebarsSheet.Any;
    }
  }
}

/**
 * An abstract subclass that contains specialised handlebars logic for JournalEntryPageSheets.
 */
declare class JournalEntryPageHandlebarsSheet<
  RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext = JournalEntryPageHandlebarsSheet.RenderContext,
  Configuration extends JournalEntryPageHandlebarsSheet.Configuration = JournalEntryPageHandlebarsSheet.Configuration,
  RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions = JournalEntryPageHandlebarsSheet.RenderOptions,
> extends HandlebarsApplicationMixin(JournalEntryPageSheet)<RenderContext, Configuration, RenderOptions> {
  /**
   * Handlebars parts to render in edit mode.
   * @defaultValue
   * ```js
   * {
   *   header: {
   *     template: "templates/journal/parts/page-header.hbs"
   *   },
   *   footer: {
   *     template: "templates/journal/parts/page-footer.hbs",
   *     classes: ["journal-footer", "flexrow"]
   *   }
   * }
   * ```
   */
  static EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Handlebars part to render in view mode.
   * @defaultValue `{}`
   */
  static VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Prepare render context for the content part.
   */
  protected _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the footer part.
   */
  protected _prepareFooterContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the header part.
   */
  protected _prepareHeaderContext(
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

declare namespace JournalEntryPageHandlebarsSheet {
  interface Any extends AnyJournalEntryPageHandlebarsSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageHandlebarsSheet> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, JournalEntryPageSheet.RenderContext {
    categories?: { value: string; label: string }[] | undefined;
    headingLevels?: Record<string, string> | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }
  interface Configuration extends HandlebarsApplicationMixin.Configuration, JournalEntryPageSheet.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryPageHandlebarsSheet extends JournalEntryPageHandlebarsSheet<
  JournalEntryPageHandlebarsSheet.RenderContext,
  JournalEntryPageHandlebarsSheet.Configuration,
  JournalEntryPageHandlebarsSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageHandlebarsSheet;
