import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistDirectory: PlaylistDirectory.Any;
    }
  }
}

/**
 * The World Playlist directory listing.
 * @remarks TODO: Stub
 */
declare class PlaylistDirectory<
  RenderContext extends PlaylistDirectory.RenderContext = PlaylistDirectory.RenderContext,
  Configuration extends PlaylistDirectory.Configuration = PlaylistDirectory.Configuration,
  RenderOptions extends PlaylistDirectory.RenderOptions = PlaylistDirectory.RenderOptions,
> extends DocumentDirectory<Playlist.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace PlaylistDirectory {
  interface Any extends AnyPlaylistDirectory {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyPlaylistDirectory extends PlaylistDirectory<
  PlaylistDirectory.RenderContext,
  PlaylistDirectory.Configuration,
  PlaylistDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistDirectory;
