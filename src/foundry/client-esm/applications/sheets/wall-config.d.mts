import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Wall document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class WallConfig<
  RenderContext extends WallConfig.RenderContext = WallConfig.RenderContext,
  Configuration extends WallConfig.Configuration = WallConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  WallDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace WallConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<WallDocument.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<WallDocument.ConfiguredInstance> {}
}

export default WallConfig;
