import type { GetDataReturnType, MaybePromise, ValueOf } from "../../../../utils/index.d.mts";

declare global {
  /**
   * A Macro configuration sheet
   *
   * @typeParam Options - the type of the options object
   */
  class MacroConfig<
    Options extends DocumentSheetOptions<Macro.ConfiguredInstance> = DocumentSheetOptions<Macro.ConfiguredInstance>,
  > extends DocumentSheet<Options, Macro.ConfiguredInstance> {
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
    static override get defaultOptions(): DocumentSheetOptions<Macro.ConfiguredInstance>;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<MacroConfig.MacroConfigData>>;

    override activateListeners(html: JQuery): void;

    protected override _disableFields(form: HTMLElement): void;

    /**
     * Save and execute the macro using the button on the configuration sheet
     * @param event - The originating click event
     * @internal
     */
    protected _onExecute(event: MouseEvent): Promise<void>;

    protected override _updateObject(event: Event, formData: MacroConfig.FormData): Promise<unknown>;
  }

  namespace MacroConfig {
    type Any = MacroConfig<any>;

    interface FormData {
      command: string;
      img: string;
      name: string;
      type: ValueOf<typeof CONST.MACRO_TYPES>;
    }

    interface MacroConfigData<
      Options extends DocumentSheetOptions<Macro.ConfiguredInstance> = DocumentSheetOptions<Macro.ConfiguredInstance>,
    > extends DocumentSheet.DocumentSheetData<Options, Macro.ConfiguredInstance> {
      macroTypes: Record<string, string>;
      macroScopes: typeof CONST.MACRO_TYPES;
    }
  }
}
