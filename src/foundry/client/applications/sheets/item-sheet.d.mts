import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type DragDrop from "../ux/drag-drop.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ItemSheetV2: ItemSheetV2.Any;
    }
  }
}

/**
 * A base class for providing Item Sheet behavior using ApplicationV2.
 */
declare class ItemSheetV2<
  RenderContext extends ItemSheetV2.RenderContext = ItemSheetV2.RenderContext,
  Configuration extends ItemSheetV2.Configuration = ItemSheetV2.Configuration,
  RenderOptions extends ItemSheetV2.RenderOptions = ItemSheetV2.RenderOptions,
> extends DocumentSheetV2<Item.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: ItemSheetV2.DefaultOptions;

  /**
   * The Item document managed by this sheet.
   */
  get item(): this["document"];

  /**
   * The Actor instance which owns this Item, if any.
   */
  get actor(): this["document"]["actor"];

  /**
   * Return a cached copy of a DragDrop instance, creating one on first access.
   */
  protected get _dragDrop(): DragDrop.Implementation;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector.
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector.
   * @param selector - The candidate HTML selector for the drop target
   * @returns Can the current user drop on this selector?
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * An event that occurs when a drag workflow begins for a draggable ActiveEffect on the sheet.
   * @param event - The initiating drag start event
   */
  protected _onDragStart(event: DragEvent): Promise<void>;

  /**
   * An event that occurs when a drag workflow moves over a drop target.
   */
  protected _onDragOver(event: DragEvent): void;

  /**
   * An event that occurs when data is dropped into a drop target.
   */
  protected _onDrop(event: DragEvent): Promise<void>;

  /**
   * Handle a dropped document on the ItemSheet
   * @param event    - The initiating drop event
   * @param document - The resolved Document class
   * @returns A Document of the same type as the dropped one in case of a successful result, or null in case of failure or no action being taken
   */
  protected _onDropDocument<ConcreteDocument extends ItemSheetV2.DroppableDocument>(
    event: DragEvent,
    document: ConcreteDocument,
  ): Promise<ConcreteDocument | null>;

  /**
   * Handle a dropped Active Effect on the Item Sheet.
   * The default implementation creates an Active Effect embedded document on the Item.
   * @param event  - The initiating drop event
   * @param effect - The dropped ActiveEffect document
   * @returns A Promise resolving to a newly created ActiveEffect, if one was created, or otherwise a nullish value
   */
  protected _onDropActiveEffect(
    event: DragEvent,
    effect: ActiveEffect.Implementation,
  ): Promise<ActiveEffect.Implementation | null>;

  #ItemSheetV2: true;
}

declare namespace ItemSheetV2 {
  interface Any extends AnyItemSheetV2 {}
  interface AnyConstructor extends Identity<typeof AnyItemSheetV2> {}

  interface RenderContext extends DocumentSheetV2.RenderContext<Item.Implementation> {}

  interface Configuration<ItemSheetV2 extends ItemSheetV2.Any = ItemSheetV2.Any> extends DocumentSheetV2.Configuration<
    Item.Implementation,
    ItemSheetV2
  > {}

  type DefaultOptions<ItemSheetV2 extends ItemSheetV2.Any = ItemSheetV2.Any> =
    DocumentSheetV2.DefaultOptions<ItemSheetV2>;

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}

  type DroppableDocument = ActiveEffect.Implementation;
}

declare abstract class AnyItemSheetV2 extends ItemSheetV2<
  ItemSheetV2.RenderContext,
  ItemSheetV2.Configuration,
  ItemSheetV2.RenderOptions
> {
  constructor(...args: never);
}

export default ItemSheetV2;
