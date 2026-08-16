import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import fields = foundry.data.fields;
import PrototypeTokenOverrides = foundry.data.PrototypeTokenOverrides;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PrototypeOverridesConfig: PrototypeOverridesConfig.Any;
    }
  }
}

/**
 * A submenu for managing user overrides of PrototypeTokens
 */
declare class PrototypeOverridesConfig<
  RenderContext extends PrototypeOverridesConfig.RenderContext = PrototypeOverridesConfig.RenderContext,
  Configuration extends PrototypeOverridesConfig.Configuration = PrototypeOverridesConfig.Configuration,
  RenderOptions extends PrototypeOverridesConfig.RenderOptions = PrototypeOverridesConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "prototype-token-overrides",
   *   tag: "form",
   *   window: {
   *     title: "SETTINGS.PrototypeTokenOverrides.Name",
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-circle-user"
   *   },
   *   position: {width: 560},
   *   form: {
   *     closeOnSubmit: true,
   *     handler: PrototypeOverridesConfig.#onSubmit
   *   },
   *   actions: {
   *     onResetDefaults: PrototypeOverridesConfig.#onResetDefaults
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PrototypeOverridesConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   tabs: {template: "templates/generic/tab-navigation.hbs"},
   *   body: {template: "templates/settings/menus/prototype-overrides.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Register this menu application and the setting it manages.
   *
   * @remarks Does nothing outside a game or stream view, so the setting is absent during setup.
   */
  static registerSettings(): void;

  /**
   * @remarks Carries one group per Actor subtype alongside `main`, so each type keeps its own active subtab.
   */
  override tabGroups: Record<string, string | null>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  #PrototypeOverridesConfig: true;

  static #PrototypeOverridesConfigStatic: true;
}

declare namespace PrototypeOverridesConfig {
  interface Any extends AnyPrototypeOverridesConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeOverridesConfig> {}

  interface SubTypeData extends fields.SchemaField.InitializedData<PrototypeTokenOverrides.ActorSubTypeSchema> {}

  /** The `basics` / `marker` subtab of a single Actor type's tab. */
  interface SubTab extends ApplicationV2.Tab {
    icon: string;
  }

  /** One Actor type's overrides, rendered as a tab with its own pair of subtabs. */
  interface Tab extends ApplicationV2.Tab {
    cssClass: string;

    fields: PrototypeTokenOverrides.ActorSubTypeSchema;

    data: SubTypeData;

    subtabs: Record<string, SubTab>;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    /** @remarks Keyed by Actor subtype, with `base` standing for the all-types overrides. */
    tabs: Record<string, Tab>;

    tabClasses: string;

    rootId: string;

    buttons: ApplicationV2.FormFooterButton[];

    /** @remarks Choices for the tri-state fields, whose third state is "no override". */
    booleanOptions: Record<string, string>;

    displayModes: Record<CONST.TOKEN_DISPLAY_MODES, string>;

    dispositions: Record<CONST.TOKEN_DISPOSITIONS, string>;

    turnMarkerModes: Record<CONST.TOKEN_TURN_MARKER_MODES, string>;

    turnMarkerAnimations: foundry.data.CombatConfiguration.TurnMarkerAnimationChoice[];
  }

  interface Configuration<PrototypeOverridesConfig extends PrototypeOverridesConfig.Any = PrototypeOverridesConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<PrototypeOverridesConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PrototypeOverridesConfig extends PrototypeOverridesConfig.Any = PrototypeOverridesConfig.Any> =
    DeepPartial<Configuration<PrototypeOverridesConfig>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPrototypeOverridesConfig extends PrototypeOverridesConfig<
  PrototypeOverridesConfig.RenderContext,
  PrototypeOverridesConfig.Configuration,
  PrototypeOverridesConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PrototypeOverridesConfig;
