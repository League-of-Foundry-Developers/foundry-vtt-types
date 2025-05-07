import type { StringField } from "#common/data/fields.mjs";
import type CategoryBrowser from "../../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * @remarks TODO: Stub
 */
declare class DefaultSheetsConfig<
  Entry extends DefaultSheetsConfig.Entry = DefaultSheetsConfig.Entry,
  RenderContext extends DefaultSheetsConfig.RenderContext<Entry> = DefaultSheetsConfig.RenderContext<Entry>,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
}

declare namespace DefaultSheetsConfig {
  interface Entry {
    field: StringField;
    choices: Record<string, string>;
    value: string;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}
}

export default DefaultSheetsConfig;
