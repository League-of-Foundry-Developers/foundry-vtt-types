import type { AnyObject, DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollTableSheet: RollTableSheet.Any;
    }
  }
}

/**
 * The Application responsible for editing, displaying, and using a single
 * {@linkcode foundry.documents.RollTable | RollTable} document.
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

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     template: "templates/sheets/roll-table/view.hbs",
   *     templates: ["templates/sheets/roll-table/result-details.hbs"],
   *     scrollable: ["table[data-results] tbody"],
   *     root: true
   *   },
   *   header: {template: "templates/sheets/roll-table/edit/header.hbs"},
   *   tabs: {template: "templates/generic/tab-navigation.hbs"},
   *   results: {
   *     template: "templates/sheets/roll-table/edit/results.hbs",
   *     templates: ["templates/sheets/roll-table/result-details.hbs"],
   *     scrollable: ["table[data-results] tbody"]
   *   },
   *   summary: {template: "templates/sheets/roll-table/edit/summary.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Parts for each view
   * @defaultValue
   * ```js
   * {
   *   edit: ["header", "tabs", "summary", "results", "footer"],
   *   view: ["sheet", "footer"]
   * }
   * ```
   */
  static MODE_PARTS: Record<RollTableSheet.Mode, string[]>;

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
  get mode(): RollTableSheet.Mode;

  /**
   * Change the operational mode of this sheet. Changing this value will also change the mode in which subsequent
   * RollTableSheet instances first render.
   */
  set mode(value: RollTableSheet.Mode);

  /**
   * Is the sheet in edit mode?
   */
  get isEditMode(): boolean;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @privateRemarks Returns the malformed `{tabs: {}}` rather than an empty record while in view mode; kept as
   * the base's type because every consumer indexes the result by tab ID.
   */
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
  protected _prepareResult(result: TableResult.Implementation): Promise<RollTableSheet.ResultContext>;

  /**
   * Compare a pair of results for sorted display in this sheet.
   * @param resultA - Sheet data for a result
   * @param resultB - Sheet data for a different result
   * @returns A comparator return value expected by `Array#sort`
   * @remarks Called with the TableResult documents themselves, not with the prepared sheet data its `@param`
   * tags describe.
   */
  protected _sortResults(resultA: TableResult.Implementation, resultB: TableResult.Implementation): number;

  /**
   * Create a Table Result from initial data and with reasonable defaults.
   */
  protected _createResult(initialData?: DeepPartial<TableResult.CreateData>): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<RollTable.Implementation>,
  ): DocumentSheetV2.SubmitData<RollTable.Implementation>;

  /**
   * @remarks Returns without submitting while the sheet is in view mode.
   */
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
   * @throws If the dropped Document is the RollTable this sheet manages.
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

  /** The operational mode of a {@linkcode RollTableSheet}. */
  type Mode = "edit" | "view";

  /**
   * @remarks Every added member comes from
   * {@linkcode RollTableSheet._preparePartContext | #_preparePartContext}, which only sets the members the
   * part being rendered consumes, so they are all `IntentionalPartial`ed.
   */
  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<RollTable.Implementation>,
      IntentionalPartial<PreparePartContext> {}

  /** @remarks Added by {@linkcode RollTableSheet._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Added for the `tabs` part. */
    tabClasses: string;

    /** @remarks Added for the `results` and `summary` parts. */
    tab: ApplicationV2.Tab;

    /** @remarks Added for the `results` and `sheet` parts, sorted by the low end of each result's range. */
    results: ResultContext[];

    /** @remarks Added for the `summary` and `sheet` parts; the RollTable's enriched description. */
    descriptionHTML: string;

    /** @remarks Added for the `summary` part; falls back to `"1d20"` when the table has no results. */
    formulaPlaceholder: string;

    /** @remarks Added for the `sheet` part; falls back to `1d{number of results}`, or `"1d20"` when empty. */
    formula: string;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];
  }

  /**
   * The sheet data prepared for one TableResult by
   * {@linkcode RollTableSheet._prepareResult | RollTableSheet#_prepareResult}.
   */
  interface ResultContext {
    id: string;

    img: string;

    name: string;

    /** @remarks The result's enriched description. */
    description: string;

    /** @remarks `undefined` when the result does not point at a Document. */
    documentLink: string | undefined;

    weight: number;

    /**
     * @remarks The `[low, high]` pair in edit mode. In view mode this is the single number for a zero-interval
     * range, and otherwise an en-dash-joined `"low–high"` string.
     */
    range: [low: number, high: number] | number | string;

    drawn: boolean;
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
