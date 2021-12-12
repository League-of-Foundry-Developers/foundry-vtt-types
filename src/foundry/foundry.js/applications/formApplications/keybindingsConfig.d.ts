/**
 * Allows for viewing and editing of Keybinding Actions
 */
declare class KeybindingsConfig<
  Options extends FormApplication.Options = FormApplication.Options,
  Data extends KeybindingsConfig.Data = KeybindingsConfig.Data
> extends FormApplication<Options, Data> {
  /**
   * A cached copy of the Categories
   */
  protected _cachedData: KeybindingsConfig.CategoryData | null;

  /**
   * The category being filtered for
   */
  protected _category: string;

  /**
   * @override
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
  static get defaultOptions(): FormApplication.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Partial<Options>): Data;

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
    binding: KeybindingsConfig.Binding
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

  /** @override */
  activateListeners(html: JQuery): void;

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
   * @param event - (unused)
   * @override
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /** @remarks KeybindingsConfig does not implement this method. */
  protected _updateObject(event?: unknown, formData?: unknown): Promise<never>;
}

declare namespace KeybindingsConfig {
  interface Data extends CategoryData {
    categories: DataCategory[];
    allActive: boolean;
  }

  interface DataCategory extends Category {
    active: boolean;
    hidden: boolean;
  }

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
    bindings: ConflictedBinding[];
    id: string;
    name: string;
    hint?: string;
    cssClass?: string;
    notes: string;
  }

  interface Binding extends Partial<KeybindingActionBinding> {
    display: string;
    cssClasses: string;
    isEditable: boolean;
    isFirst: boolean;
  }

  interface ConflictedBinding extends Binding {
    conflicts?: string;
    hasConflicts: boolean;
  }
}
