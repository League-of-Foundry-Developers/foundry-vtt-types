import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class MeasuredTemplateConfig<
  RenderContext extends MeasuredTemplateConfig.RenderContext = MeasuredTemplateConfig.RenderContext,
  Configuration extends MeasuredTemplateConfig.Configuration = MeasuredTemplateConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  MeasuredTemplateDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace MeasuredTemplateConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<MeasuredTemplateDocument.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<MeasuredTemplateDocument.ConfiguredInstance> {}
}

export default MeasuredTemplateConfig;
