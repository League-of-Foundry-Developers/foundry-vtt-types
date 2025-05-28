import type ApplicationV2 from "#client/applications/api/application.mjs";
import type CategoryBrowser from "../../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * A management app for configuring which Tours are available or have been completed.
 */
declare class ToursManagement<
  Entry extends ToursManagement.Entry = ToursManagement.Entry,
  RenderContext extends ToursManagement.RenderContext<Entry> = ToursManagement.RenderContext<Entry>,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: Partial<ApplicationV2.Configuration>;
  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  #toursManagement: true;
}

declare namespace ToursManagement {
  interface Entry {
    id: string;
    label: string;
    completed: boolean;
    hint: string;
    status: string;
    canPlay?: boolean | undefined;
    startOrResume?: string | undefined;
    canReset?: boolean | undefined;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}
}

export default ToursManagement;
