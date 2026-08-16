import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActorDirectory: ActorDirectory.Any;
    }
  }
}

/**
 * The World Actor directory listing.
 */
declare class ActorDirectory<
  RenderContext extends ActorDirectory.RenderContext = ActorDirectory.RenderContext,
  Configuration extends ActorDirectory.Configuration = ActorDirectory.Configuration,
  RenderOptions extends ActorDirectory.RenderOptions = ActorDirectory.RenderOptions,
> extends DocumentDirectory<Actor.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   collection: "Actor"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ActorDirectory.DefaultOptions;

  /** @defaultValue `"actors"` */
  static override tabName: string;

  // Fake override.
  override get collection(): foundry.documents.collections.Actors.Implementation;

  /**
   * @remarks Adds non-default character and token artwork entries; randomized tokens omit the latter.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /** @remarks Ignores `selector`: any drag is permitted for a user who can create tokens. */
  protected override _canDragStart(selector: string): boolean;

  /**
   * @remarks Visible actors use a drag image scaled to their prototype token's canvas footprint.
   */
  protected override _onDragStart(event: DragEvent): void;
}

declare namespace ActorDirectory {
  interface Any extends AnyActorDirectory {}
  interface AnyConstructor extends Identity<typeof AnyActorDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    ActorDirectory extends ActorDirectory.Any = ActorDirectory.Any,
  > extends DocumentDirectory.Configuration<ActorDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ActorDirectory extends ActorDirectory.Any = ActorDirectory.Any> = DeepPartial<
    Configuration<ActorDirectory>
  > &
    object;

  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyActorDirectory extends ActorDirectory<
  ActorDirectory.RenderContext,
  ActorDirectory.Configuration,
  ActorDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default ActorDirectory;
