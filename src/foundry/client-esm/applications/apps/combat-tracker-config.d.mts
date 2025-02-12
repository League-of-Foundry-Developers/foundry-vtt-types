import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring the CombatTracker and its contents.
 * @remarks TODO: Stub
 */
declare class CombatTrackerConfig<
  RenderContext extends CombatTrackerConfig.RenderContext = CombatTrackerConfig.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace CombatTrackerConfig {
  interface RenderContext {
    rootId: string;
  }
}

export default CombatTrackerConfig;
