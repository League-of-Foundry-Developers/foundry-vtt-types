import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import type { TableResultDataConstructorData } from "../../../common/data/data.mjs/tableResultData";

declare global {
  /**
   * The Application responsible for displaying and editing a single RollTable document.
   * @typeParam Options - the type of the options object
   */
  class RollTableConfig<
    Options extends DocumentSheetOptions<RollTable> = DocumentSheetOptions<RollTable>
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClassForName<"RollTable">>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "roll-table-config"],
     *   template: "templates/sheets/roll-table-config.html",
     *   width: 720,
     *   height: "auto",
     *   closeOnSubmit: false,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
     *   scrollY: ["ol.table-results"],
     *   dragDrop: [{ dragSelector: null, dropSelector: null }],
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<RollTable>;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle creating a TableResult in the RollTable document
     * @param event      - The originating mouse event
     * @param resultData - An optional object of result data to use
     * @internal
     */
    protected _onCreateResult(
      event: JQuery.ClickEvent | DragEvent,
      resultData?: TableResultDataConstructorData
    ): Promise<ConfiguredDocumentClassForName<"TableResult">[]>;

    /**
     * Submit the entire form when a table result type is changed, in case there are other active changes
     * @internal
     */
    protected _onChangeResultType(event: JQuery.ChangeEvent): void;

    /**
     * Handle deleting a TableResult from the RollTable document
     * @param event - The originating click event
     * @returns The deleted TableResult document
     * @internal
     */
    protected _onDeleteResult(
      event: JQuery.ClickEvent
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"TableResult">> | undefined>;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle changing the actor profile image by opening a FilePicker
     * @internal
     */
    protected _onEditImage(event: JQuery.ClickEvent): void;

    /**
     * Handle a button click to re-normalize dice result ranges across all RollTable results
     * @internal
     */
    protected _onNormalizeResults(event: JQuery.ClickEvent): void;

    /**
     * Handle toggling the drawn status of the result in the table
     * @internal
     */
    protected _onLockResult(event: JQuery.ClickEvent): void;

    /**
     * Reset the Table to it's original composition with all options unlocked
     * @internal
     */
    protected _onResetTable(event: JQuery.ClickEvent): void;

    /**
     * Handle drawing a result from the RollTable
     * @internal
     */
    protected _onRollTable(event: JQuery.ClickEvent): void;

    /**
     * Configure the update object workflow for the Roll Table configuration sheet
     * Additional logic is needed here to reconstruct the results array from the editable fields on the sheet
     * @param event    - The form submission event
     * @param formData - The validated FormData translated into an Object for submission
     * @internal
     */
    protected _updateObject(event: Event, formData: RollTableConfig.FormData): Promise<unknown>;

    /**
     * Display a roulette style animation when a Roll Table result is drawn from the sheet
     * @param results - An Array of drawn table results to highlight
     * @returns A Promise which resolves once the animation is complete
     */
    protected _animateRoll(results: InstanceType<ConfiguredDocumentClassForName<"TableResult">>[]): Promise<void[]>;

    /**
     * Animate a "roulette" through the table until arriving at the final loop and a drawn result
     */
    protected _animateRoulette(
      ol: HTMLOListElement,
      drawnIds: Set<string>,
      nLoops: number,
      animTime: number,
      animOffset: number
    ): Promise<void>;

    /**
     * Display a flashing animation on the selected result to emphasize the draw
     * @param item - The HTML \<li\> item of the winning result
     * @returns A Promise that resolves once the animation is complete
     */
    protected _flashResult(item: HTMLElement): Promise<void>;
  }

  namespace RollTableConfig {
    type FormData = {
      description: string;
      displayRoll: boolean;
      formula: string;
      img: string;
      name: string;
      replacement: boolean;
    } & FormDataResults;

    type FormDataResults = {
      [Key in number as `results.${number}._id`]: string;
    } & {
      [Key in number as `results.${number}.drawn`]: boolean;
    } & {
      [Key in number as `results.${number}.img`]: string;
    } & {
      [Key in number as `results.${number}.rangeH`]: number;
    } & {
      [Key in number as `results.${number}.rangeL`]: number;
    } & {
      [Key in number as `results.${number}.text`]: string;
    } & {
      [Key in number as `results.${number}.type`]: foundry.CONST.TABLE_RESULT_TYPES;
    } & {
      [Key in number as `results.${number}.weight`]: string;
    };
  }
}
