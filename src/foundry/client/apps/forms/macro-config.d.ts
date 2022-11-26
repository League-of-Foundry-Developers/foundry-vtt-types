import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

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

    override get id(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    protected override _disableFields(form: HTMLElement): void;

    /**
     * Handle changing the actor profile image by opening a FilePicker
     * @internal
     */
    protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker["browse"]>;

    /**
     * Save and execute the macro using the button on the configuration sheet
     * @param event - The originating click event
     * @internal
     */
    protected _onExecute(event: JQuery.ClickEvent): Promise<void>;

    protected override _updateObject(event: Event, formData: MacroConfig.FormData): Promise<unknown>;
  }

  namespace MacroConfig {
    type FormData = {
      command: string;
      img: string;
      name: string;
      type: ValueOf<typeof CONST.MACRO_TYPES>;
    };
  }
}
