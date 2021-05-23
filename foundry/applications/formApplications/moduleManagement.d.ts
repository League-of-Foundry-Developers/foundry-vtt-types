/**
 * The Module Management Application.
 * This application provides a view of which modules are available to be used and allows for configuration of the
 * set of modules which are active within the World.
 */
declare class ModuleManagement extends FormApplication<FormApplication.Options, ModuleManagement.Data, any> {
  static readonly CONFIG_SETTING: 'moduleConfiguration';

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

  /**
   * @defaultValue `{}`
   */
  protected _checked: Partial<Record<string, boolean>>;

  /**
   * @defaultValue `false`
   */
  protected _expanded: boolean;

  /**
   * @defaultValue `'all'`
   */
  protected _filter: ModuleManagement.FilterName;

  /** @override */
  get isEditable(): ReturnType<User['can']>;

  /** @override */
  activateListeners(html: JQuery): void;

  /** @override */
  getData(options?: Application.RenderOptions): ModuleManagement.Data;

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
  protected _onSearchFilter(event: KeyboardEvent, query: string, html: HTMLElement): void;

  /**
   * @param event - (unused)
   * @override
   */
  // TODO: type return value when the class' config setting is typed
  protected _updateObject(event: Event, formData: ModuleManagement.FormData): Promise<unknown>;
}

declare namespace ModuleManagement {
  interface Data {
    editable: ModuleManagement['isEditable'];
    expanded: ModuleManagement['_expanded'];
    filters: [Data.Filter<'all'>, Data.Filter<'active'>, Data.Filter<'inactive'>];
    modules: Data.Module[];
    query: undefined; // TODO: this seems to reference an undefined value (`this._query`)
  }

  namespace Data {
    interface Filter<F extends FilterName> {
      count: number;
      css: ' active' | '';
      id: F;
      label: string;
    }

    interface Module extends Duplicated<Game.Module> {
      active: boolean;
      css: ' active' | '';
      dependencies: string[] | null;
      hasPacks: boolean;
      hasScripts: boolean;
      hasStyles: boolean;
      incompatible: SetupConfigurationForm.Data.AvailTagged<Game.Module>['incompatible'];
      systemOnly: boolean;
      systemTag: Game['system']['id'];
      unavailable: SetupConfigurationForm.Data.AvailTagged<Game.Module>['unavailable'];
    }
  }

  type FilterName = 'all' | 'active' | 'inactive';

  interface FormData {
    search: string;
  }
}
