import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DrawingConfig: DrawingConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Drawing document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class DrawingConfig<
  RenderContext extends DrawingConfig.RenderContext = DrawingConfig.RenderContext,
  Configuration extends DrawingConfig.Configuration = DrawingConfig.Configuration,
  RenderOptions extends DrawingConfig.RenderOptions = DrawingConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  DrawingDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace DrawingConfig {
  interface Any extends AnyDrawingConfig {}
  interface AnyConstructor extends Identity<typeof AnyDrawingConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<DrawingDocument.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<DrawingDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyDrawingConfig extends DrawingConfig<
  DrawingConfig.RenderContext,
  DrawingConfig.Configuration,
  DrawingConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingConfig;
