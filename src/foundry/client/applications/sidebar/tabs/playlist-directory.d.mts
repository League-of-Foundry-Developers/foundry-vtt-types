import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Playlist directory listing.
 * @remarks TODO: Stub
 */
declare class PlaylistDirectory<
  RenderContext extends PlaylistDirectory.RenderContext = PlaylistDirectory.RenderContext,
  Configuration extends PlaylistDirectory.Configuration = PlaylistDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<Playlist.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace PlaylistDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default PlaylistDirectory;
