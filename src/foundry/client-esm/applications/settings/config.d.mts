import type CategoryBrowser from "../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for displaying and editing the client and world settings for this world.
 * This form renders the settings defined via the game.settings.register API which have config = true
 * @privateRemarks TODO: Stub
 */
declare class SettingsConfig<
  Entry extends SettingsConfig.Entry = SettingsConfig.Entry,
  RenderContext extends SettingsConfig.RenderContext<Entry> = SettingsConfig.RenderContext<Entry>,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  protected _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
}

declare namespace SettingsConfig {
  interface MenuEntry {
    menu: true;
    buttonText: string;
    hint: string;
    icon: string;
    key: string;
    label: string;
  }

  interface SettingEntry {
    menu: false;
    field: foundry.data.fields.DataField.Any;
    label: string | undefined;
    value: unknown;
  }

  type Entry = MenuEntry | SettingEntry;

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}
}

export default SettingsConfig;
