import type { Identity } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ControlsConfig: ControlsConfig.Any;
    }
  }
}

/**
 * View and edit keybinding and (readonly) mouse actions.
 * @remarks TODO: Stub
 */
declare class ControlsConfig<
  Entry extends ControlsConfig.Entry = ControlsConfig.Entry,
  RenderContext extends ControlsConfig.RenderContext<Entry> = ControlsConfig.RenderContext<Entry>,
  Configuration extends ControlsConfig.Configuration = ControlsConfig.Configuration,
  RenderOptions extends ControlsConfig.RenderOptions = ControlsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  protected _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;
}

declare namespace ControlsConfig {
  interface Any extends AnyControlsConfig {}
  interface AnyConstructor extends Identity<typeof AnyControlsConfig> {}

  // TODO: Interface is a stub
  interface Entry {
    id: string;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}
  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyControlsConfig extends ControlsConfig<
  ControlsConfig.Entry,
  ControlsConfig.RenderContext<ControlsConfig.Entry>,
  ControlsConfig.Configuration,
  ControlsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ControlsConfig;
