/**
 * The Collection of Actor entities.
 *
 * @see {@link Actor} The Actor entity.
 * @see {@link ActorDirectory} All Actors which exist in the world are rendered within the ActorDirectory sidebar tab.
 *
 * @example <caption>Retrieve an existing Actor by its id</caption>
 * ```typescript
 * if (game.actors === undefined) throw "Too early to use an enitiy collection";
 * let actor = game.actors.get(actorId);
 * ```
 */
declare class Actors extends EntityCollection<Actor> {
  /**
   * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
   * Each Actor is referenced by the Token.id.
   */
  tokens: {
    [id: string]: Actor;
  };

  /** @override */
  get entity(): string;

  /* -------------------------------------------- */
  /*  Sheet Registration Methods                  */
  /* -------------------------------------------- */

  /**
   * Register an Actor sheet class as a candidate which can be used to display Actors of a given type
   * See EntitySheetConfig.registerSheet for details
   *
   * @example <caption>Register a new ActorSheet subclass for use with certain Actor types.</caption>
   * ```typescript
   * Actors.registerSheet("dnd5e", ActorSheet5eCharacter, { types: ["character"], makeDefault: true });
   * ```
   */
  static registerSheet(
    scope: string,
    sheetClass: ConstructorOf<Application>,
    {
      label,
      types,
      makeDefault
    }?: {
      label?: string;
      types?: string[];
      makeDefault?: boolean;
    }
  ): void;

  /**
   * Unregister an Actor sheet class, removing it from the list of avaliable sheet Applications to use
   * See EntitySheetConfig.unregisterSheet for details
   *
   * @example <caption>Deregister the default ActorSheet subclass to replace it with others.</caption>
   * ```typescript
   * Actors.unregisterSheet("core", ActorSheet);
   * ```
   */
  static unregisterSheet(
    scope: string,
    sheetClass: ConstructorOf<Application>,
    {
      types
    }?: {
      types?: string[];
    }
  ): void;

  /**
   * Return an Array of currently registered sheet classes for this Entity type
   */
  static get registeredSheets(): Array<ConstructorOf<ActorSheet>>;
}

/**
 * The Actor Entity which represents the protagonists, characters, enemies, and more that inhabit and take actions
 * within the World.
 *
 * @typeParam D - Actor.data field. Type should extend Actor.Data
 * @typeParam I - Item type for the system. Data type should match item data type of D
 *
 * @see {@link Actors} Each Actor belongs to the Actors collection.
 * @see {@link ActorSheet} Each Actor is edited using the ActorSheet application or a subclass thereof.
 * @see {@link ActorDirectory} All Actors which exist in the world are rendered within the ActorDirectory sidebar tab.
 *
 *
 * @example <caption>Create a new Actor</caption>
 * ```typescript
 * let actor = await Actor.create({
 *   name: "New Test Actor",
 *   type: "character",
 *   img: "artwork/character-profile.jpg",
 *   folder: folder.data._id,
 *   sort: 12000,
 *   data: {},
 *   token: {},
 *   items: [],
 *   flags: {}
 * });
 * ```
 *
 * @example <caption>Retrieve an existing Actor</caption>
 * ```typescript
 * if (game.actors === undefined) throw "Too early to use an enitiy collection";
 * let actor = game.actors.get(actorId);
 * ```
 */
declare class Actor<
  D extends Actor.Data = Actor.Data,
  I extends Item<Actor.OwnedItemData<D>> = Item<Actor.OwnedItemData<D>>
