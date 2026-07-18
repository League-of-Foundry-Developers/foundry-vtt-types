import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";

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
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /** @defaultValue `"tables"` */
  static override tabName: string;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace RollTableDirectory {
  interface Any extends AnyRollTableDirectory {}
  interface AnyConstructor extends Identity<typeof AnyRollTableDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
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
