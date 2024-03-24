import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { GetDataReturnType, MaybePromise, ValueOf } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
   *
   * @typeParam Options - the type of the options object
   */
  class ActiveEffectConfig<
    Options extends DocumentSheetOptions<ActiveEffect> = DocumentSheetOptions<ActiveEffect>,
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>> {
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
    static override get defaultOptions(): DocumentSheetOptions<ActiveEffect>;

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<ActiveEffectConfig.ActiveEffectConfigData>>;

    override activateListeners(html: JQuery): void;

    /**
     * Provide centralized handling of mouse clicks on control buttons.
     * Delegate responsibility out to action-specific handlers depending on the button action.
     * @param event - The originating click event
     */
    protected _onEffectControl(event: MouseEvent): Promise<this>;

    /**
     * Handle adding a new change to the changes array.
     */
    protected _addEffectChange(): Promise<this>;

    /**
     * @param updateData - (default: `{}`)
     */
    override _getSubmitData(updateData?: FormApplication.OnSubmitOptions["updateData"]): Record<string, unknown>;
    // TODO: Can we type this better?
  }

  namespace ActiveEffectConfig {
    //@ts-expect-error - Fake polymorphism override
    interface ActiveEffectConfigData<
      Options extends DocumentSheetOptions<ActiveEffect> = DocumentSheetOptions<ActiveEffect>,
    > extends DocumentSheet.DocumentSheetData<Options, InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>> {
      labels: {
        transfer: {
          name: string;
          hint: string;
        };
      };
      effect: ActiveEffectConfig["object"]; // Backwards compatibility
      data: ActiveEffectConfig["object"];
      isActorEffect: boolean;
      isItemEffect: boolean;
      submitText: string;
      modes: Record<ValueOf<typeof CONST.ACTIVE_EFFECT_MODES>, string>;
      descriptionHTML: string;
    }
  }
}
