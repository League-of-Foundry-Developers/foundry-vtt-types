import type ApplicationV2 from "../api/application.d.mts";
import type CategoryBrowser from "../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for displaying and editing the client and world settings for this world.
 * This form renders the settings defined via the game.settings.register API which have config = true
 * @privateRemarks TODO: Stub
 */
declare class SettingsConfig<
  RenderContext extends SettingsConfig.RenderContext = SettingsConfig.RenderContext,
  Configuration extends CategoryBrowser.Configuration = CategoryBrowser.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends CategoryBrowser<RenderContext, Configuration, RenderOptions> {}

declare namespace SettingsConfig {
  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default SettingsConfig;
