// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The RollTable configuration sheet
 * @typeParam P - the type of the options object
 */
declare class RollTableConfig<P extends DocumentSheet.Options = DocumentSheet.Options> extends DocumentSheet<
  P,
  RollTableConfig.Data,
  RollTable
> {
  /**
   * @param table   - The rollable table entity being configured
   * @param options - Additional application rendering options
   */
  constructor(table: RollTable, options?: Partial<P>);

  /**
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "roll-table-config"],
   *   template: "templates/sheets/roll-table-config.html",
   *   width: 720,
   *   height: "auto",
   *   closeOnSubmit: false,
   *   viewPermission: ENTITY_PERMISSIONS.OBSERVER,
   *   scrollY: ["ol.table-results"],
   *   dragDrop: [{dragSelector: null, dropSelector: null}]
   * })
   * ```
   */
  static get defaultOptions(): typeof DocumentSheet['defaultOptions'];

  /**
   * @override
   */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): RollTableConfig.Data;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Handle creating a TableResult in the RollTable entity
   * @param event      - The originating mouse event
   * @param resultData - An optional object of result data to use
   */
  protected _onCreateResult(event: JQuery.ClickEvent | DragEvent, resultData?: object): Promise<RollTable.Result>;

  /**
   * Submit the entire form when a table result type is changed, in case there are other active changes
   */
  protected _onChangeResultType(event: JQuery.ClickEvent): ReturnType<RollTableConfig['_onSubmit']>;

  /**
   * Handle deleting a TableResult from the RollTable entity
   */
  protected _onDeleteResult(event: JQuery.ClickEvent): Promise<RollTable.Result>;

  /**
   * @override
   */
  protected _onDrop(event: DragEvent): ReturnType<RollTableConfig['_onCreateResult']>;

  /**
   * Handle changing the actor profile image by opening a FilePicker
   */
  protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

  /**
   * Handle a button click to re-normalize dice result ranges across all RollTable results
   */
  protected _onNormalizeResults(event: JQuery.ClickEvent): Promise<RollTable>;

  /**
   * Handle toggling the drawn status of the result in the table
   */
  protected _onLockResult(event: JQuery.ClickEvent): Promise<RollTable.Result>;

  /**
   * Reset the Table to it's original composition with all options unlocked
   */
  protected _onResetTable(event: JQuery.ClickEvent): Promise<RollTable.Result>;

  /**
   * Handle drawing a result from the RollTable
   */
  protected _onRollTable(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Configure the update object workflow for the Roll Table configuration sheet
   * Additional logic is needed here to reconstruct the results array from the editable fields on the sheet
   * @param event    - The form submission event
   * @param formData - The validated FormData translated into an Object for submission
   */
  protected _updateObject(event: Event, formData: RollTableConfig.FormData): Promise<RollTable>;

  /**
   * Display a roulette style animation when a Roll Table result is drawn from the sheet
   * @param results - An Array of drawn table results to highlight
   */
  protected _animateRoll(results: RollTable.Result[]): Promise<void>;

  /**
   * Animate a "roulette" through the table until arriving at the final loop and a drawn result
   */
  protected _animateRoulette(
    ol: HTMLOListElement,
    drawnIds: string[],
    nLoops: number,
    animTime: number,
    animOffset: number
  ): Promise<void>;

  /**
   * Display a flashing animation on the selected result to emphasize the draw
   * @param item - The HTML <li> item of the winning result
   */
  protected _flashResult(item: HTMLElement): Promise<void>;
}

declare namespace RollTableConfig {
  interface Data extends DocumentSheet.Data<RollTable> {
    results: RollTable.Result;
    resultTypes: {
      [Key in keyof typeof foundry.CONST['TABLE_RESULT_TYPES'] as typeof foundry.CONST['TABLE_RESULT_TYPES'][Key]]: Key;
    };
    entityTypes: typeof foundry.CONST['COMPENDIUM_ENTITY_TYPES'];
    compendiumPacks: string[];
  }

  interface FormData
    extends Pick<RollTable.Data, 'description' | 'displayRoll' | 'formula' | 'img' | 'name' | 'replacement'> {
    [index: number]: FormDataResult;
  }

  interface FormDataResult
    extends Pick<RollTable.Result, '_id' | 'drawn' | 'img' | 'resultId' | 'text' | 'type' | 'weight'> {
    rangeH: RollTable.Result['range'][1];
    rangeL: RollTable.Result['range'][0];
  }
}
