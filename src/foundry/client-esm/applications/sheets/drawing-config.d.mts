import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Drawing document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class DrawingConfig<
  RenderContext extends DrawingConfig.RenderContext = DrawingConfig.RenderContext,
  Configuration extends DrawingConfig.Configuration = DrawingConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  DrawingDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace DrawingConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<DrawingDocument.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<DrawingDocument.ConfiguredInstance> {}
}

export default DrawingConfig;
