/* eslint-disable @typescript-eslint/no-deprecated */
import type { GetDataReturnType, Identity, MaybePromise } from "#utils";
import type { DocumentSheet } from "../api/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      ItemSheet: ItemSheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single Item document.
 * @deprecated "The V1 Application framework is deprecated, and will be removed in a later core software version.
 * Please use the V2 version of the Application framework available under
 * {@linkcode foundry.applications.api.ApplicationV2}." (since v13, until v16)
 *
 * @param item    - The Item instance being displayed within the sheet.
 * @param options - Additional application configuration options.
 *
 * @template Options - the type of the options object
 */
declare class ItemSheet<Options extends ItemSheet.Options = ItemSheet.Options> extends DocumentSheet<
  Item.Implementation,
  Options
> {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/sheets/item-sheet.html",
   *   width: 500,
   *   closeOnSubmit: false,
   *   submitOnClose: true,
   *   submitOnChange: true,
   *   resizable: true,
   *   baseApplication: "ItemSheet",
   *   id: "item",
   *   secrets: [{parentSelector: ".editor"}]
   * })
   * ```
   */
  static get defaultOptions(): ItemSheet.Options;

  override get title(): string;

  /**
   * A convenience reference to the Item document
   */
  get item(): this["object"];

  /**
   * The Actor instance which owns this item. This may be null if the item is
   * unowned.
   */
  get actor(): this["item"]["actor"];

  override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<ItemSheet.Data>>;
}

declare namespace ItemSheet {
  interface Any extends AnyItemSheet {}
  interface AnyConstructor extends Identity<typeof AnyItemSheet> {}

  interface Options extends DocumentSheet.Options<Item.Implementation> {}

  interface Data<Options extends ItemSheet.Options = ItemSheet.Options> extends DocumentSheet.Data<
    Options,
    Item.Implementation
  > {
    item: this["document"];
  }

  /**
   * @deprecated Replaced with {@linkcode ItemSheet.Data}.
   */
  type ItemSheetData = Data;
}

declare abstract class AnyItemSheet extends ItemSheet<ItemSheet.Options> {
  constructor(...args: never);
}

export default ItemSheet;
