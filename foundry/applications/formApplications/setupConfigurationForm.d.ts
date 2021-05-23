/**
 * The Package Configuration setup application
 */
declare class SetupConfigurationForm extends FormApplication<FormApplication.Options, SetupConfigurationForm.Data> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "setup-configuration",
   *   classes: ["dark"],
   *   template: "templates/setup/setup-config.html",
   *   popOut: false,
   *   scrollY: ["#world-list", "#system-list", "#module-list"],
   *   tabs: [{navSelector: ".tabs", contentSelector: ".content", initial: "worlds"}]
   * });
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  static tagPackageAvailability(pkg: Game.Module | Game.System | Game.World): void;

  constructor({
    systems,
    modules,
    worlds,
    currentWorld
  }: {
    systems: SetupConfigurationForm['systems'];
    modules: SetupConfigurationForm['modules'];
    worlds: SetupConfigurationForm['worlds'];
    currentWorld?: SetupConfigurationForm['currentWorld'];
  });

  /**
   * The currently inspected World
   * @defaultValue `null`
   */
  currentWorld: string | null;

  /**
   * Install Modules to configure
   */
  modules: Game.Module[];

  /**
   * Valid Game Systems to choose from
   */
  systems: Game.System[];

  /**
   * The Array of available Worlds to load
   */
  worlds: Game.World[];

  /**
   * Track the button elements which represent updates for different named packages
   * @defaultValue `null`
   */
  protected _progressButton: HTMLElement | null;

  /**
   * The currently viewed tab
   */
  protected _tab: 'worlds';

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Activate socket listeners related to the Setup Configuration form
   */
  activateSocketListeners(): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): SetupConfigurationForm.Data;

  /**
   * Handle button clicks to update the core VTT software
   */
  protected _onCoreUpdate(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle install button clicks to add new packages
   */
  protected _onInstallPackageDialog(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Confirm user intent when saving admin changes to the application configuration
   * @param event - The originating mouse click event
   */
  protected _onSaveAdmin(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Generic button handler for the setup form which submits a POST request including any dataset on the button itself
   * @param event - The originating mouse click event
   */
  protected _onSubmitButton(event: JQuery.ClickEvent): ReturnType<SetupConfigurationForm['_post']>;

  /**
   * Handle uninstall button clicks to remove existing packages
   */
  protected _onUninstallPackage(event: JQuery.ClickEvent): void;

  /**
   * Handle update button press for a single Package
   */
  protected _onUpdatePackage(
    event: JQuery.ClickEvent
  ):
    | Promise<void>
    | ReturnType<SetupConfigurationForm['_updateCheckOne']>
    | ReturnType<SetupConfigurationForm['_updateDownloadOne']>;

  /**
   * Execute upon an update-all workflow to update all packages of a certain type
   */
  protected _onUpdatePackages(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Begin creation of a new World using the config form
   * @param event - The originating mouse click event
   */
  protected _onWorldConfig(event: JQuery.ClickEvent): void;

  /**
   * Post the setup configuration form
   */
  protected _post(data: {
    action: string;
    world?: string;
  }): Promise<Record<string, unknown> & { error?: string; stack?: string }>;

  /**
   * Execute upon an update check for a single Package
   * @param type   - The package type to check
   * @param name   - The package name to check
   * @param button - The update button for the package
   */
  protected _updateCheckOne(type: string, name: string, button: HTMLElement): Promise<void | boolean>;

  /**
   * Execute upon an update download for a single Package
   * Returns a Promise which resolves once the download has successfully started
   * @param type   - The package type to install
   * @param name   - The package name to install
   * @param button - The Download button
   */
  protected _updateDownloadOne(
    type: string,
    name: string,
    button: HTMLElement
  ): Promise<ReturnType<typeof SetupConfiguration['installPackage']>>;

  /**
   * @remarks This method does not exist on SetupConfigurationForm and only exists to make the typescript compile!
   */
  protected _updateObject(...args: unknown[]): never;

  /**
   * Update the display of an installation progress bar for a particular progress packet
   * @param data - The progress update data
   */
  protected _updateProgressBar(data: SetupConfigurationForm.ProgressData): void;

  /**
   * Update installation progress for a particular button which triggered the action
   * @param data - The progress update data
   */
  protected _updateProgressButton(data: SetupConfigurationForm.ProgressData): void;

  /**
   * Reload the setup view by re-acquiring setup data and re-rendering the form
   */
  protected reload(): Promise<void>;
}

declare namespace SetupConfigurationForm {
  interface Data {
    adminKey: Game['data']['adminKey'];
    coreUpdate: string | false;
    coreVersion: Game['data']['version'];
    coreVersionHint: string;
    current: undefined; // TODO: this seems to have a value that is never assigned (`this.current`)
    languages: Game['data']['languages'];
    modules: Data.AvailTagged<Game.Module>[];
    options: Game['data']['options'] & { upnp: boolean };
    systems: Data.AvailTagged<Game.System>[];
    updateChannels: Record<keyof typeof CONST['SOFTWARE_UPDATE_CHANNELS'], string>;
    world: ReturnType<SetupConfigurationForm['worlds']['find']>;
    worlds: Data.AvailTagged<Game.World>[];
  }

  namespace Data {
    type AvailTagged<P extends Game.Module | Game.System | Game.World> = P & {
      incompatible?: string;
      unavailable?: string;
    };
  }

  interface ProgressData {
    pct: number;
    step: string | number;
    type: string;
  }
}
