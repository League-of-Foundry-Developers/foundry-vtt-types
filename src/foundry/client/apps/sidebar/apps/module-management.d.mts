import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * The Module Management Application.
   * This application provides a view of which modules are available to be used and allows for configuration of the
   * set of modules which are active within the World.
   * @typeParam Options - The type of the options object
   */
  class ModuleManagement<Options extends FormApplication.Options = FormApplication.Options> extends FormApplication<
    FormApplication.NoObject,
    Options
  > {
    /**
     * @param options - Module Management application options.
     */
    constructor(options: Partial<Options>);

    /** @internal */
    protected _filter: ModuleManagement.FilterName;

    /**
     * @defaultValue `true`
     * @internal
     */
    protected _expanded: boolean;

    /**
     * The named game setting which persists module configuration.
     */
    static CONFIG_SETTING: "moduleConfiguration";

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   title: game.i18n.localize("MODMANAGE.Title"),
     *   id: "module-management",
     *   template: "templates/sidebar/apps/module-management.html",
     *   popOut: true,
     *   width: 680,
     *   height: "auto",
     *   scrollY: [".package-list"],
     *   closeOnSubmit: false,
     *   filters: [{inputSelector: 'input[name="search"]', contentSelector: ".package-list"}]
     * });
     * ```
     */
    static override get defaultOptions(): FormApplication.Options;

    override get isEditable(): boolean;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): MaybePromise<object>;

    /**
     * Given a module, determines if it meets minimum and maximum compatibility requirements of its dependencies.
     * If not, it is marked as being unable to be activated.
     * If the package does not meet verified requirements, it is marked with a warning instead.
     * @param module - The module.
     */
    protected _evaluateDependencies(module: Module): void;

    /**
     * Given a module, determine if it meets the minimum and maximum system compatibility requirements.
     * @param module - The module.
     */
    protected _evaluateSystemCompatibility(module: Module): void;

    override activateListeners(html: JQuery): void;

    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery>;

    protected override _getSubmitData(updateData?: object | null): ModuleManagement.FormData;

    protected override _updateObject(
      event: Event,
      formData: ModuleManagement.FormData,
    ): Promise<Record<string, boolean> | number>;

    /**
     * Handle changes to a module checkbox to prompt for whether or not to enable dependencies
     * @internal
     */
    protected _onChangeCheckbox(event: JQuery.ChangeEvent): Promise<unknown>;

    // #checkImpactedDependency
    // #checkUpstreamPackages

    /**
     * Indicate if any Documents would become unavailable if the module were disabled, and confirm if the user wishes to
     * proceed.
     * @param module - The module being disabled.
     * @returns A Promise which resolves to true if disabling should continue.
     */
    protected _confirmDocumentsUnavailable(module: Module): Promise<boolean>;

    /**
     * Handle a button-click to deactivate all modules
     * @internal
     */
    protected _onDeactivateAll(event: JQuery.ClickEvent): void;

    /**
     * Handle expanding or collapsing the display of descriptive elements
     * @internal
     */
    protected _onExpandCollapse(event: JQuery.ClickEvent): void;

    /**
     * Handle a button-click to deactivate all modules
     * @internal
     */
    protected _onFilterList(event: JQuery.ClickEvent): void;

    protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    /**
     * Format a document count collection for display.
     * @param counts   - An object of sub-type counts.
     * @param isActive - Whether the module is active.
     */
    protected _formatDocumentSummary(counts: ClientIssues.ModuleSubTypeCounts, isActive: boolean): string;
  }

  namespace ModuleManagement {
    interface Any extends ModuleManagement<any> {}

    type FilterName = "all" | "active" | "inactive";

    type FormData = Record<string, boolean> & {
      search: string;
    };
  }
}
