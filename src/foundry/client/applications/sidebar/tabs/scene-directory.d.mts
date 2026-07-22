import type { DeepPartial, Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneDirectory: SceneDirectory.Any;
    }
  }
}

/**
 * The World Scene directory listing.
 */
declare class SceneDirectory<
  RenderContext extends SceneDirectory.RenderContext = SceneDirectory.RenderContext,
  Configuration extends SceneDirectory.Configuration = SceneDirectory.Configuration,
  RenderOptions extends SceneDirectory.RenderOptions = SceneDirectory.RenderOptions,
> extends DocumentDirectory<Scene.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   renderUpdateKeys: ["background", "thumb"],
   *   collection: "Scene"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /** @defaultValue `"scenes"` */
  static override tabName: string;

  /** @defaultValue `"templates/sidebar/partials/scene-partial.hbs"` */
  protected static override _entryPartial: string;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

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
