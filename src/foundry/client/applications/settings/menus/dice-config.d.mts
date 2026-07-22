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
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "dice-config",
   *   tag: "form",
   *   window: {
   *     contentClasses: ["standard-form"],
   *     title: "DICE.CONFIG.Title",
   *     icon: "fa-solid fa-dice"
   *   },
   *   position: {
   *     width: 480
   *   },
   *   form: {
   *     closeOnSubmit: true,
   *     handler: DiceConfig.#onSubmit
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DiceConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Dice Configuration setting name.
   * @deprecated "DiceConfig.SETTING is deprecated: use {@linkcode foundry.dice.Roll.DICE_CONFIGURATION_SETTING | Roll.DICE_CONFIGURATION_SETTING}
   * instead." (since v13, until v15)
   */
  static get SETTING(): "diceConfiguration";

  /**
   * Register setting and menu.
   */
  static registerSetting(): void;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  /**
   * @privateRemarks Prevents duck typing
   */
  #DiceConfig: true;
}

declare namespace DiceConfig {
  interface Any extends AnyDiceConfig {}
  interface AnyConstructor extends Identity<typeof AnyDiceConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    methods: { value: string; label: string }[];
    defaultMethod: string;
    dice: { label: string; icon: string; denomination: string; method: string }[];
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
