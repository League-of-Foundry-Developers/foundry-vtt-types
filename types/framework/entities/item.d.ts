/**
 * The Collection of Item entities
 * The items collection is accessible within the game as game.items
 */
declare class Items extends EntityCollection<Item> {
  /** @override */
  get entity (): string

  /* -------------------------------------------- */
  /*  Methods
  /* -------------------------------------------- */

  /**
   * Register an Actor sheet class as a candidate which can be used to display Actors of a given type
   * See EntitySheetConfig.registerSheet for details
   */
  static registerSheet (scope: string, sheetClass: () => Application, { label, types, makeDefault }?: {
    label?: string
    types?: Array<() => Application>
    makeDefault?: boolean
  }): void

  /**
   * Unregister an Actor sheet class, removing it from the list of avaliable sheet Applications to use
   * See EntitySheetConfig.unregisterSheet for details
   */
  static unregisterSheet (scope: string, sheetClass: () => Application, { types }?: {
    types?: Array<() => Application>
  }): void

  /**
   * Return an Array of currently registered sheet classes for this Entity type
   */
  static get registeredSheets (): Array<() => ItemSheet>
}

declare class Item<D extends Item.Data = Item.Data<any>> extends Entity<D> {
  /** @override */
  static get config (): Entity.Config

  /** @override */
  get uuid (): string

  /**
   * @remarks
   * Returns void
   * @override
   */
  prepareData (): any

  /** @override */
  prepareEmbeddedEntities (): void

  /**
   * Prepare a Collection of ActiveEffect instances which belong to this Item.
   * @param effects - The raw array of active effect objects
   * @returns The prepared active effects collection
   */
  _prepareActiveEffects (effects: ActiveEffect[]): Collection<ActiveEffect>

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   */
  getRollData (): Item.DataData<D>

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenience reference to the Actor entity which owns this item, if any
   */
  get actor (): Actor | null

  /**
   * A convenience reference to the image path (data.img) used to represent this Item
   */
  get img (): string

  /**
   * Return an array of the Active Effect instances which originated from this Item.
   * If the Item is owned, the returned instances are the ActiveEffect instances which exist on the owning Actor.
   * If the Item is unowned, the returned instances are the ActiveEffect instances which exist on the Item itself.
   */
  get transferredEffects (): ActiveEffect[]

  /**
   * A convenience reference to the item type (data.type) of this Item
   */
  get type (): string

  /**
   * A boolean indicator for whether the current game user has ONLY limited visibility for this Entity.
   * @returns
   */
  get limited (): boolean

  /**
   * A flag for whether the item is owned by an Actor entity
   * @returns
   */
  get isOwned (): boolean

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Override the standard permission test for Item entities as we need to apply a special check for owned items
   * OwnedItems have permission that the player has for the parent Actor.
   * @returns Whether or not the user has the permission for this item
   */
  hasPerm (user: User, permission: string | number, exact?: boolean): boolean

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  update (data: Optional<D>, options: Entity.UpdateOptions): Promise<this>

  /** @override */
  delete (options?: Entity.DeleteOptions): Promise<Item>

  /**
   * A convenience constructor method to create an Item instance which is owned by an Actor
   * @param itemData -
   * @param actor -
   */
  static createOwned (itemData: Item.Data, actor: Actor): Item
}

declare namespace Item {
  /**
   * Typing for the data.data field
   */
  type DataData<T> = T extends Data<infer D> ? D : never

  interface Data<D = any> extends Entity.Data {
    data: D
    img: string
    type: string
  }
}
