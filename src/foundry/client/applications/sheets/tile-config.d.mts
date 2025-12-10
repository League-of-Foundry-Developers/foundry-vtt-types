import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TileConfig: TileConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Tile document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class TileConfig<
  RenderContext extends TileConfig.RenderContext = TileConfig.RenderContext,
  Configuration extends TileConfig.Configuration = TileConfig.Configuration,
  RenderOptions extends TileConfig.RenderOptions = TileConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  TileDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TileConfig {
  interface Any extends AnyTileConfig {}
  interface AnyConstructor extends Identity<typeof AnyTileConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<TileDocument.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<TileDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyTileConfig extends TileConfig<
  TileConfig.RenderContext,
  TileConfig.Configuration,
  TileConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TileConfig;
