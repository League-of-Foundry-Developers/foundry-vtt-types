/**
 * A Macro configuration sheet
 *
 * @see {@link Macro} The Macro Entity which is being configured
 */
declare class MacroConfig extends BaseEntitySheet<MacroConfig.Data, Macro> {
  /**
   * @override
   */
  static get defaultOptions(): MacroConfig.Options;

  /**
   * @override
   */
  get id(): string;

  /**
   * @override
   */
  getData(): MacroConfig.Data;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Handle changing the actor profile image by opening a FilePicker
   */
  protected _onEditImage(event: Event): Promise<FilePicker.Result>;

  /**
   * Save and execute the macro using the button on the configuration sheet
   * @param event - The originating click event
   */
  protected _onExecute(event: MouseEvent): Promise<void>;

  /**
   * @override
   */
  protected _updateObject(event: Event, formData: Macro.Data): Promise<Macro>;
}

declare namespace MacroConfig {
  interface Data extends BaseEntitySheet.Data {
    macroTypes: Duplicated<any>; // TODO: type when System is typed
    macroScopes: typeof CONST['MACRO_SCOPES'];
  }

  interface Options extends BaseEntitySheet.Options {
    /**
     * @defaultValue `['sheet', 'macro-sheet']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/sheets/macro-config.html'`
     */
    template: string;

    /**
     * @defaultValue `560`
     */
    width: number;

    /**
     * @defaultValue `480`
     */
    height: 'auto' | number;

    /**
     * @defaultValue `true`
     */
    resizable: boolean;
  }
}
