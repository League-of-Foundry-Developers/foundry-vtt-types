import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Scene Controls UI element.
 * @remarks TODO: Stub
 */
declare class SceneControls<
  RenderContext extends SceneControls.RenderContext = SceneControls.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends SceneControls.RenderOptions = SceneControls.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace SceneControls {
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

export default SceneControls;
