import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CombatTrackerConfig: CombatTrackerConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring the CombatTracker and its contents.
 * @remarks TODO: Stub
 */
declare class CombatTrackerConfig<
  RenderContext extends CombatTrackerConfig.RenderContext = CombatTrackerConfig.RenderContext,
  Configuration extends CombatTrackerConfig.Configuration = CombatTrackerConfig.Configuration,
  RenderOptions extends CombatTrackerConfig.RenderOptions = CombatTrackerConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace CombatTrackerConfig {
  interface Any extends AnyCombatTrackerConfig {}
  interface AnyConstructor extends Identity<typeof AnyCombatTrackerConfig> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    rootId: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyCombatTrackerConfig extends CombatTrackerConfig<
  CombatTrackerConfig.RenderContext,
  CombatTrackerConfig.Configuration,
  CombatTrackerConfig.RenderOptions
> {}

export default CombatTrackerConfig;
