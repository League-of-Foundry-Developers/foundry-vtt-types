import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import World = foundry.packages.World;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WorldConfig: WorldConfig.Any;
    }
  }
}

/**
 * The World Management setup application
 */
declare class WorldConfig<
  RenderContext extends WorldConfig.RenderContext = WorldConfig.RenderContext,
  Configuration extends WorldConfig.Configuration = WorldConfig.Configuration,
  RenderOptions extends WorldConfig.RenderOptions = WorldConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @remarks `world` is deliberately excluded from the `DeepPartial` applied to the rest of the options,
   * mirroring {@linkcode foundry.applications.api.DocumentSheetV2.InputOptions | DocumentSheetV2.InputOptions}.
   * `World` instances are not designed to be deep-partialed, so allowing that recursion to reach into them
   * produces incorrect and extremely expensive-to-check types.
   */
  constructor(options: WorldConfig.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   tag: "form",
   *   id: "world-config",
   *   window: {
   *     icon: "fa-solid fa-globe",
   *     contentClasses: ["standard-form"]
   *   },
   *   position: {
   *     width: 600
   *   },
   *   form: {
   *     handler: WorldConfig.#onSubmit,
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: WorldConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The World being configured.
   */
  world: World;

  override get title(): string;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  #WorldConfig: true;
}

declare namespace WorldConfig {
  interface Any extends AnyWorldConfig {}
  interface AnyConstructor extends Identity<typeof AnyWorldConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    source: World["_source"];
    fields: World["schema"]["fields"];
    rootId: string;
    themes: Record<string, string>;
    worldId: string;
    worldTitle: string;
    worldKbUrl: string;
    nextSession: string;

    /** Whether this World is currently the active, launched World. */
    inWorld: boolean;

    /** Whether fields that are only editable before the World is launched should be shown. */
    showEditFields: boolean;

    /**
     * @remarks A record of system ids to their titles. Only includes every installed system (filtered to those
     * with sufficiently high {@linkcode CONST.PACKAGE_AVAILABILITY_CODES | availability}) when `game.systems` is
     * populated, which fvtt-types
     * doesn't currently model (it's only present in the Setup view, before `game` is fully initialized).
     * Otherwise falls back to a single entry for the currently active system.
     */
    systems: Record<string, string>;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<WorldConfig extends WorldConfig.Any = WorldConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<WorldConfig> {
    /** The World being managed */
    world: World;

    /**
     * Is this World being shown as part of a Tour?
     * @defaultValue `false`
     */
    tour?: boolean | undefined;
  }

  type InputOptions<Configuration extends WorldConfig.Configuration = WorldConfig.Configuration> = DeepPartial<
    Omit<Configuration, "world">
  > & {
    world: Configuration["world"];
  };

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<WorldConfig extends WorldConfig.Any = WorldConfig.Any> = DeepPartial<Configuration<WorldConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyWorldConfig extends WorldConfig<
  WorldConfig.RenderContext,
  WorldConfig.Configuration,
  WorldConfig.RenderOptions
> {
  constructor(...args: never);
}

export default WorldConfig;
