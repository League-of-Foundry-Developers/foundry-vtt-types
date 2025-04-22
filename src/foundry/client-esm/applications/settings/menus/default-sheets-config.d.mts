import type CategoryBrowser from "../../api/category-browser.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * @remarks TODO: Stub
 */
declare class DefaultSheetsConfig<
  RenderContext extends DefaultSheetsConfig.RenderContext = DefaultSheetsConfig.RenderContext,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<RenderContext, Configuration, RenderOptions> {}

declare namespace DefaultSheetsConfig {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default DefaultSheetsConfig;
