export {};

declare global {
  /** An application for configuring data across all installed and active packages. */
  abstract class PackageConfiguration<
    Options extends PackageConfiguration.Options = PackageConfiguration.Options
  > extends FormApplication<Options, object> {
    static get categoryOrder(): string[];

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["package-configuration"],
     *   template: "templates/sidebar/apps/package-configuration.html",
     *   categoryTemplate: undefined,
     *   width: 780,
     *   height: 680,
     *   resizable: true,
     *   scrollY: [".filters", ".categories"],
     *   filters: [{inputSelector: 'input[name="filter"]', contentSelector: ".categories"}],
     *   submitButton: false
     * });
     * ```
     */
    static override get defaultOptions(): PackageConfiguration.Options;

    override getData(): MaybePromise<object>;

    abstract _prepareCategoryData(): PackageConfiguration.Category;

    /**
     * Classify what Category an Action belongs to
     * @param namespace - The entry to classify
     * @returns The category the entry belongs to
     */
    protected _categorizeEntry(namespace: string): PackageConfiguration.Category;

    /** Reusable logic for how categories are sorted in relation to each other. */
    protected _sortCategories(a: PackageConfiguration.Category, b: PackageConfiguration.Category): number;

    protected override _render(
      force?: boolean | undefined,
      options?: Application.RenderOptions<Options> | undefined
    ): Promise<void>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    /**
     * Handle left-click events to filter to a certain category
     * @internal
     */
    protected _onClickCategoryFilter(event: JQuery.ClickEvent): void;

    protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    /**
     * Handle left-click events to show / hide a certain category
     * @internal
     */
    protected _onClickCategoryCollapse(event: JQuery.ClickEvent): void;

    /**
     * Handle button click to reset default settings
     * @param event - The initial button click event
     */
    protected _onResetDefaults(event: JQuery.ClickEvent): void;
  }

  namespace PackageConfiguration {
    interface Options extends FormApplicationOptions {
      categoryTemplate: string | undefined;
      submitButton: boolean;
    }

    interface Category {
      id: string;
      title: string;
    }
  }
}
