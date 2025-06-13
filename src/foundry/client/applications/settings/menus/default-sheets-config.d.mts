import type { StringField } from "#common/data/fields.mjs";
import type { Identity } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DefaultSheetsConfig: DefaultSheetsConfig.Any;
    }
  }
}

/**
 * @remarks TODO: Stub
 */
declare class DefaultSheetsConfig<
  Entry extends DefaultSheetsConfig.Entry = DefaultSheetsConfig.Entry,
  RenderContext extends DefaultSheetsConfig.RenderContext<Entry> = DefaultSheetsConfig.RenderContext<Entry>,
  Configuration extends DefaultSheetsConfig.Configuration = DefaultSheetsConfig.Configuration,
  RenderOptions extends DefaultSheetsConfig.RenderOptions = DefaultSheetsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
}

declare namespace DefaultSheetsConfig {
  interface Any extends AnyDefaultSheetsConfig {}
  interface AnyConstructor extends Identity<typeof AnyDefaultSheetsConfig> {}

  interface Entry {
    field: StringField;
    choices: Record<string, string>;
    value: string;
  }

  interface RenderContext<Entry extends DefaultSheetsConfig.Entry> extends CategoryBrowser.RenderContext<Entry> {}
  interface Configuration extends CategoryBrowser.Configuration {}
  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyDefaultSheetsConfig extends DefaultSheetsConfig<
  DefaultSheetsConfig.Entry,
  DefaultSheetsConfig.RenderContext<DefaultSheetsConfig.Entry>,
  DefaultSheetsConfig.Configuration,
  DefaultSheetsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DefaultSheetsConfig;