> extends Entity<D> {
  constructor(data?: DeepPartial<D>, options?: Entity.CreateOptions);

  /**
   * A reference to a placed Token which creates a synthetic Actor
   */
  token: Token | null;

  /**
   * Construct the Array of Item instances for the Actor
   * Items are prepared by the Actor.prepareEmbeddedEntities() method
   */
  items: Collection<I>;

  /**
   * ActiveEffects are prepared by the Actor.prepareEmbeddedEntities() method
   */
  effects: Collection<ActiveEffect<this>>;

  /**
   * A set that tracks which keys in the data model were modified by active effects
   */
  overrides: DeepPartial<D>;

  /**
   * Cache an Array of allowed Token images if using a wildcard path
   */
  _tokenImages: string[];

  /** @override */
  static get config(): Entity.Config<Actor>;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenient reference to the file path of the Actor's profile image
   */
  get img(): string;

  /**
   * Classify Owned Items by their type
   */
  get itemTypes(): {
    [itemType: string]: I[];
  };

  /**
   * Test whether an Actor entity is a synthetic representation of a Token (if true) or a full Entity (if false)
   */
  get isToken(): boolean;

  /**
   * An array of ActiveEffect instances which are present on the Actor which have a limited duration.
   * @returns
   */
  get temporaryEffects(): ActiveEffect<this>[];

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /**
   * @remarks
   * Returns void
   * @override
   */
  prepareData(): void;

  /**
   * First prepare any derived data which is actor-specific and does not depend on Items or Active Effects
   */
  prepareBaseData(): void;

  /**
   * Apply final transformations to the Actor data after all effects have been applied
   */
  prepareDerivedData(): void;

  /** @override */
  prepareEmbeddedEntities(): void;

  /**
   * Prepare a Collection of OwnedItem instances which belong to this Actor.
   * @param items - The raw array of item objects
   * @returns The prepared owned items collection
   */
  protected _prepareOwnedItems(items: Array<Actor.OwnedItemData<D>>): Collection<I>;

  /**
   * Prepare a Collection of ActiveEffect instances which belong to this Actor.
   * @param effects - The raw array of active effect objects
   * @returns The prepared active effects collection
   */
  protected _prepareActiveEffects(effects: ActiveEffect.Data[]): Collection<ActiveEffect<this>>;

  /**
   * Apply any transformations to the Actor data which are caused by ActiveEffects.
   */
  applyActiveEffects(): void;

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Create a synthetic Actor using a provided Token instance
   * If the Token data is linked, return the true Actor entity
   * If the Token data is not linked, create a synthetic Actor using the Token's actorData override
   */
  static fromToken(token: Token): Actor;

  /**
   * Create a synthetic Token Actor instance which is used in place of an actual Actor.
   * Cache the result in Actors.tokens.
   * @param baseActor - The real actor to clone
   * @param token     - The Token containing the actor
   */
  static createTokenActor(baseActor: Actor, token: Token): Actor;

  /**
   * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
   * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
   *
   * @param linked - Only return tokens which are linked to the Actor. Default (false) is to return all
   *                 tokens even those which are not linked.
   * @returns An array of tokens in the current Scene which reference this Actor.
   */
  getActiveTokens(linked?: boolean): Token[];

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Actor
   * @returns A copy of data.data
   * @remarks Testing actor.data.type does not narrow the type for this method
   */
  getRollData(): D['data'];

  /**
   * Get an Array of Token images which could represent this Actor
   */
  getTokenImages(): Promise<string[]>;

  /**
   * Handle how changes to a Token attribute bar are applied to the Actor.
   * This allows for game systems to override this behavior and deploy special logic.
   * @param attribute - The attribute path
   * @param value     - The target attribute value
   * @param isDelta   - Whether the number represents a relative change (true) or an absolute change (false)
   * @param isBar     - Whether the new value is part of an attribute bar, or just a direct value
   * @returns The updated Actor entity
   */
  modifyTokenAttribute(attribute: string, value: number, isDelta?: boolean, isBar?: boolean): Promise<this>;

  /**
   * Roll initiative for all Combatants in the currently active Combat encounter which are associated with this Actor.
   * If viewing a full Actor entity, all Tokens which map to that actor will be targeted for initiative rolls.
   * If viewing a synthetic Token actor, only that particular Token will be targeted for an initiative roll.
   *
   * @param createCombatants  - Create new Combatant entries for Tokens associated with this actor.
   * @param rerollInitiative  - Re-roll the initiative for this Actor if it has already been rolled.
   * @param initiativeOptions - Additional options passed to the Combat#rollInitiative method.
   * @returns A promise which resolves to the Combat entity once rolls are complete.
   */
  rollInitiative({
    createCombatants,
    rerollInitiative,
    initiativeOptions
  }?: {
    createCombatants?: boolean;
    rerollInitiative?: boolean;
    initiativeOptions?: any;
  }): Promise<Combat | null>;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers
  /* -------------------------------------------- */

  /** @override */
  update<U>(
    data: Expanded<U> extends DeepPartial<this['data']> ? U : never,
    options?: Entity.UpdateOptions
  ): Promise<this>;
  update(data: DeepPartial<this['data']>, options?: Entity.UpdateOptions): Promise<this>;

  /** @override */
  delete(options?: Entity.DeleteOptions): Promise<this>;

  /** @override */
  protected _onUpdate(data: DeepPartial<D>, options: Entity.UpdateOptions, userId: string, context?: any): void;

  /** @override */
  createEmbeddedEntity<U>(
    embeddedName: 'OwnedItem',
    data: Expanded<U> extends DeepPartial<Actor.OwnedItemData<D>> ? U : DeepPartial<Actor.OwnedItemData<D>>,
    options?: any
  ): Promise<Actor.OwnedItemData<D>>;

  /** @override */
  createEmbeddedEntity<U>(
    embeddedName: 'ActiveEffect',
    data: Expanded<U> extends DeepPartial<ActiveEffect.Data> ? U : DeepPartial<ActiveEffect.Data>,
    options?: any
  ): Promise<ActiveEffect.Data>;

  /**
   * When Owned Items are created process each item and extract Active Effects to transfer to the Actor.
   * @param created - Created owned Item data objects
   * @param temporary - Is this a temporary item creation?
   * @returns An array of effects to transfer to the Actor
   */
  protected _createItemActiveEffects(
    created: Actor.OwnedItemData<D> | Array<Actor.OwnedItemData<D>>,
    { temporary }?: { temporary?: boolean }
  ): Promise<ActiveEffect.Data[] | ActiveEffect.Data | undefined>;

  /** @override */
  protected _onCreateEmbeddedEntity(
    embeddedName: string,
    child: Actor.OwnedItemData<D> | ActiveEffect.Data,
    options: any,
    userId: string
  ): void;

  /** @override */
  deleteEmbeddedEntity(embeddedName: 'OwnedItem', data: string, options?: any): Promise<Actor.OwnedItemData<D>>;

  /** @override */
  deleteEmbeddedEntity(embeddedName: 'ActiveEffect', data: string, options?: any): Promise<ActiveEffect.Data>;

  /**
   * When Owned Items are created process each item and extract Active Effects to transfer to the Actor.
   * @param deleted - The array of deleted owned Item data
   */
  protected _deleteItemActiveEffects(
    deleted: Actor.OwnedItemData<D> | Array<Actor.OwnedItemData<D>>
  ): Promise<ActiveEffect.Data | ActiveEffect.Data[] | undefined>;

  /** @override */
  protected _onDeleteEmbeddedEntity(
    embeddedName: string,
    child: Actor.OwnedItemData<D> | ActiveEffect.Data,
    options: any,
    userId: string
  ): void;

  /** @override */
  protected _onModifyEmbeddedEntity(
    embeddedName: string,
    changes: Array<Actor.OwnedItemData<D>> | ActiveEffect.Data[],
    options: any,
    userId: string,
    context?: any
  ): void;

  /* -------------------------------------------- */
  /*  Owned Item Management                       */
  /* -------------------------------------------- */

  /**
   * Get an Item instance corresponding to the Owned Item with a given id
   * @param itemId - The owned Item id to retrieve
   * @returns An Item instance representing the Owned Item within the Actor entity
   */
  getOwnedItem(itemId: string): I;

  /**
   * Create a new item owned by this Actor. This redirects its arguments to the createEmbeddedEntity method.
   * @see Entity#createEmbeddedEntity
   *
   * @param itemData    - Data for the newly owned item
   * @param options     - Item creation options
   * @param renderSheet - Render the Item sheet for the newly created item data
   * @returns A Promise resolving to the created Owned Item data
   */
  createOwnedItem(itemData: DeepPartial<Actor.OwnedItemData<D>>, options?: any): Promise<Actor.OwnedItemData<D>>;
  createOwnedItem(itemData: DeepPartial<Actor.OwnedItemData<D>>[], options?: any): Promise<Actor.OwnedItemData<D>[]>;

  /**
   * Update an owned item using provided new data. This redirects its arguments to the updateEmbeddedEntity method.
   * @see Entity#updateEmbeddedEntity
   *
   * @param itemData - Data for the item to update
   * @param options  - Item update options
   * @returns A Promise resolving to the updated Owned Item data
   */
  updateOwnedItem(
    itemData: DeepPartial<Actor.OwnedItemData<D>>,
    options?: Entity.UpdateOptions
  ): Promise<Actor.OwnedItemData<D>>;
  updateOwnedItem(
    itemData: DeepPartial<Actor.OwnedItemData<D>>[],
    options?: Entity.UpdateOptions
  ): Promise<Array<Actor.OwnedItemData<D>>>;

  /* -------------------------------------------- */

  /**
   * Delete an owned item by its id. This redirects its arguments to the deleteEmbeddedEntity method.
   * @see Entity#deleteEmbeddedEntity
   *
   * @param itemId - The ID of the item to delete
   * @param options - Item deletion options
   * @returns A Promise resolving to the deleted Owned Item data
   */
  deleteOwnedItem(itemId: string, options?: Entity.DeleteOptions): Promise<Actor.OwnedItemData<D>>;
  deleteOwnedItem(itemId: string[], options?: Entity.DeleteOptions): Promise<Array<Actor.OwnedItemData<D>>>;

  /* -------------------------------------------- */
  /*  DEPRECATED                                  */
  /* -------------------------------------------- */

  /**
   * @deprecated since 0.7.0
   */
  importItemFromCollection(collection: string, entryId: String): Promise<any>;

  /**
   * @deprecated since 0.7.2
   * @see {@link Entity#hasPlayerOwner}
   */
  get isPC(): boolean;
}

declare namespace Actor {
  /**
   * Full item type for owned items
   * @typeParam D - Actor.Data to extract Item type from
   * @internal
   */
  type OwnedItemData<D extends Data> = D['items'][number];

  /**
   * @typeParam D - Type for `data.data`
   * @typeParam I - Type for system's Item
   */
  interface Data<D = any, I extends Item.Data = Item.Data> extends Entity.Data {
    data: D;
    effects: ActiveEffect.Data[];
    folder: string;
    img: string;
    items: I[];
    name: string;
    permission: Entity.Permission;
    sort: number;
    token: Omit<Token['data'], 'actorData' | 'effects' | 'elevation' | 'hidden' | 'x' | 'y' | '_id'> & {
      randomImg: boolean;
    };
    type: string;
  }
}
