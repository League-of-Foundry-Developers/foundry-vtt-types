import type JournalEntryPageSheet from "./journal-entry-page-sheet.mjs";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type { DeepPartial, Identity, IntentionalPartial } from "#utils";

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

  /**
   * @remarks Returns a deep clone of {@linkcode JournalEntryPageHandlebarsSheet.VIEW_PARTS | VIEW_PARTS} while
   * {@linkcode JournalEntryPageSheet.isView | #isView}, otherwise of
   * {@linkcode JournalEntryPageHandlebarsSheet.EDIT_PARTS | EDIT_PARTS}.
   */
  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Prepare render context for the content part.
   * @remarks No-op in `JournalEntryPageHandlebarsSheet`.
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

  /**
   * @remarks Replaces a blank `category` in `formData` with `null` before deferring to `super`.
   */
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>,
  ): DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>;
}

declare namespace JournalEntryPageHandlebarsSheet {
  interface Any extends AnyJournalEntryPageHandlebarsSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageHandlebarsSheet> {}

  /**
   * @remarks Members added by the part-specific context preparation methods are `IntentionalPartial`ed because
   * each is only set for the one part that consumes it.
   */
  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      JournalEntryPageSheet.RenderContext,
      IntentionalPartial<PreparePartContext> {}

  /** @remarks Added by the part-specific context preparation methods. */
  interface PreparePartContext {
    /**
     * @remarks Added for the `header` part by
     * {@linkcode JournalEntryPageHandlebarsSheet._prepareHeaderContext | #_prepareHeaderContext}, and only when
     * the parent JournalEntry has any categories. The first entry is the `"Uncategorized"` choice.
     */
    categories: CategoryChoice[];

    /**
     * @remarks Added for the `header` part; the value of
     * {@linkcode JournalEntryPageSheet._prepareHeadingLevels | #_prepareHeadingLevels}.
     */
    headingLevels: Record<string, string>;

    /**
     * @remarks Added for the `footer` part by
     * {@linkcode JournalEntryPageHandlebarsSheet._prepareFooterContext | #_prepareFooterContext}.
     */
    buttons: ApplicationV2.FormFooterButton[];
  }

  /** An entry of {@linkcode PreparePartContext.categories}. */
  interface CategoryChoice {
    /** @remarks The category's ID, or `""` for the `"Uncategorized"` choice. */
    value: string;

    label: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, JournalEntryPageSheet.Configuration {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, JournalEntryPageSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageHandlebarsSheet extends JournalEntryPageHandlebarsSheet<
  JournalEntryPageHandlebarsSheet.RenderContext,
  JournalEntryPageHandlebarsSheet.Configuration,
  JournalEntryPageHandlebarsSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageHandlebarsSheet;
