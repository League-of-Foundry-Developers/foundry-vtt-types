import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /** An application for configuring data across all installed and active packages. */
  abstract class PackageConfiguration<
    Options extends PackageConfiguration.Options = PackageConfiguration.Options,
  > extends FormApplication<Options, object> {
    /** @returns `["all", "core", "system", "module", "unmapped"]` */
    static get categoryOrder(): string[];

    /** The name of the currently active tab. */
    get activeCategory(): string;

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
     *   tabs: [{navSelector: ".tabs", contentSelector: "form .scrollable", initial: "all"}],
     *   filters: [{inputSelector: 'input[name="filter"]', contentSelector: ".categories"}],
     *   submitButton: false
     * });
     * ```
     */
    static override get defaultOptions(): PackageConfiguration.Options;

    override getData(): MaybePromise<object>; // TODO: Implement GetDataReturnType

    /** Prepare the structure of category data which is rendered in this configuration form. */
    protected abstract _prepareCategoryData(): PackageConfiguration.CategoryData;

    /**
     * Classify what Category an Action belongs to
     * @param namespace - The entry to classify
     * @returns The category the entry belongs to
     */
    protected _categorizeEntry(namespace: string): PackageConfiguration.Category;

    /** Reusable logic for how categories are sorted in relation to each other. */
    protected _sortCategories(a: PackageConfiguration.Category, b: PackageConfiguration.Category): number;

    /** {@inheritdoc} */
    protected override _render(
      force?: boolean,
      options?: Application.RenderOptions<Options> & { activeCategory: string },
    ): Promise<void>;

    /** {@inheritdoc} */
    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: string): void;

    protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    /**
     * Handle button click to reset default settings
     * @param event - The initial button click event
     */
    protected _onResetDefaults(event: JQuery.ClickEvent): void;
  }

  namespace PackageConfiguration {
    interface Any extends PackageConfiguration<any> {}

    interface Options extends FormApplication.Options {
      categoryTemplate?: string;
      submitButton?: boolean;
    }

    interface Category {
      id: string;
      title: string;
    }

    interface CategoryData<PackageCategory extends Category = Category> {
      categories: PackageCategory[];
      total: number;
    }
  }
}
