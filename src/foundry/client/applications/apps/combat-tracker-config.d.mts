import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type { ClientSettings } from "#client/helpers/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CombatTrackerConfig: CombatTrackerConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring the CombatTracker and its contents.
 */
declare class CombatTrackerConfig<
  RenderContext extends CombatTrackerConfig.RenderContext = CombatTrackerConfig.RenderContext,
  Configuration extends CombatTrackerConfig.Configuration = CombatTrackerConfig.Configuration,
  RenderOptions extends CombatTrackerConfig.RenderOptions = CombatTrackerConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "combat-tracker-config",
   *   tag: "form",
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-swords",
   *     title: "COMBAT.Settings"
   *   },
   *   position: {width: 480},
   *   form: {
   *     closeOnSubmit: true,
   *     handler: CombatTrackerConfig.#saveSettings
   *   },
   *   actions: {
   *     previewTheme: CombatTrackerConfig.#onPreviewTheme
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: CombatTrackerConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #CombatTrackerConfig: true;
}

declare namespace CombatTrackerConfig {
  interface Any extends AnyCombatTrackerConfig {}
  interface AnyConstructor extends Identity<typeof AnyCombatTrackerConfig> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    rootId: string;
    attributeChoices: TokenDocument.TrackedAttributesChoice[];
    canConfigure: boolean;
    combatTheme: ClientSettings.SettingConfig | undefined;

    /**
     * @remarks TODO: Typed as a plain shape because fvtt-types
     * doesn't yet type the `data/combat-config.mjs` `CombatConfiguration` class (new in v14) which owns this schema.
     */
    fields: Record<string, fields.DataField.Any>;
    selectedTheme: string;
    settings: Combat.SettingData;

    /**
     * @remarks TODO: Typed as a plain shape because fvtt-types
     * doesn't yet type the `data/combat-config.mjs` `CombatConfiguration` class (new in v14) which owns this getter.
     */
    animationChoices: { value: string; label: string }[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<CombatTrackerConfig extends CombatTrackerConfig.Any = CombatTrackerConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CombatTrackerConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CombatTrackerConfig extends CombatTrackerConfig.Any = CombatTrackerConfig.Any> = DeepPartial<
    Configuration<CombatTrackerConfig>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyCombatTrackerConfig extends CombatTrackerConfig<
  CombatTrackerConfig.RenderContext,
  CombatTrackerConfig.Configuration,
  CombatTrackerConfig.RenderOptions
> {
  constructor(...args: never);
}

export default CombatTrackerConfig;
