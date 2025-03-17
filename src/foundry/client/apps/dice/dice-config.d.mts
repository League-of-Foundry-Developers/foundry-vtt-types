import type { MaybePromise, GetDataReturnType, EmptyObject, Identity } from "fvtt-types/utils";

declare global {
  /**
   * An application responsible for configuring how dice are rolled and evaluated.
   */
  class DiceConfig<Options extends FormApplicationOptions = FormApplicationOptions> extends FormApplication<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *    id: "dice-config",
     *    template: "templates/dice/config.html",
     *    title: "DICE.CONFIG.Title",
     *    width: 500
     * });
     * ```
     */
    static get defaultOptions(): FormApplicationOptions;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<DiceConfig.DiceConfigData>>;

    protected override _updateObject(
      event: Event,
      formData?: object,
    ): Promise<Record<CONFIG.Dice.DTermDiceStrings, string>>;
  }

  namespace DiceConfig {
    interface Any extends AnyDiceConfig {}
    interface AnyConstructor extends Identity<typeof AnyDiceConfig> {}

    interface DiceConfigData {
      dice: DiceConfigDiceData[];
      methods: Record<string, CONFIG.Dice.FulfillmentMethod>;
      object: EmptyObject;
    }

    interface DiceConfigDiceData {
      label: string;
      icon: string;
      denomination: CONFIG.Dice.DTermDiceStrings;
      method: string;
    }
  }
}

declare abstract class AnyDiceConfig extends DiceConfig<FormApplicationOptions> {
  constructor(arg0: never, ...args: never[]);
}
