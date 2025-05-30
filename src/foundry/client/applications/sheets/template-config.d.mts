import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MeasuredTemplateConfig: MeasuredTemplateConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class MeasuredTemplateConfig<
  RenderContext extends MeasuredTemplateConfig.RenderContext = MeasuredTemplateConfig.RenderContext,
  Configuration extends MeasuredTemplateConfig.Configuration = MeasuredTemplateConfig.Configuration,
  RenderOptions extends MeasuredTemplateConfig.RenderOptions = MeasuredTemplateConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  MeasuredTemplateDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace MeasuredTemplateConfig {
  interface Any extends AnyMeasuredTemplateConfig {}
  interface AnyConstructor extends Identity<typeof AnyMeasuredTemplateConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<MeasuredTemplateDocument.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<MeasuredTemplateDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyMeasuredTemplateConfig extends MeasuredTemplateConfig<
  MeasuredTemplateConfig.RenderContext,
  MeasuredTemplateConfig.Configuration,
  MeasuredTemplateConfig.RenderOptions
> {
  constructor(...args: never);
}
export default MeasuredTemplateConfig;
