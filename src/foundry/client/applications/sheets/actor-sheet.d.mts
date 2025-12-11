import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActorSheetV2: ActorSheetV2.Any;
    }
  }
}

/**
 * A base class for providing Actor Sheet behavior using ApplicationV2.
 */
declare class ActorSheetV2<
  RenderContext extends ActorSheetV2.RenderContext = ActorSheetV2.RenderContext,
  Configuration extends ActorSheetV2.Configuration = ActorSheetV2.Configuration,
  RenderOptions extends ActorSheetV2.RenderOptions = ActorSheetV2.RenderOptions,
> extends DocumentSheetV2<Actor.Implementation, RenderContext, Configuration, RenderOptions> {
  static DEFAULT_OPTIONS: ActorSheetV2.DefaultOptions;

  /**
   * The Actor document managed by this sheet.
   */
  get actor(): this["document"];

  /**
   * If this sheet manages the ActorDelta of an unlinked Token, reference that Token document.
   */
  get token(): this["document"]["token"];

  protected override _getHeaderControls(): ApplicationV2.HeaderControlsEntry[];

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
   * An event that occurs when a drag workflow begins for a draggable item on the sheet.
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
   * Handle a dropped document on the ActorSheet
   * @param event    - The initiating drop event
   * @param document - The resolved Document class
   * @returns A Document of the same type as the dropped one in case of a successful result, or null in case of failure or no action being taken
   */
  protected _onDropDocument<ConcreteDocument extends ActorSheetV2.DroppableDocument>(
    event: DragEvent,
    document: ConcreteDocument,
  ): Promise<ConcreteDocument | null>;

  /**
   * Handle a dropped Active Effect on the Actor Sheet.
   * The default implementation creates an Active Effect embedded document on the Actor.
   * @param event  - The initiating drop event
   * @param effect - The dropped ActiveEffect document
   * @returns A Promise resolving to a newly created ActiveEffect, if one was created, or otherwise a nullish value
   */
  protected _onDropActiveEffect(
    event: DragEvent,
    effect: ActiveEffect.Implementation,
  ): Promise<ActiveEffect.Implementation | null>;

  /**
   * Handle a dropped Actor on the Actor Sheet.
   * @param event - The initiating drop event
   * @param actor - The dropped Actor document
   * @returns A Promise resolving to an Actor identical or related to the dropped Actor to indicate success, or a nullish value to indicate failure or no action being taken
   */
  protected _onDropActor(event: DragEvent, actor: Actor.Implementation): Promise<Actor.Implementation | null>;

  /**
   * Handle a dropped Item on the Actor Sheet.
   * @param event - The initiating drop event
   * @param item  - The dropped Item document
   * @returns A Promise resolving to the dropped Item (if sorting), a newly created Item, or a nullish value in case of failure or no action being taken
   */
  protected _onDropItem(event: DragEvent, item: Item.Implementation): Promise<Item.Implementation | null>;

  /**
   * Handle a dropped Folder on the Actor Sheet.
   * @param event  - The initiating drop event
   * @param folder - The dropped Folder document
   * @returns A Promise resolving to the dropped Folder indicate success, or a nullish value to indicate failure or no action being taken
   */
  protected _onDropFolder(event: DragEvent, folder: Folder.Implementation): Promise<Folder.Implementation | null>;

  /**
   * Handle a drop event for an existing embedded Item to sort that Item relative to its siblings.
   * @param event - The initiating drop event
   * @param item  - The dropped Item document
   */
  protected _onSortItem(event: DragEvent, item: Item.Implementation): Promise<Item.Implementation[]> | void;

  static #ActorSheetV2;
}

declare namespace ActorSheetV2 {
  interface Any extends AnyActorSheetV2 {}
  interface AnyConstructor extends Identity<typeof AnyActorSheetV2> {}

  interface RenderContext extends DocumentSheetV2.RenderContext<Actor.Implementation> {}

  interface Configuration<
    ActorSheetV2 extends ActorSheetV2.Any = ActorSheetV2.Any,
  > extends DocumentSheetV2.Configuration<Actor.Implementation, ActorSheetV2> {}

  type DefaultOptions<ActorSheetV2 extends ActorSheetV2.Any = ActorSheetV2.Any> =
    DocumentSheetV2.DefaultOptions<ActorSheetV2>;

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}

  type DroppableDocument =
    | ActiveEffect.Implementation
    | Actor.Implementation
    | Item.Implementation
    | Folder.Implementation;
}

declare abstract class AnyActorSheetV2 extends ActorSheetV2<
  ActorSheetV2.RenderContext,
  ActorSheetV2.Configuration,
  ActorSheetV2.RenderOptions
> {
  constructor(...args: never);
}

export default ActorSheetV2;
