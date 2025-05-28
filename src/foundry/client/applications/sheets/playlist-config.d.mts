import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single Playlist document
 * @remarks TODO: Stub
 */
declare class PlaylistConfig<
  RenderContext extends PlaylistConfig.RenderContext = PlaylistConfig.RenderContext,
  Configuration extends PlaylistConfig.Configuration = PlaylistConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Playlist.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace PlaylistConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Playlist.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Playlist.Implementation> {}
}

export default PlaylistConfig;
