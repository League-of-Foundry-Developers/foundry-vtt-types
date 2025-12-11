import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistSoundConfig: PlaylistSoundConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single PlaylistSound document within a parent Playlist.
 * @remarks TODO: Stub
 */
declare class PlaylistSoundConfig<
  RenderContext extends PlaylistSoundConfig.RenderContext = PlaylistSoundConfig.RenderContext,
  Configuration extends PlaylistSoundConfig.Configuration = PlaylistSoundConfig.Configuration,
  RenderOptions extends PlaylistSoundConfig.RenderOptions = PlaylistSoundConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Playlist.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace PlaylistSoundConfig {
  interface Any extends AnyPlaylistSoundConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistSoundConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Playlist.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Playlist.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyPlaylistSoundConfig extends PlaylistSoundConfig<
  PlaylistSoundConfig.RenderContext,
  PlaylistSoundConfig.Configuration,
  PlaylistSoundConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistSoundConfig;
