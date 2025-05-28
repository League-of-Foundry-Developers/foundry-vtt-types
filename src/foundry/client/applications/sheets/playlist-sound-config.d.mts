import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Application responsible for configuring a single PlaylistSound document within a parent Playlist.
 * @remarks TODO: Stub
 */
declare class PlaylistSoundConfig<
  RenderContext extends PlaylistSoundConfig.RenderContext = PlaylistSoundConfig.RenderContext,
  Configuration extends PlaylistSoundConfig.Configuration = PlaylistSoundConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Playlist.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace PlaylistSoundConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Playlist.Implementation> {}

  interface Configuration extends DocumentSheetV2.Configuration<Playlist.Implementation> {}
}

export default PlaylistSoundConfig;
