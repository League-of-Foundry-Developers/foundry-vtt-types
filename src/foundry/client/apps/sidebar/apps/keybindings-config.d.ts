/**
 * Allows for viewing and editing of Keybinding Actions
 */
declare class KeybindingsConfig<
  Options extends FormApplicationOptions = FormApplicationOptions
> extends FormApplication<Options> {
  /**
   * A cached copy of the Categories
   */
  protected _cachedData: KeybindingsConfig.CategoryData | null;

  /**
   * The category being filtered for
   */
  protected _category: string;

  /**
   * A Map of pending Edits. The Keys are bindingIds
   * @internal
   */
  protected _pendingEdits: Map<string, KeybindingsConfig.PendingBinding[]>;

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   title: game.i18n.localize("SETTINGS.Keybindings"),
   *   id: "keybindings",
   *   template: "templates/sidebar/apps/keybindings-config.html",
   *   width: 750,
   *   height: 600,
   *   resizable: true,
   *   scrollY: [".filters", ".category-list"],
   *   filters: [{inputSelector: 'input[name="filter"]', contentSelector: ".category-list"}]
   * })
   * ```
   */
  static override get defaultOptions(): FormApplicationOptions;

  override getData(options?: Partial<Options>): MaybePromise<object>;

  /**
   * Builds the set of Bindings into a form usable for display and configuration
   * @internal
   */
  protected _getCategoryData(): KeybindingsConfig.CategoryData;

  /**
   * Add faux-keybind actions that represent the possible Mouse Controls
   * @param categories - The current Map of Categories to add to
   * @returns The number of Actions added
   * @internal
   */
  protected _addMouseControlsReference(categories: Map<string, KeybindingsConfig.Category>): number;

  /**
   * Given an Binding and its parent Action, detects other Actions that might conflict with that binding
   * @param actionId - The namespaced Action ID the Binding belongs to
   * @param action   - The Action config
   * @param binding  - The Binding
   * @internal
   */
  protected _detectConflictingActions(
    actionId: string,
    action: KeybindingActionConfig,
    binding: KeybindingActionBinding
  ): KeybindingAction[];

  /**
   * Transforms a Binding into a human readable string representation
   * @param binding - The Binding
   * @returns A human readable string
   * @internal
   */
  protected static _humanizeBinding(binding: KeybindingActionBinding): string;

  /**
   * Compares two Category Filters for rendering
   * This method ignores cases of equality because we know our categories are unique
   * @param a - The first Category
   * @param b - The second Category
   * @returns A number for usage in the Sort method
   * @internal
   */
  protected static _sortCategories(a: KeybindingsConfig.Category, b: KeybindingsConfig.Category): number;

  /**
   * Classify what Category an Action belongs to
   * @param action - The Action to classify
   * @returns The category the Action belongs to
   * @internal
   */
  protected _categorizeAction(action: KeybindingsConfig): KeybindingsConfig.BaseCategory;

  override activateListeners(html: JQuery): void;

  /**
   * Handle left-click events to filter to a certain category
   * @internal
   */
  protected _onClickCategoryFilter(event: MouseEvent): void;

  /**
   * Handle left-click events to show / hide a certain category
   * @internal
   */
  protected _onClickCategoryCollapse(event: MouseEvent): void;

  /**
   * Handle left-click events to reset all Actions to Default
   * @internal
   */
  protected _onClickResetActions(event: MouseEvent): Promise<void>;

  /**
   * Handle Control clicks
   * @internal
   */
  protected _onClickBindingControl(event: MouseEvent): void;

  /**
   * Handle left-click events to show / hide a certain category
   * @internal
   */
  protected _onClickAdd(event: MouseEvent): Promise<void>;

  /**
   * Handle left-click events to show / hide a certain category
   * @internal
   */
  protected _onClickDelete(event: MouseEvent): Promise<void>;

  /**
   * Inserts a Binding into the Pending Edits object, creating a new Map entry as needed
   * @internal
   */
  protected _addPendingEdit(
    namespace: string,
    action: string,
    bindingIndex: number,
    binding: KeybindingsConfig.PendingBinding
  ): void;

  /**
   * Toggle visibility of the Edit / Save UI
   * @internal
   */
  protected _onClickEditableBinding(event: MouseEvent): void;

  /**
   * Toggle visibility of the Edit UI
   * @internal
   */
  protected _onDoubleClickKey(event: MouseEvent): void;

  /**
   * Save the new Binding value and update the display of the UI
   * @internal
   */
  protected _onClickSaveBinding(event: MouseEvent): Promise<void>;

  /**
   * Given a clicked Action element, finds the parent Action
   * @internal
   */
  protected _getParentAction(event: KeyboardEvent | MouseEvent): {
    namespace: string;
    action: string;
    actionHtml: HTMLElement;
  };

  /**
   * Given a Clicked binding control element, finds the parent Binding
   * @internal
   */
  protected _getParentBinding(event: KeyboardEvent | MouseEvent): { bindingHtml: HTMLElement; bindingId: string };

  /**
   * Iterates over all Pending edits, merging them in with unedited Bindings and then saving and resetting the UI
   * @internal
   */
  protected _savePendingEdits(): Promise<void>;

  /**
   * Processes input from the keyboard to form a list of pending Binding edits
   * @param event - The keyboard event
   * @internal
   */
  protected _onKeydownBindingInput(event: KeyboardEvent): void;

  protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /** @remarks KeybindingsConfig does not implement this method. */
  protected _updateObject(event?: unknown, formData?: unknown): Promise<never>;
}

declare namespace KeybindingsConfig {
  interface CategoryData {
    categories: Category[];
    totalActions: number;
  }

  interface BaseCategory {
    id: string;
    title: string;
  }

  interface Category extends BaseCategory {
    actions: ActionData[];
    count: number;
  }

  interface ActionData extends KeybindingActionConfig {
    category: string;
    bindings: DisplayBinding[];
    id: string;
    name: string;
    hint?: string;
    cssClass?: string;
    notes: string;
  }

  interface DisplayBinding extends Partial<KeybindingActionBinding> {
    id: string;
    display: string;
    cssClasses: string;
    isEditable: boolean;
    isFirst: boolean;
    conflicts: string;
    hasConflicts: boolean;
  }

  interface PendingBinding extends KeybindingActionBinding {
    index: number;
  }
}
