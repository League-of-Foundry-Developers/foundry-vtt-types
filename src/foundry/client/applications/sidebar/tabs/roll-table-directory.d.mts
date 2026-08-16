import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollTableDirectory: RollTableDirectory.Any;
    }
  }
}

/**
 * The World RollTable directory listing.
 */
declare class RollTableDirectory<
  RenderContext extends RollTableDirectory.RenderContext = RollTableDirectory.RenderContext,
  Configuration extends RollTableDirectory.Configuration = RollTableDirectory.Configuration,
  RenderOptions extends RollTableDirectory.RenderOptions = RollTableDirectory.RenderOptions,
> extends DocumentDirectory<RollTable.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   collection: "RollTable"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: RollTableDirectory.DefaultOptions;

  /** @defaultValue `"tables"` */
  static override tabName: string;

  // Fake override.
  override get collection(): foundry.documents.collections.RollTables.Implementation;

  /**
   * @remarks Prepends an entry that draws from the table and posts to chat.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace RollTableDirectory {
  interface Any extends AnyRollTableDirectory {}
  interface AnyConstructor extends Identity<typeof AnyRollTableDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    RollTableDirectory extends RollTableDirectory.Any = RollTableDirectory.Any,
  > extends DocumentDirectory.Configuration<RollTableDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<RollTableDirectory extends RollTableDirectory.Any = RollTableDirectory.Any> = DeepPartial<
    Configuration<RollTableDirectory>
  > &
    object;

  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyRollTableDirectory extends RollTableDirectory<
  RollTableDirectory.RenderContext,
  RollTableDirectory.Configuration,
  RollTableDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default RollTableDirectory;
