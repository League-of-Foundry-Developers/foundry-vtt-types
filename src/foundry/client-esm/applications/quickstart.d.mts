import type ApplicationV2 from "./api/application.d.mts";
import type HandlebarsApplicationMixin from "./api/handlebars-application.d.mts";

/**
 * Application documentation here.
 *
 * @remarks This is not actually *imported* anywhere it can be used, it appears to be for internal FVTT use only.
 */
declare class AppV2QuickStartTemplate<
  RenderContext extends AppV2QuickStartTemplate.RenderContext = AppV2QuickStartTemplate.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace AppV2QuickStartTemplate {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default AppV2QuickStartTemplate;
