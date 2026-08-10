import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DiceConfig: DiceConfig.Any;
    }
  }
}

/**
 * The application responsible for configuring methods of DiceTerm resolution.
 */
declare class DiceConfig<
  RenderContext extends DiceConfig.RenderContext = DiceConfig.RenderContext,
  Configuration extends DiceConfig.Configuration = DiceConfig.Configuration,
  RenderOptions extends DiceConfig.RenderOptions = DiceConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DiceConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Dice Configuration setting name.
   *
   * @deprecated "DiceConfig.SETTING is deprecated: use Roll.DICE_CONFIGURATION_SETTING instead." (since v13 until v15)
   */
  static get SETTING(): typeof foundry.dice.Roll.DICE_CONFIGURATION_SETTING;

  /**
   * Register setting and menu.
   */
  static registerSetting(): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  static #DiceConfig: true;
}

declare namespace DiceConfig {
  interface Any extends AnyDiceConfig {}
  interface AnyConstructor extends Identity<typeof AnyDiceConfig> {}

  interface MethodContext {
    value: string;
    label: string;
  }

  interface DenominationContext {
    label: string;

    icon: string;

    denomination: string;

    /** @remarks The empty string when this denomination follows the default method. */
    method: string;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    /**
     * @remarks The manual method is omitted for a user without the `MANUAL_ROLLS` permission — by
     * deleting it from {@linkcode CONFIG.Dice.fulfillment}, so it stays gone for the rest of the session.
     */
    methods: MethodContext[];

    defaultMethod: string;

    dice: DenominationContext[];

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<DiceConfig extends DiceConfig.Any = DiceConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<DiceConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DiceConfig extends DiceConfig.Any = DiceConfig.Any> = DeepPartial<Configuration<DiceConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyDiceConfig extends DiceConfig<
  DiceConfig.RenderContext,
  DiceConfig.Configuration,
  DiceConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DiceConfig;
