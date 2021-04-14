/**
 * The Item entity.
 * This base Item refers primarily to items which are not currently owned.

 * @typeParam D  - The type of the `Item`'s `_data` field. It should extend `Item.Data`.
 * @typeParam PD - The type of the `Item`'s `data` field after `prepareData` has been called. It should extend `D`.
 */
declare class Item<D extends Item.Data = Item.Data<any>, PD extends D = D> extends Entity<D, PD> {
  /**
   * ActiveEffects are prepared by the Item.prepareEmbeddedEntities() method
   */
  effects: foundry.utils.Collection<ActiveEffect<this>>;

  /** @override */
  static get config(): Entity.Config<Item>;

  /** @override */
  get uuid(): string;

  /**
   * @remarks
   * Returns void
   * @override
   */
  prepareData(): void;

  /** @override */
  prepareEmbeddedEntities(): void;

  /**
   * Prepare a Collection of ActiveEffect instances which belong to this Item.
   * @param effects - The raw array of active effect objects
   * @returns The prepared active effects collection
   */
  protected _prepareActiveEffects(effects: ActiveEffect.Data[]): foundry.utils.Collection<ActiveEffect<this>>;

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   */
  getRollData(): foundry.utils.Duplicated<PD['data']>;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenience reference to the Actor entity which owns this item, if any
   * @remarks
   * This should be cast to the appropriate Actor class for your system if needed
   */
  get actor(): Actor<Actor.Data<any, D>, this> | null;

  /**
   * A convenience reference to the image path (data.img) used to represent this Item
   */
  get img(): string;

  /**
   * Return an array of the Active Effect instances which originated from this Item.
   * If the Item is owned, the returned instances are the ActiveEffect instances which exist on the owning Actor.
   * If the Item is unowned, the returned instances are the ActiveEffect instances which exist on the Item itself.
   */
  get transferredEffects(): ActiveEffect<Actor<Actor.Data<any, D>, this> | this>[];

  /**
   * A convenience reference to the item type (data.type) of this Item
   * @remarks
   * This can't be used to type guard this._data and this.data; use this._data.type and this.data.type directly instead.
   */
  get type(): string;

  /**
   * A boolean indicator for whether the current game user has ONLY limited visibility for this Entity.
   * @returns
   */
  get limited(): boolean;

  /**
   * A flag for whether the item is owned by an Actor entity
   * @returns
   */
  get isOwned(): boolean;

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Override the standard permission test for Item entities as we need to apply a special check for owned items
   * OwnedItems have permission that the player has for the parent Actor.
   * @returns Whether or not the user has the permission for this item
   */
  hasPerm(user: User, permission: string | number, exact?: boolean): boolean;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  update<U>(data: Expanded<U> extends DeepPartial<D> ? U : never, options?: Entity.UpdateOptions): Promise<this>;
  update(data: DeepPartial<D>, options?: Entity.UpdateOptions): Promise<this>;

  /** @override */
  delete(options?: Entity.DeleteOptions): Promise<this>;

  /**
   * A convenience constructor method to create an Item instance which is owned by an Actor
   */
  static createOwned<T extends Item>(this: ConstructorOf<T>, itemData: DeepPartial<Item.Data>, actor: Actor): T;
}

declare namespace Item {
  /**
   * @typeParam D - Type for Item.data.data
   */
  interface Data<D = any> extends Entity.Data {
    data: D;
    effects: ActiveEffect.Data[];
    img: string;
    name: string;
    permission: Entity.Permission;
    sort: number;
    type: string;
  }
}
