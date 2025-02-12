import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Actor directory listing.
 * @remarks TODO: Stub
 */
declare class ActorDirectory<
  RenderContext extends ActorDirectory.RenderContext = ActorDirectory.RenderContext,
  Configuration extends ActorDirectory.Configuration = ActorDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<Actor.ConfiguredClass, RenderContext, Configuration, RenderOptions> {}

declare namespace ActorDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default ActorDirectory;
