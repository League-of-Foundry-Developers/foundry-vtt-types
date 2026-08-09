import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

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
  // Fake override.
  static override DEFAULT_OPTIONS: ItemDirectory.DefaultOptions;

  /** @defaultValue `"items"` */
  static override tabName: string;

  // Fake override.
  override get collection(): foundry.documents.collections.Items.Implementation;

  /**
   * @remarks Inserts an artwork entry after "Configure Ownership", shown only when the item's image differs from
   * the default its type would produce.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace ItemDirectory {
  interface Any extends AnyItemDirectory {}
  interface AnyConstructor extends Identity<typeof AnyItemDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    ItemDirectory extends ItemDirectory.Any = ItemDirectory.Any,
  > extends DocumentDirectory.Configuration<ItemDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ItemDirectory extends ItemDirectory.Any = ItemDirectory.Any> = DeepPartial<
    Configuration<ItemDirectory>
  > &
    object;

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
