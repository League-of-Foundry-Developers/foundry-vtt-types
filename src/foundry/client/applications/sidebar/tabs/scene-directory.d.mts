import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
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
 */
declare class SceneDirectory<
  RenderContext extends SceneDirectory.RenderContext = SceneDirectory.RenderContext,
  Configuration extends SceneDirectory.Configuration = SceneDirectory.Configuration,
  RenderOptions extends SceneDirectory.RenderOptions = SceneDirectory.RenderOptions,
> extends DocumentDirectory<Scene.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: SceneDirectory.DefaultOptions;

  /** @defaultValue `"scenes"` */
  static override tabName: string;

  /** @defaultValue `"templates/sidebar/partials/scene-partial.hbs"` */
  protected static override _entryPartial: string;

  // Fake override.
  override get collection(): foundry.documents.collections.Scenes.Implementation;

  /** @remarks Refuses to render for a non-GM user. */
  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  /**
   * @remarks Replaces ownership configuration with scene-management entries.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /** @remarks Drops the inherited "Configure Ownership" entry. */
  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace SceneDirectory {
  interface Any extends AnySceneDirectory {}
  interface AnyConstructor extends Identity<typeof AnySceneDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    SceneDirectory extends SceneDirectory.Any = SceneDirectory.Any,
  > extends DocumentDirectory.Configuration<SceneDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SceneDirectory extends SceneDirectory.Any = SceneDirectory.Any> = DeepPartial<
    Configuration<SceneDirectory>
  > &
    object;

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
