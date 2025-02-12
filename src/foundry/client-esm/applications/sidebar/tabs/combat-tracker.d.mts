import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

/**
 * An Application that manages switching between Combats and tracking the Combatants in those Combats.
 * @remarks TODO: Stub
 */
declare class CombatTracker<
  RenderContext extends CombatTracker.RenderContext = CombatTracker.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {}

declare namespace CombatTracker {
  interface RenderContext extends AbstractSidebarTab.RenderContext {}
}

export default CombatTracker;
