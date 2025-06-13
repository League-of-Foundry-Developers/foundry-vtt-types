import type { Identity } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ToursManagement: ToursManagement.Any;
    }
  }
}

/**
 * A management app for configuring which Tours are available or have been completed.
 */
declare class ToursManagement<
  Entry extends ToursManagement.Entry = ToursManagement.Entry,
  RenderContext extends ToursManagement.RenderContext<Entry> = ToursManagement.RenderContext<Entry>,
  Configuration extends ToursManagement.Configuration = ToursManagement.Configuration,
  RenderOptions extends ToursManagement.RenderOptions = ToursManagement.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: Partial<CategoryBrowser.Configuration>;
  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  #toursManagement: true;
}

declare namespace ToursManagement {
  interface Any extends AnyToursManagement {}
  interface AnyConstructor extends Identity<typeof AnyToursManagement> {}

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

  interface Configuration extends CategoryBrowser.Configuration {}
  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyToursManagement extends ToursManagement<
  ToursManagement.Entry,
  ToursManagement.RenderContext<ToursManagement.Entry>,
  ToursManagement.Configuration,
  ToursManagement.RenderOptions
> {
  constructor(...args: never);
}

export default ToursManagement;
