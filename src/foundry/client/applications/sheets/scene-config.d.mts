import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneConfig: SceneConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Scene document.
 * @remarks TODO: Stub
 */
declare class SceneConfig<
  RenderContext extends SceneConfig.RenderContext = SceneConfig.RenderContext,
  Configuration extends SceneConfig.Configuration = SceneConfig.Configuration,
  RenderOptions extends SceneConfig.RenderOptions = SceneConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace SceneConfig {
  interface Any extends AnySceneConfig {}
  interface AnyConstructor extends Identity<typeof AnySceneConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Scene.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<Scene.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnySceneConfig extends SceneConfig<
  SceneConfig.RenderContext,
  SceneConfig.Configuration,
  SceneConfig.RenderOptions
> {
  constructor(...args: never);
}

export default SceneConfig;
