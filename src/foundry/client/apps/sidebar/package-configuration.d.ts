export {};

/**
 * An application for configuring data across all installed and active packages.
 */
declare global {
  abstract class PackageConfiguration<ConcreteCategory extends PackageConfiguration.Category> extends FormApplication<
    PackageConfiguration.Options,
    PackageConfiguration.Data<ConcreteCategory>
  > {
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

    override getData():
      | PackageConfiguration.Data<ConcreteCategory>
      | Promise<PackageConfiguration.Data<ConcreteCategory>>;

    abstract _prepareCategoryData(): PackageConfiguration.Categories<ConcreteCategory>;

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
      options?: Application.RenderOptions<PackageConfiguration.Options> | undefined
    ): Promise<void>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    /**
     * Handle left-click events to filter to a certain category
     * @internal
     */
    protected _onClickCategoryFilter(event: MouseEvent): void;

    protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    /**
     * Handle left-click events to show / hide a certain category
     * @internal
     */
    protected _onClickCategoryCollapse(event: MouseEvent): void;

    /**
     * Handle button click to reset default settings
     * @param event - The initial button click event
     */
    protected _onResetDefaults(event: Event): void;
  }

  namespace PackageConfiguration {
    interface Options extends FormApplicationOptions {
      categoryTemplate: string | undefined;
      submitButton: boolean;
    }

    interface Data<ConcreteCategory extends Category> extends Categories<ConcreteCategory> {
      allActive: boolean;
      categoryTemplate: string | undefined;
      submitButton: boolean;
    }

    interface Categories<ConcreteCategory extends Category> {
      categories: ConcreteCategory[];
      total: number;
    }

    interface Category {
      id: string;
      title: string;
    }
  }
}
