import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      GridConfig: GridConfig.Any;
    }
  }
}

/**
 * A tool for fine-tuning the grid in a Scene
 * @remarks TODO: Stub
 */
declare class GridConfig<
  RenderContext extends GridConfig.RenderContext = GridConfig.RenderContext,
  Configuration extends GridConfig.Configuration = GridConfig.Configuration,
  RenderOptions extends GridConfig.RenderOptions = GridConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace GridConfig {
  interface Any extends AnyGridConfig {}
  interface AnyConstructor extends Identity<typeof AnyGridConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Scene.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Scene.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyGridConfig extends GridConfig<
  GridConfig.RenderContext,
  GridConfig.Configuration,
  GridConfig.RenderOptions
> {
  constructor(...args: never);
}

export default GridConfig;
