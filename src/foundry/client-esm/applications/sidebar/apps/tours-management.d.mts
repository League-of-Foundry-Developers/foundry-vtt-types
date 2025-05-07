import type CategoryBrowser from "../../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * A management app for configuring which Tours are available or have been completed.
 * @remarks TODO: Stub
 */
declare class ToursManagement<
  Entry extends ToursManagement.Entry = ToursManagement.Entry,
  RenderContext extends ToursManagement.RenderContext<Entry> = ToursManagement.RenderContext<Entry>,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  protected _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
}

declare namespace ToursManagement {
  interface Entry {
    id: string;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}
}

export default ToursManagement;
