/**
 * The Package Configuration setup application
 */
declare class SetupConfigurationForm extends FormApplication<SetupConfigurationForm.Data> {
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
   * Valid Game Systems to choose from
   */
  systems: Game.System[];

  /**
   * Install Modules to configure
   */
  modules: Game.Module[];

  /**
   * The Array of available Worlds to load
   */
  worlds: Game.World[];

  /**
   * The currently inspected World
   * @defaultValue `null`
   */
  currentWorld: string | null;

  /**
   * The currently viewed tab
   */
  protected _tab: 'worlds';

  /**
   * Track the button elements which represent updates for different named packages
   * @defaultValue `null`
   */
  protected _progressButton: HTMLElement | null;

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
  static get defaultOptions(): FormApplication.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): SetupConfigurationForm.Data;

  static tagPackageAvailability(pkg: Game.Module | Game.System | Game.World): void;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Post the setup configuration form
   */
  protected _post(data: { action: string; world?: string }): Promise<string | { error?: string; stack?: string }>;

  /**
   * Reload the setup view by re-acquiring setup data and re-rendering the form
   */
  protected reload(): Promise<void>;

  /**
   * Generic button handler for the setup form which submits a POST request including any dataset on the button itself
   * @param event - The originating mouse click event
   */
  protected _onSubmitButton(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Confirm user intent when saving admin changes to the application configuration
   * @param event - The originating mouse click event
   */
  protected _onSaveAdmin(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Begin creation of a new World using the config form
   * @param event - The originating mouse click event
   */
  protected _onWorldConfig(event: JQuery.ClickEvent): void;

  /**
   * Handle install button clicks to add new packages
   */
  protected _onInstallPackageDialog(event: JQuery.ClickEvent): Promise<void>;

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
   * Handle uninstall button clicks to remove existing packages
   */
  protected _onUninstallPackage(event: JQuery.ClickEvent): void;

  /**
   * Execute upon an update-all workflow to update all packages of a certain type
   */
  protected _onUpdatePackages(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle button clicks to update the core VTT software
   */
  protected _onCoreUpdate(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Activate socket listeners related to the Setup Configuration form
   */
  activateSocketListeners(): void;

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
   * @remarks This method does not exist on SetupConfigurationForm and only exists to make the typescript compile!
   */
  protected _updateObject(...args: unknown[]): never;
}

declare namespace SetupConfigurationForm {
  interface Data {
    coreVersion: Game['data']['version'];
    coreVersionHint: string;
    systems: Data.AvailTagged<Game.System>[];
    modules: Data.AvailTagged<Game.Module>[];
    worlds: Data.AvailTagged<Game.World>[];
    languages: Game['data']['languages'];
    options: Game['data']['options'] & { upnp: boolean };
    adminKey: Game['data']['adminKey'];
    world: ReturnType<SetupConfigurationForm['worlds']['find']>;
    current: undefined; // TODO: this seems to have a value that is never assigned (`this.current`)
    updateChannels: Record<keyof typeof CONST['SOFTWARE_UPDATE_CHANNELS'], string>;
    coreUpdate: string | false;
  }

  namespace Data {
    type AvailTagged<P extends Game.Module | Game.System | Game.World> = P & {
      incompatible?: string;
      unavailable?: string;
    };
  }

  interface ProgressData {
    type: string;
    pct: number;
    step: string | number;
  }
}
