import type { AnyObject, DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollTableSheet: RollTableSheet.Any;
    }
  }
}

/**
 * The Application responsible for editing, displaying, and using a single {@linkcode RollTable} document.
 */
declare class RollTableSheet<
  RenderContext extends RollTableSheet.RenderContext = RollTableSheet.RenderContext,
  Configuration extends RollTableSheet.Configuration = RollTableSheet.Configuration,
  RenderOptions extends RollTableSheet.RenderOptions = RollTableSheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RollTable.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["roll-table-sheet"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-table-list",
   *     resizable: true
   *   },
   *   position: {width: 720},
   *   form: {
   *     closeOnSubmit: false
   *   },
   *   actions: {
   *     // Edit mode:
   *     normalizeResults: RollTableSheet.#onNormalizeResults,
   *     createResult: RollTableSheet.#onCreateResult,
   *     openResultSheet: RollTableSheet.#onOpenResultSheet,
   *     deleteResult: RollTableSheet.#onDeleteResult,
   *     // View mode:
   *     drawSpecificResult: RollTableSheet.#onDrawSpecificResult,
   *     // Shared:
   *     changeMode: RollTableSheet.#onChangeMode,
   *     lockResult: RollTableSheet.#onLockResult,
   *     drawResult: RollTableSheet.#onDrawResult,
   *     resetResults: RollTableSheet.#onResetResults
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Parts for each view
   */
  static MODE_PARTS: Record<"edit" | "view", string[]>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "results", icon: "fa-solid fa-table-rows"},
   *       {id: "summary", icon: "fa-solid fa-memo-pad"}
   *     ],
   *     initial: "results",
   *     labelPrefix: "TABLE.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The operational mode of this sheet
   */
  get mode(): "edit" | "view";

  /**
   * Change the operational mode of this sheet. Changing this value will also change the mode in which subsequent
   * RollTableSheet instances first render.
   */
  set mode(value: "edit" | "view");

  /**
   * Is the sheet in edit mode?
   */
  get isEditMode(): boolean;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareTabs(group: string): Record<string, ApplicationV2.Tab>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare sheet data for a single TableResult.
   * @param result - The result from which to prepare
   * @returns The sheet data for this result
   */
  protected _prepareResult(result: TableResult.Implementation): Promise<RollTableSheet.PreparedResult>;

  /**
   * Compare a pair of results for sorted display in this sheet.
   * @param resultA - Sheet data for a result
   * @param resultB - Sheet data for a different result
   * @returns A comparator return value expected by `Array#sort`
   */
  protected _sortResults(resultA: TableResult.Implementation, resultB: TableResult.Implementation): number;

  /**
   * Create a Table Result from initial data and with reasonable defaults.
   * @param initialData - (default: `{}`)
   */
  protected _createResult(initialData?: DeepPartial<foundry.documents.BaseTableResult.CreateData>): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  override submit(submitOptions?: AnyObject): Promise<void>;

  protected override _preRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onRevealSecret(event: Event): void;

  /**
   * Create a Compendium or Document result from a dropped document.
   * @param event - The triggering drop event
   */
  protected _onDrop(event: DragEvent): Promise<void>;

  /**
   * Display a roulette style animation when a Roll Table result is drawn from the sheet.
   * @param results - An Array of drawn table results to highlight
   * @returns A Promise that resolves once the animation is complete
   */
  protected _animateRoll(results: TableResult.Implementation[]): Promise<void>;

  /**
   * Animate a "roulette" through the table until arriving at the final loop and a drawn result
   * @param resultsTable - The list element being iterated
   * @param drawnIds     - The result IDs which have already been drawn
   * @param nLoops       - The number of times to loop through the animation
   * @param animTime     - The desired animation time in milliseconds
   * @param animOffset   - The desired pixel offset of the result within the list
   * @returns A Promise that resolves once the animation is complete
   */
  protected _animateRoulette(
    resultsTable: HTMLElement,
    drawnIds: Set<string>,
    nLoops: number,
    animTime: number,
    animOffset: number,
  ): Promise<void>;

  /**
   * Display a flashing animation on the selected result to emphasize the draw
   * @param item - The HTML li item of the winning result
   * @returns A Promise that resolves once the animation is complete
   */
  protected _flashResult(item: HTMLElement): Promise<void>;

  #RollTableSheet: true;
}

declare namespace RollTableSheet {
  interface Any extends AnyRollTableSheet {}
  interface AnyConstructor extends Identity<typeof AnyRollTableSheet> {}

  interface PreparedResult {
    id: string | null;
    img: string;
    name: string;
    description: string;
    documentLink: string | undefined;
    weight: number;
    range: number[] | number | string;
    drawn: boolean;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<RollTable.Implementation> {
    tabClasses?: string | undefined;
    tab?: ApplicationV2.Tab | undefined;
    results?: PreparedResult[] | undefined;
    descriptionHTML?: string | undefined;
    formulaPlaceholder?: string | undefined;
    formula?: string | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<RollTable.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRollTableSheet extends RollTableSheet<
  RollTableSheet.RenderContext,
  RollTableSheet.Configuration,
  RollTableSheet.RenderOptions
> {
  constructor(...args: never);
}

export default RollTableSheet;
