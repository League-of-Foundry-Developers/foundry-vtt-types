import type { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * A Macro configuration sheet
   *
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class MacroConfig<
    Options extends DocumentSheetOptions = MacroConfig.Options,
    Data extends object = MacroConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof Macro>>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "macro-sheet"],
     *   template: "templates/sheets/macro-config.html",
     *   width: 560,
     *   height: 480,
     *   resizable: true
     * });
     * ```
     */
    static override get defaultOptions(): MacroConfig.Options;

    override get id(): string;

    override getData(options?: Partial<Options>): Data;

    override activateListeners(html: JQuery): void;

    protected override _disableFields(form: HTMLElement): void;

    /**
     * Handle changing the actor profile image by opening a FilePicker
     * @internal
     */
    protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

    /**
     * Save and execute the macro using the button on the configuration sheet
     * @param event - The originating click event
     * @internal
     */
    protected _onExecute(event: JQuery.ClickEvent): Promise<void>;

    protected override _updateObject(event: Event, formData: MacroConfig.FormData): Promise<unknown>;
  }

  namespace MacroConfig {
    type Options = DocumentSheetOptions;

    /**
     * @typeParam Options - the type of the options object
     */
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClass<typeof Macro>>, Options> {
      macroTypes: Array<ValueOf<typeof CONST.MACRO_TYPES>>;
      macroScopes: typeof foundry.CONST['MACRO_SCOPES'];
    }

    type FormData = {
      command: string;
      img: string;
      name: string;
      type: ValueOf<typeof CONST.MACRO_TYPES>;
    };
  }
}
