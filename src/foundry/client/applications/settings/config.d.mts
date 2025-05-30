import type { Identity } from "#utils";
import type CategoryBrowser from "../api/category-browser.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SettingsConfig: SettingsConfig.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing the client and world settings for this world.
 * This form renders the settings defined via the game.settings.register API which have config = true
 * @privateRemarks TODO: Stub
 */
declare class SettingsConfig<
  Entry extends SettingsConfig.Entry = SettingsConfig.Entry,
  RenderContext extends SettingsConfig.RenderContext<Entry> = SettingsConfig.RenderContext<Entry>,
  Configuration extends SettingsConfig.Configuration = SettingsConfig.Configuration,
  RenderOptions extends SettingsConfig.RenderOptions = SettingsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  protected _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
}

declare namespace SettingsConfig {
  interface Any extends AnySettingsConfig {}
  interface AnyConstructor extends Identity<typeof AnySettingsConfig> {}

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

  interface RenderContext<Entry extends SettingsConfig.Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}
  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnySettingsConfig extends SettingsConfig<
  SettingsConfig.Entry,
  SettingsConfig.RenderContext<SettingsConfig.Entry>,
  SettingsConfig.Configuration,
  SettingsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default SettingsConfig;
