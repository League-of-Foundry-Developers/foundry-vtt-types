import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ItemDirectory: ItemDirectory.Any;
    }
  }
}

/**
 * The World Item directory listing.
 */
declare class ItemDirectory<
  RenderContext extends ItemDirectory.RenderContext = ItemDirectory.RenderContext,
  Configuration extends ItemDirectory.Configuration = ItemDirectory.Configuration,
  RenderOptions extends ItemDirectory.RenderOptions = ItemDirectory.RenderOptions,
> extends DocumentDirectory<Item.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   collection: "Item"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /** @defaultValue `"items"` */
  static override tabName: string;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace ItemDirectory {
  interface Any extends AnyItemDirectory {}
  interface AnyConstructor extends Identity<typeof AnyItemDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyItemDirectory extends ItemDirectory<
  ItemDirectory.RenderContext,
  ItemDirectory.Configuration,
  ItemDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default ItemDirectory;
