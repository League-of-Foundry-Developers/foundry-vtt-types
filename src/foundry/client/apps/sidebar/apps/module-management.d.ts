/**
 * The Module Management Application.
 * This application provides a view of which modules are available to be used and allows for configuration of the
 * set of modules which are active within the World.
 * @typeParam Options - The type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class ModuleManagement<
  Options extends FormApplicationOptions = FormApplicationOptions,
  Data extends object = ModuleManagement.Data
> extends FormApplication<Options, Data, undefined> {
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
  static CONFIG_SETTING: 'moduleConfiguration';

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

  override getData(options?: Partial<Options>): Data | Promise<Data>;

  override activateListeners(html: JQuery): void;

  protected override _renderInner(data: Data): Promise<JQuery>;

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
  interface Data {
    editable: boolean;
    filters: [Data.Filter<'all'>, Data.Filter<'active'>, Data.Filter<'inactive'>];
    modules: Data.Module[];
    expanded: boolean;
  }

  namespace Data {
    interface Filter<F extends FilterName> {
      id: F;
      label: string;
      css: ' active' | '';
      count: number;
    }

    type Module = Exclude<foundry.packages.ModuleData['_source'], 'authors'> & {
      active: boolean;
      availability: number;
      data: foundry.packages.ModuleData;
      css: string;
      hasPacks: boolean;
      hasScripts: boolean;
      hasStyles: boolean;
      systemOnly: boolean;
      systemTag: Game['system']['id'];
      dependencies: string[] | null;
      unavailable?: string;
      incompatible?: string;
      authors: string | undefined;
      labels: string;
    };
  }

  type FilterName = 'all' | 'active' | 'inactive';

  type FormData = Record<string, boolean> & {
    search: string;
  };
}
