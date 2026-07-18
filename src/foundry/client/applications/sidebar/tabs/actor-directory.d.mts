import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";

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
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /** @defaultValue `"actors"` */
  static override tabName: string;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _canDragStart(selector: string): boolean;

  /**
   * @remarks Foundry's override returns `false` (rather than `undefined`) when the dragged entry
   * is not visible to the current user; the return value is ignored by callers.
   */
  protected override _onDragStart(event: DragEvent): void;
}

declare namespace ActorDirectory {
  interface Any extends AnyActorDirectory {}
  interface AnyConstructor extends Identity<typeof AnyActorDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
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
