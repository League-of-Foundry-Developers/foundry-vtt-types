import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Tile document within a parent Scene.
 * @remarks TODO: Stub
 */
declare class TileConfig<
  RenderContext extends TileConfig.RenderContext = TileConfig.RenderContext,
  Configuration extends TileConfig.Configuration = TileConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  TileDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace TileConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<TileDocument.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<TileDocument.Implementation> {}
}

export default TileConfig;
