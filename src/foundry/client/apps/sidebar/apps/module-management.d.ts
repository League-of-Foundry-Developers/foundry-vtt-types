/**
 * The Module Management Application.
 * This application provides a view of which modules are available to be used and allows for configuration of the
 * set of modules which are active within the World.
 * @typeParam Options - The type of the options object
 */
declare class ModuleManagement<Options extends FormApplicationOptions = FormApplicationOptions> extends FormApplication<
  Options,
  undefined
> {
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
   * mergeObject(super.defaultOptions, {
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
  static override get defaultOptions(): FormApplicationOptions;

  override get isEditable(): boolean;

  override getData(options?: Partial<Options>): MaybePromise<object>;

  override activateListeners(html: JQuery): void;

  protected override _renderInner(data: object): Promise<JQuery>;

  protected override _updateObject(event: Event, formData: ModuleManagement.FormData): Promise<unknown>;

  /**
   * Handle changes to a module checkbox to prompt for whether or not to enable dependencies
   * @internal
   */
  protected _onChangeCheckbox(event: JQuery.ChangeEvent): unknown;

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
}

declare namespace ModuleManagement {
  type FilterName = "all" | "active" | "inactive";

  type FormData = Record<string, boolean> & {
    search: string;
  };
}
