import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { GetDataReturnType, MaybePromise, ValueOf } from "../../../../types/utils.d.mts";

declare global {
  /**
   * A Macro configuration sheet
   *
   * @typeParam Options - the type of the options object
   */
  class MacroConfig<Options extends DocumentSheetOptions<Macro> = DocumentSheetOptions<Macro>> extends DocumentSheet<
    Options,
    InstanceType<ConfiguredDocumentClass<typeof Macro>>
  > {
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
    static override get defaultOptions(): DocumentSheetOptions<Macro>;

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

    interface MacroConfigData<Options extends DocumentSheetOptions<Macro> = DocumentSheetOptions<Macro>>
      extends DocumentSheet.DocumentSheetData<Options, InstanceType<ConfiguredDocumentClass<typeof Macro>>> {
      macroTypes: Record<string, string>;
      macroScopes: typeof CONST.MACRO_TYPES;
    }
  }
}
