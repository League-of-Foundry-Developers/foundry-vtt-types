/**
 * The Actor configuration sheet.
 *
 * This Application is responsible for rendering an actor's attributes and allowing the actor to be edited.
 *
 * System modifications may elect to override this class to better suit their own game system by re-defining the value
 * CONFIG.Actor.sheetClass.
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the Entity which should be managed by this form sheet
 * @typeParam P - the type of the options object
 */
declare class ActorSheet<
  D extends object = ActorSheet.Data<Actor>,
  O extends Actor = D extends ActorSheet.Data<infer T> ? T : Actor,
  P extends DocumentSheet.Options = DocumentSheet.Options
> extends DocumentSheet<P, D, O> {
  /**
   * @param actor   - The Actor instance being displayed within the sheet.
   * @param options - Additional options which modify the rendering of the Actor's sheet.
   */
  constructor(actor: O, options?: Partial<P>);

  /**
   * If this Actor Sheet represents a synthetic Token actor, reference the active Token
   */
  get token(): O['token'];

  /**
   * {@inheritdoc}
   *
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   height: 720,
   *   width: 800,
   *   template: 'templates/sheets/actor-sheet.html',
   *   closeOnSubmit: false,
   *   submitOnClose: true,
   *   submitOnChange: true,
   *   resizable: true,
   *   baseApplication: 'ActorSheet',
   *   dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }],
   *   token: null,
   * });
   * ```
   */
  static get defaultOptions(): typeof DocumentSheet['defaultOptions'];

  /** {@inheritdoc} */
  get id(): string;

  /** {@inheritdoc} */
  get title(): string;

  /**
   * A convenience reference to the Actor entity
   */
  get actor(): O;

  /**
   * @param options - (unused)
   * {@inheritdoc}
   */
  getData(options?: Application.RenderOptions): D | Promise<D>;

  /**
   * @override
   */
  render(force?: boolean, options?: Application.RenderOptions): this;

  /** {@inheritdoc} */
  protected _getHeaderButtons(): Application.HeaderButton[];

  /** {@inheritdoc} */
  activateListeners(html: JQuery): void;

  /**
   * Handle requests to configure the prototype Token for the Actor
   */
  protected _onConfigureToken(event: JQuery.ClickEvent): void;

  /**
   * Handle requests to configure the default sheet used by this Actor
   */
  protected _onConfigureSheet(event: JQuery.ClickEvent): void;

  /**
   * Handle changing the actor profile image by opening a FilePicker
   */
  protected _onEditImage(event: JQuery.ClickEvent): ReturnType<FilePicker['browse']>;

  /** {@inheritdoc} */
  protected _canDragStart(selector: string | null): boolean;

  /** {@inheritdoc} */
  protected _canDragDrop(selector: string | null): boolean;

  /** {@inheritdoc} */
  protected _onDragStart(event: DragEvent): void;

  /** {@inheritdoc} */
  _onDrop(
    event: DragEvent
  ): Promise<boolean | undefined | ActiveEffect.Data | ActorSheet.OwnedItemData<O> | ActorSheet.OwnedItemData<O>[]>;

  /**
   * Handle the dropping of ActiveEffect data onto an Actor Sheet
   * @param event - The concluding DragEvent which contains drop data
   * @param data  - The data transfer extracted from the event
   * @returns A data object which describes the result of the drop
   */
  protected _onDropActiveEffect(
    event: DragEvent,
    data: ActorSheet.DropData.ActiveEffect
  ): Promise<ActiveEffect.Data | undefined>;

  /**
   * Handle dropping of an Actor data onto another Actor sheet
   * @param event - The concluding DragEvent which contains drop data
   * @param data  - The data transfer extracted from the event
   * @returns A data object which describes the result of the drop
   */
  protected _onDropActor(event: DragEvent, data: ActorSheet.DropData.Actor): Promise<boolean | undefined>;

  /**
   * Handle dropping of an item reference or item data onto an Actor Sheet
   * @param event - The concluding DragEvent which contains drop data
   * @param data  - The data transfer extracted from the event
   * @returns A data object which describes the result of the drop
   */
  protected _onDropItem(
    event: DragEvent,
    data: ActorSheet.DropData.Item<ActorSheet.OwnedItemData<O>>
  ): Promise<boolean | undefined | ActorSheet.OwnedItemData<O>>;

  /**
   * Handle dropping of a Folder on an Actor Sheet.
   * Currently supports dropping a Folder of Items to create all items as owned items.
   * @param event - The concluding DragEvent which contains drop data
   * @param data  - The data transfer extracted from the event
   * @returns A data object which describes the result of the drop
   */
  protected _onDropFolder(
    event: DragEvent,
    data: { type: 'Folder' } & (object | { entity: string; id: string })
  ): Promise<boolean | undefined | ActorSheet.OwnedItemData<O>[] | ActorSheet.OwnedItemData<O>>;

  /**
   * Handle the final creation of dropped Item data on the Actor.
   * This method is factored out to allow downstream classes the opportunity to override item creation behavior.
   * @param itemData - The item data requested for creation
   */
  protected _onDropItemCreate(itemData: ActorSheet.OwnedItemData<O>): Promise<ActorSheet.OwnedItemData<O>>;

  /**
   * Handle a drop event for an existing Owned Item to sort that item
   */
  protected _onSortItem(
    event: DragEvent,
    itemData: ActorSheet.OwnedItemData<O>
  ): Promise<ActorSheet.OwnedItemData<O>> | undefined;
}

declare namespace ActorSheet {
  type OwnedItemData<O extends Actor> = O extends Actor<any, infer I> ? I['data'] : never;

  /**
   * @typeParam O - the type of the Entity which should be managed by this form
   *                sheet
   */
  interface Data<O extends Actor = Actor> extends DocumentSheet.Data<O> {
    actor: DocumentSheet.Data<O>['document'];
    data: DocumentSheet.Data<O>['document']['data'];
    items: DocumentSheet.Data<O>['document']['items'];
  }

  namespace DropData {
    type Combined = ActiveEffect | Actor | Item | Folder;

    interface ActiveEffect {
      type?: 'ActiveEffect';
      tokenId?: string;
      actorId?: string;
      data?: ActiveEffect.Data;
    }

    interface Actor {
      type?: 'Actor';
    }

    /**
     * @typeParam I - the item data
     */
    type Item<I extends Item.Data = Item.Data> = {
      type?: 'Item';
      actorId?: string;
      tokenId?: string;
    } & (DeepPartial<I> | { pack?: string } | { id?: string });

    interface Folder {
      type?: 'Folder';
      entity?: string;
      id?: string;
    }
  }
}
