/**
 * A Macro configuration sheet
 *
 * @see {@link Macro} The Macro Entity which is being configured
 */
declare class MacroConfig extends BaseEntitySheet<BaseEntitySheet.Options, MacroConfig.Data, Macro> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "macro-sheet"],
   *   template: "templates/sheets/macro-config.html",
   *   width: 560,
   *   height: 480,
   *   resizable: true
   * });
   * ```
   */
  static get defaultOptions(): typeof BaseEntitySheet['defaultOptions'];

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
  protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

  /**
   * Save and execute the macro using the button on the configuration sheet
   * @param event - The originating click event
   */
  protected _onExecute(event: JQuery.ClickEvent): Promise<void>;

  /**
   * @override
   */
  protected _updateObject(event: Event, formData: MacroConfig.FormData): Promise<Macro>;
}

declare namespace MacroConfig {
  interface Data extends BaseEntitySheet.Data {
    macroTypes: Duplicated<Game['system']['entityTypes']['Macro']>;
    macroScopes: typeof CONST['MACRO_SCOPES'];
  }

  type FormData = Pick<Macro.Data, 'command' | 'img' | 'name' | 'type'>;
}
