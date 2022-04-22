import { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
   *
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class ActiveEffectConfig<
    Options extends DocumentSheetOptions = ActiveEffectConfig.Options,
    Data extends object = ActiveEffectConfig.Data
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "active-effect-sheet"],
     *   template: "templates/sheets/active-effect-config.html",
     *   width: 560,
     *   height: "auto",
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "details"}]
     * });
     * ```
     */
    static override get defaultOptions(): ActiveEffectConfig.Options;

    override get title(): string;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    override activateListeners(html: JQuery): void;

    /**
     * Provide centralized handling of mouse clicks on control buttons.
     * Delegate responsibility out to action-specific handlers depending on the button action.
     * @param event - The originating click event
     */
    protected _onEffectControl(event: JQuery.ClickEvent): Promise<this> | void;

    /**
     * Handle adding a new change to the changes array.
     */
    protected _addEffectChange(): Promise<this>;

    /**
     * @param updateData - (default: `{}`)
     */
    override _getSubmitData(updateData?: FormApplication.OnSubmitOptions['updateData']): Record<string, unknown>;
    // TODO: Can we type this better?
  }

  namespace ActiveEffectConfig {
    interface Data {
      effect: ActiveEffectConfig['object']['data'];
      data: ActiveEffectConfig['object']['data'];
      isActorEffect: boolean;
      isItemEffect: boolean;
      submitText: string;
      modes: Record<foundry.CONST.ACTIVE_EFFECT_MODES, string>;
    }

    type Options = DocumentSheetOptions;
  }
}
