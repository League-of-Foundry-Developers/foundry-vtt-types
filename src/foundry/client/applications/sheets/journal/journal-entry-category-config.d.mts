import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { StringField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryCategoryConfig: JournalEntryCategoryConfig.Any;
    }
  }
}

/**
 * An Application responsible for managing a journal entry's categories.
 */
declare class JournalEntryCategoryConfig<
  RenderContext extends JournalEntryCategoryConfig.RenderContext = JournalEntryCategoryConfig.RenderContext,
  Configuration extends JournalEntryCategoryConfig.Configuration = JournalEntryCategoryConfig.Configuration,
  RenderOptions extends JournalEntryCategoryConfig.RenderOptions = JournalEntryCategoryConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "journal-category-config-{id}",
   *   classes: ["journal-category-config"],
   *   window: {
   *     icon: "fa-solid fa-chart-tree-map",
   *     contentClasses: ["standard-form"]
   *   },
   *   position: {
   *     width: 480
   *   },
   *   actions: {
   *     addCategory: JournalEntryCategoryConfig.#onAddCategory,
   *     removeCategory: JournalEntryCategoryConfig.#onRemoveCategory,
   *     sortDown: JournalEntryCategoryConfig.#onSort,
   *     sortUp: JournalEntryCategoryConfig.#onSort
   *   },
   *   form: {
   *     submitOnChange: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     template: "templates/journal/category-config.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * @remarks Ignores `submitData`, updating the parent JournalEntry's `categories` from the form's current
   * ordering instead.
   */
  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<JournalEntry.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<JournalEntry.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<JournalEntry.Implementation>>;

  static #JournalEntryCategoryConfig: true;
}

declare namespace JournalEntryCategoryConfig {
  interface Any extends AnyJournalEntryCategoryConfig {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryCategoryConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<JournalEntry.Implementation> {
    /** @remarks The JournalEntry's categories, in sort order. */
    categories: CategoryContext[];
  }

  /** An entry of {@linkcode RenderContext.categories}. */
  interface CategoryContext {
    /** @remarks Named `"\{index\}.name"` so the form submits an array of categories. */
    field: StringField<{ blank: false }>;

    placeholder: string;

    /** @remarks The category's source name, before any name-preparation the subtype applies. */
    name: string;

    id: string;

    sort: number;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<JournalEntry.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryCategoryConfig extends JournalEntryCategoryConfig<
  JournalEntryCategoryConfig.RenderContext,
  JournalEntryCategoryConfig.Configuration,
  JournalEntryCategoryConfig.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryCategoryConfig;
