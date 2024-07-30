import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * Scene Region Legend.
 */
export default class RegionLegend<
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
  RenderContext extends Record<string, unknown> = Record<string, never>,
> extends HandlebarsApplicationMixin(ApplicationV2)<Configuration, RenderOptions, RenderContext> {}
