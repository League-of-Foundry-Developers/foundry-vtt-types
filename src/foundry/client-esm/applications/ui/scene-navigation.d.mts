import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Scene Navigation UI element.
 * @remarks TODO: Stub
 */
declare class SceneNavigation<
  RenderContext extends SceneNavigation.RenderContext = SceneNavigation.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace SceneNavigation {
  interface PreparedScene {
    id: string;
  }

  interface RenderContext {
    scenes: {
      inactive: PreparedScene[];
      active: PreparedScene[];
    };
    canExpand: number;
  }
}

export default SceneNavigation;
