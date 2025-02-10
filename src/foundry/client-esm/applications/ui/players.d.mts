import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * A UI element which displays the Users defined for this world.
 * Currently active users are always displayed, while inactive users can be displayed on toggle.
 * @remarks TODO: Stub
 */
declare class Players<
  RenderContext extends Players.RenderContext = Players.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace Players {
  interface UserContext {
    id: string;
  }

  interface RenderContext {
    active: UserContext[];
    inactive: UserContext[];
  }
}

export default Players;
