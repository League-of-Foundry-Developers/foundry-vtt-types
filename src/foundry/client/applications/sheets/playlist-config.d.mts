import type { Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistConfig: PlaylistConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Playlist document
 * @remarks TODO: Stub
 */
declare class PlaylistConfig<
  RenderContext extends PlaylistConfig.RenderContext = PlaylistConfig.RenderContext,
  Configuration extends PlaylistConfig.Configuration = PlaylistConfig.Configuration,
  RenderOptions extends PlaylistConfig.RenderOptions = PlaylistConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Playlist.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace PlaylistConfig {
  interface Any extends AnyPlaylistConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Playlist.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Playlist.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyPlaylistConfig extends PlaylistConfig<
  PlaylistConfig.RenderContext,
  PlaylistConfig.Configuration,
  PlaylistConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistConfig;
