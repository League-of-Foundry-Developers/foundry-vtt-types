import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * A class responsible for prompting the user about dependency resolution for their modules.
 * @remarks TODO: Stub
 */
declare class DependencyResolution<
  RenderContext extends DependencyResolution.RenderContext = DependencyResolution.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace DependencyResolution {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default DependencyResolution;
