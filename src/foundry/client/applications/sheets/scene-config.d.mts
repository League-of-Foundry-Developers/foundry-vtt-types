import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Scene document.
 * @remarks TODO: Stub
 */
declare class SceneConfig<
  RenderContext extends SceneConfig.RenderContext = SceneConfig.RenderContext,
  Configuration extends SceneConfig.Configuration = SceneConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace SceneConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Scene.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Scene.Implementation> {}
}

export default SceneConfig;
