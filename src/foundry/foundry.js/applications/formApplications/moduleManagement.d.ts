/**
 * The Module Management Application.
 * This application provides a view of which modules are available to be used and allows for configuration of the
 * set of modules which are active within the World.
 */
declare class ModuleManagement extends FormApplication<FormApplication.Options, ModuleManagement.Data, any> {
  /**
   * @defaultValue `'all'`
   */
  protected _filter: ModuleManagement.FilterName;

  /**
   * @defaultValue `false`
   */
  protected _expanded: boolean;

  /**
   * @defaultValue `{}`
   */
  protected _checked: Partial<Record<string, boolean>>;

  /**
   * @override
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
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /** @override */
  get isEditable(): boolean;

  /** @override */
  getData(options?: Application.RenderOptions): ModuleManagement.Data;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * @param event - (unused)
   * @override
   */
  // TODO: type return value when the class' config setting is typed
  protected _updateObject(event: Event, formData: ModuleManagement.FormData): Promise<unknown>;

  /**
   * Handle changes to a module checkbox to prompt for whether or not to enable dependencies
   */
  protected _onChangeCheckbox(event: JQuery.ChangeEvent): void;

  /**
   * Handle a button-click to deactivate all modules
   */
  protected _onDeactivateAll(event: JQuery.ClickEvent): void;

  /**
   * Handle expanding or collapsing the display of descriptive elements
   */
  protected _onExpandCollapse(event: JQuery.ClickEvent): void;

  /**
   * Handle a button-click to deactivate all modules
   */
  protected _onFilterList(event: JQuery.ClickEvent): void;

  /** @override */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  static readonly CONFIG_SETTING: 'moduleConfiguration';
}

declare namespace ModuleManagement {
  interface Data {
    editable: ModuleManagement['isEditable'];
    filters: [Data.Filter<'all'>, Data.Filter<'active'>, Data.Filter<'inactive'>];
    modules: Data.Module[];
    query: undefined; // TODO: this seems to reference an undefined value (`this._query`)
    expanded: ModuleManagement['_expanded'];
  }

  namespace Data {
    interface Filter<F extends FilterName> {
      id: F;
      label: string;
      css: ' active' | '';
      count: number;
    }

    interface Module extends foundry.utils.Duplicated<Game.Module> {
      active: boolean;
      css: ' active' | '';
      hasPacks: boolean;
      hasScripts: boolean;
      hasStyles: boolean;
      systemOnly: boolean;
      systemTag: Game['system']['id'];
      incompatible: any; // TODO
      unavailable: any; // TODO
      dependencies: string[] | null;
    }
  }

  type FilterName = 'all' | 'active' | 'inactive';

  interface FormData {
    search: string;
  }
}
