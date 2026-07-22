import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { PrototypeTokenOverrides } from "#common/data/data.mjs";
import type { fields } from "#common/data/_module.d.mts";

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

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** Register this menu application and the setting it manages. */
  static registerSettings(): void;

  /**
   * @defaultValue
   * ```js
   * {
   *   main: "base",
   *   ...Object.fromEntries(Actor.TYPES.map(type => [type, "basics"]))
   * }
   * ```
   */
  override tabGroups: Record<string, string>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _preFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  #PrototypeOverridesConfig: true;
}

declare namespace PrototypeOverridesConfig {
  interface Any extends AnyPrototypeOverridesConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeOverridesConfig> {}

  interface SubtabData extends ApplicationV2.Tab {}

  interface TabData extends ApplicationV2.Tab {
    fields: PrototypeTokenOverrides.ActorSubTypeSchema;
    data: fields.SchemaField.InitializedData<PrototypeTokenOverrides.ActorSubTypeSchema>;
    subtabs: Record<"basics" | "marker", SubtabData>;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    tabs: Record<Actor.SubType, TabData>;
    tabClasses: string;
    rootId: string;
    buttons: ApplicationV2.FormFooterButton[];
    booleanOptions: { true: string; false: string };
    displayModes: Record<CONST.TOKEN_DISPLAY_MODES, string>;
    dispositions: Record<CONST.TOKEN_DISPOSITIONS, string>;
    turnMarkerModes: Record<CONST.TOKEN_TURN_MARKER_MODES, string>;
    turnMarkerAnimations: foundry.data.CombatConfiguration["turnMarkerAnimations"];
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
