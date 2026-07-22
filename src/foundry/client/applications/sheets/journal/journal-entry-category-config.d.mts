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

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<JournalEntry.Implementation>>;

  #JournalEntryCategoryConfig: true;
}

declare namespace JournalEntryCategoryConfig {
  interface Any extends AnyJournalEntryCategoryConfig {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryCategoryConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<JournalEntry.Implementation> {
    categories: {
      field: StringField;
      placeholder: string;
      name: string;
      id: string;
      sort: number;
    }[];
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
