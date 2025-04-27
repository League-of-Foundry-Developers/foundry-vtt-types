import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Scene directory listing.
 * @remarks TODO: Stub
 */
declare class SceneDirectory<
  RenderContext extends SceneDirectory.RenderContext = SceneDirectory.RenderContext,
  Configuration extends SceneDirectory.Configuration = SceneDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<Scene.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace SceneDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default SceneDirectory;
