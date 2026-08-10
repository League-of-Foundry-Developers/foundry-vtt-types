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
   * @param options - Application configuration options
   */
  constructor(options: WorldConfig.InputOptions<Configuration>);

  // Fake override.
  static override DEFAULT_OPTIONS: WorldConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The World being configured.
   */
  world: World;

  override get title(): string;

  /** @remarks Keeps the world ID field's placeholder in step with a slugified version of the title. */
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  #WorldConfig: true;

  static #WorldConfigStatic: true;
}

declare namespace WorldConfig {
  interface Any extends AnyWorldConfig {}
  interface AnyConstructor extends Identity<typeof AnyWorldConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    source: World.Source;

    fields: World.Schema;

    rootId: string;

    /** The available join-screen themes, keyed by theme name and localized. */
    themes: Record<string, string>;

    worldId: string;

    worldTitle: string;

    /** The website knowledge base URL. */
    worldKbUrl: string;

    /**
     * The world's next session, formatted for a `datetime-local` input.
     *
     * @remarks Empty when the world has no next session, or when the stored value does not parse.
     */
    nextSession: string;

    /** Whether a world is already active, in which case the identity fields are shown read-only. */
    inWorld: boolean;

    buttons: ApplicationV2.FormFooterButton[];

    showEditFields: boolean;

    /**
     * The systems this world may be assigned to, keyed by system ID.
     *
     * @remarks Restricted to the world's current system and those verified for this generation. Falls back to
     * the active system alone when the setup-time system list is unavailable.
     */
    systems: Record<string, string>;
  }

  interface Configuration<WorldConfig extends WorldConfig.Any = WorldConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<WorldConfig> {
    /** The World being managed */
    world: World;

    /** Is this World being shown as part of a Tour? */
    tour?: boolean | undefined;
  }

  type InputOptions<Configuration extends WorldConfig.Configuration> = DeepPartial<Omit<Configuration, "world">> & {
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
