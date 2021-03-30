/**
 * A special class of Dialog which allows for the installation of Packages.
 * @typeParam T - The type of the packages that can be installed with this instance of `InstallPackage`.
 */
declare class InstallPackage<T extends InstallPackage.PackageType> extends Application {
  constructor(data: InstallPackage<T>['data'], options?: Application.Options);

  data: {
    packageType: T;
    setup: SetupConfigurationForm;
  };

  /**
   * The instance of the setup form to which this is linked
   */
  setup: SetupConfigurationForm;

  /**
   * The category being filtered for
   * @defaultValue `'all'`
   */
  protected _category: string;

  /**
   * The visibility being filtered for
   * @defaultValue `'all'`
   */
  protected _visibility: InstallPackage.Visibility;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: 'install-package',
   *   template: 'templates/setup/install-package.html',
   *   classes: ['dialog'],
   *   width: 720,
   *   height: 620,
   *   scrollY: ['.categories', '.package-list'],
   *   filters: [{ inputSelector: 'input[name="filter"]', contentSelector: '.package-list' }]
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

  /** @override */
  get title(): string;

  /** @override */
  render(...args: Parameters<Application['render']>): this;

  /** @override */
  getData(options: Application.RenderOptions): InstallPackage.Data<T>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle left-click events to filter to a certain module category
   */
  protected _onClickCategoryFilter(event: JQuery.ClickEvent): void;

  /**
   * Handle left-click events to filter to a certain visibility state
   */
  protected _onClickVisibilityFilter(event: JQuery.ClickEvent): void;

  /**
   * Handle a left-click event on the package title
   */
  protected _onClickPackageTitle(event: JQuery.ClickEvent): void;

  /**
   * Handle a left-click event on the package "Install" button
   */
  protected _onClickPackageInstall(event: JQuery.ClickEvent): void;

  /** @override */
  protected _onSearchFilter(event: KeyboardEvent, query: string, html: HTMLElement): void;

  /**
   * Organize package data and cache it to the application
   * @param type - The type of packages being retrieved
   * @returns The retrieved or cached packages
   */
  static getPackages<T extends InstallPackage.PackageType>(type: T): Promise<InstallPackage.Data.Package<T>[]>;

  /**
   * A cached object of retrieved packages from the web server
   */
  static cache: {
    [Key in InstallPackage.PackageType]: InstallPackage.Cache<Key>;
  };
}

declare namespace InstallPackage {
  type PackageType = 'world' | 'system' | 'module';

  interface Data<T extends PackageType> {
    loading: boolean;
    packageType: string;
    tags: Partial<Record<string, Data.Tag<T>>>;
    visibility: [Data.Visibility<'inst'>, Data.Visibility<'unin'>, Data.Visibility<'all'>];
    packages: Data.Package<T>[];
  }

  namespace Data {
    type Tag<T extends PackageType> = {
      active: boolean;
      count: number;
      css: string;
      label: string;
    } & Record<T, true>;

    interface Visibility<T extends InstallPackage.Visibility> {
      id: T;
      css: string;
      label: string;
    }

    interface Package<T extends PackageType> {
      approved: true;
      author: string;
      content_provider: string;
      cssClass: string;
      description: string;
      id: number;
      installed: boolean;
      is_exclusive: boolean;
      is_protected: boolean;
      locked: boolean;
      name: string;
      owned: boolean;
      protected_download_url: string;
      requires: string[];
      tags: string[];
      title: string;
      type: T;
      url: string;
      version: Version;
    }

    interface Version {
      compatible_core_version: string;
      id: number;
      manifest: string;
      notes: string;
      package: number;
      required_core_version: string;
      version: string;
    }
  }

  type Visibility = 'inst' | 'unin' | 'all';

  interface Cache<T extends PackageType> {
    packages: Data.Package<T>[] | null;
    tags: Partial<Record<string, Data.Tag<T>>> | null;
  }
}
