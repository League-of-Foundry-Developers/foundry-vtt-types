import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

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

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {template: "templates/apps/combat-tracker-config.hbs", scrollable: [""]},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

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

    /** @remarks Tracked attribute paths for the Token bar selectors, with `"value"` appended to each bar attribute. */
    attributeChoices: TokenDocument.TrackedAttributesChoice[];

    /** @remarks `game.user.can("SETTINGS_MODIFY")`; the tracker settings are read-only without it. */
    canConfigure: boolean;

    combatTheme: foundry.helpers.ClientSettings.SettingConfig;

    fields: foundry.data.CombatConfiguration.ConfigSettingSchema;

    selectedTheme: string;

    settings: Combat.SettingData;

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
