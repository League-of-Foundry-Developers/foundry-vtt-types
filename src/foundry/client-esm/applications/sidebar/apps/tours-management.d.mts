import type CategoryBrowser from "../../api/category-browser.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * A management app for configuring which Tours are available or have been completed.
 * @remarks TODO: Stub
 */
declare class ToursManagement<
  RenderContext extends ToursManagement.RenderContext = ToursManagement.RenderContext,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<RenderContext, Configuration, RenderOptions> {}

declare namespace ToursManagement {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default ToursManagement;
