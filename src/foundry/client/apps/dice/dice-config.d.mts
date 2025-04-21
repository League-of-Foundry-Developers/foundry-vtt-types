import type { MaybePromise, GetDataReturnType, EmptyObject, Identity } from "fvtt-types/utils";

declare global {
  /**
   * An application responsible for configuring how dice are rolled and evaluated.
   */
  class DiceConfig<Options extends FormApplication.Options = FormApplication.Options> extends FormApplication<
    Options,
    FormApplication.NoObject
  > {
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
    static get defaultOptions(): FormApplication.Options;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<DiceConfig.Data>>;

    protected override _updateObject(
      event: Event,
      formData?: object,
    ): Promise<Record<CONFIG.Dice.DTermDiceStrings, string>>;
  }

  namespace DiceConfig {
    interface Any extends AnyDiceConfig {}
    interface AnyConstructor extends Identity<typeof AnyDiceConfig> {}

    /** @deprecated {@link DiceConfig.Data | `DiceConfig.Data`} */
    type DiceConfigData = Data;

    /** @deprecated {@link DiceConfig.DiceDat | `DiceConfig.DiceDat`} */
    type DiceConfigDiceData = DiceData;

    interface Data {
      dice: DiceData[];
      methods: Record<string, CONFIG.Dice.FulfillmentMethod>;
      object: EmptyObject;
    }

    interface DiceData {
      label: string;
      icon: string;
      denomination: CONFIG.Dice.DTermDiceStrings;
      method: string;
    }
  }
}

declare abstract class AnyDiceConfig extends DiceConfig<FormApplication.Options> {
  constructor(...args: never);
}
