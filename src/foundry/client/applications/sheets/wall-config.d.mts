import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WallConfig: WallConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Wall document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class WallConfig<
  RenderContext extends WallConfig.RenderContext = WallConfig.RenderContext,
  Configuration extends WallConfig.Configuration = WallConfig.Configuration,
  RenderOptions extends WallConfig.RenderOptions = WallConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  WallDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace WallConfig {
  interface Any extends AnyWallConfig {}
  interface AnyConstructor extends Identity<typeof AnyWallConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<WallDocument.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<WallDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyWallConfig extends WallConfig<
  WallConfig.RenderContext,
  WallConfig.Configuration,
  WallConfig.RenderOptions
> {
  constructor(...args: never);
}

export default WallConfig;
