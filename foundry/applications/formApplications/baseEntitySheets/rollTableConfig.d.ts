/**
 * The RollTable configuration sheet
 */
declare class RollTableConfig extends BaseEntitySheet<RollTableConfig.Data, RollTable> {
  static get defaultOptions(): RollTableConfig.Options;

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
  protected _onCreateResult(event: MouseEvent, resultData?: object): Promise<any>; // TODO: type when TableResult is typed

  /**
   * Submit the entire form when a table result type is changed, in case there are other active changes
   */
  protected _onChangeResultType(event: Event): ReturnType<RollTableConfig['_onSubmit']>;

  /**
   * Handle deleting a TableResult from the RollTable entity
   */
  protected _onDeleteResult(event: Event): Promise<any>; // TODO: type when TableResult is typed

  /**
   * @override
   */
  protected _onDrop(event: DragEvent): ReturnType<RollTableConfig['_onCreateResult']>;

  /**
   * Handle changing the actor profile image by opening a FilePicker
   */
  protected _onEditImage(event: Event): ReturnType<FilePicker['browse']>;

  /**
   * Handle a button click to re-normalize dice result ranges across all RollTable results
   */
  protected _onNormalizeResults(event: Event): Promise<any>; // TODO: type when TableResult is typed

  /**
   * Handle toggling the drawn status of the result in the table
   */
  protected _onLockResult(event: Event): Promise<any>; // TODO: type when TableResult is typed

  /**
   * Reset the Table to it's original composition with all options unlocked
   */
  protected _onResetTable(event: Event): Promise<any>; // TODO: type when TableResult is typed

  /**
   * Handle drawing a result from the RollTable
   */
  protected _onRollTable(event: Event): Promise<void>;

  /**
   * Configure the update object workflow for the Roll Table configuration sheet
   * Additional logic is needed here to reconstruct the results array from the editable fields on the sheet
   * @param event    - The form submission event
   * @param formData - The validated FormData translated into an Object for submission
   */
  protected _updateObject(event: Event, formData: RollTableConfig.Data): Promise<any>; // TODO: type when TableResult is typed

  /**
   * Display a roulette style animation when a Roll Table result is drawn from the sheet
   * @param results - An Array of drawn table results to highlight
   */
  protected _animateRoll(results: object): Promise<void>; // TODO: type when TableResult is typed

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
  interface Data extends BaseEntitySheet.Data {
    results: any; // TODO: type when TableResult is typed
    resultTypes: Record<ValueOf<typeof CONST['TABLE_RESULT_TYPES']>, keyof typeof CONST['TABLE_RESULT_TYPES']>;
    entityTypes: typeof CONST['COMPENDIUM_ENTITY_TYPES'];
    compendiumPacks: string[];
  }

  interface Options extends BaseEntitySheet.Options {
    /**
     * @defaultValue `['sheet', 'roll-table-config']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/sheets/roll-table-config.html'`
     */
    template: string;

    /**
     * @defaultValue `720`
     */
    width: number;

    /**
     * @defaultValue `'auto'`
     */
    height: 'auto' | number;

    /**
     * @defaultValue `false`
     */
    closeOnSubmit: boolean;

    /**
     * @defaultValue `ENTITY_PERMISSIONS.OBSERVER`
     */
    viewPermission: Const.EntityPermission;

    /**
     * @defaultValue `['ol.table-results']`
     */
    scrollY: string[];

    /**
     * @defaultValue `[{ dragSelector: null, dropSelector: null }]`
     */
    dragDrop: DragDrop.Options[];
  }
}
