import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneDirectory: SceneDirectory.Any;
    }
  }
}

/**
 * The World Scene directory listing.
 * @remarks TODO: Stub
 */
declare class SceneDirectory<
  RenderContext extends SceneDirectory.RenderContext = SceneDirectory.RenderContext,
  Configuration extends SceneDirectory.Configuration = SceneDirectory.Configuration,
  RenderOptions extends SceneDirectory.RenderOptions = SceneDirectory.RenderOptions,
> extends DocumentDirectory<Scene.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace SceneDirectory {
  interface Any extends AnySceneDirectory {}
  interface AnyConstructor extends Identity<typeof AnySceneDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnySceneDirectory extends SceneDirectory<
  SceneDirectory.RenderContext,
  SceneDirectory.Configuration,
  SceneDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default SceneDirectory;
