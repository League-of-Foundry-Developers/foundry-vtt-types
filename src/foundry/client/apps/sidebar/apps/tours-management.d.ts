/**
 * Allows for viewing and managing Tours
 */
declare class ToursManagement extends FormApplication {
  /**
   * A cached copy of the Categories
   * @defaultValue `null`
   * @internal
   */
  protected _cachedData: CategoryData | null;

  /**
   * The category being filtered for
   * @defaultValue `"all"`
   */
  protected _category: string;

  static override get defaultOptions(): FormApplicationOptions;

  override getData(
    options?: Partial<FormApplicationOptions> | undefined
  ): FormApplication.Data<{}, FormApplicationOptions> | Promise<FormApplication.Data<{}, FormApplicationOptions>>;

  /**
   * Builds the set of Tours into a form usable for display and configuration
   * @internal
   */
  protected _getCategoryData(): CategoryData;

  /**
   * Compares two Category Filters for rendering
   * This method ignores cases of equality because we know our categories are unique
   * @param a - The first Category
   * @param b - The second Category
   * @internal
   */
  protected _sortCategories(a: TourCategory, b: TourCategory): number;

  /**
   * Classify what Category a Tour belongs to
   * @param tour - The Tour to classify
   * @returns The category the Tour belongs to
   * @internal
   */
  protected _categorizeTour(tour: Tour): TourCategory;

  override activateListeners(html: JQuery<HTMLElement>): void;

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
   * Handle left-click events to reset all Tours to unstarted
   * @internal
   */
  protected _onClickResetAll(event: MouseEvent): Promise<void>;

  /**
   * Handle Control clicks
   * @internal
   */
  protected _onClickControl(event: MouseEvent): void;

  protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;
}

interface CategoryData {
  categories: TourCategoryData[];
  total: number;
}

interface TourCategory {
  id: string;
  title: string;
}

interface TourCategoryData extends TourCategory {
  tours: TourData[];
  count: number;
}

interface TourData {
  category: string;
  id: string;
  title: string;
  description: string;
  cssClass: 'gm' | '';
  notes: string;
  status: string;
  canBePlayed?: boolean;
  startOrResume?: string;
}
