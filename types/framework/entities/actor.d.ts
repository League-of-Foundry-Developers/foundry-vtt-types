/**
 * The Collection of Actor entities.
 *
 * @see {@link Actor} The Actor entity.
 * @see {@link ActorDirectory} All Actors which exist in the world are rendered within the ActorDirectory sidebar tab.
 *
 * @example <caption>Retrieve an existing Actor by its id</caption>
 * let actor = game.actors.get(actorId);
 */
declare class Actors extends EntityCollection<Actor> {

    /**
     * A mapping of synthetic Token Actors which are currently active within the viewed Scene.
     * Each Actor is referenced by the Token.id.
     * @type {Object}
     */
  tokens: {
    [id: string]: Actor
  }

  /** @override */
  get entity(): string

  /* -------------------------------------------- */
  /*  Sheet Registration Methods                  */
  /* -------------------------------------------- */

  /**
   * Register an Actor sheet class as a candidate which can be used to display Actors of a given type
   * See EntitySheetConfig.registerSheet for details
   * @static
   *
   * @example <caption>Register a new ActorSheet subclass for use with certain Actor types.</caption>
   * Actors.registerSheet("dnd5e", ActorSheet5eCharacter, { types: ["character"], makeDefault: true });
   */
  static registerSheet(scope: string, sheetClass: () => Application, {label, types, makeDefault}?: {
    label?: string
    types?: (() => Application)[]
    makeDefault?: boolean
  }): void

  /**
   * Unregister an Actor sheet class, removing it from the list of avaliable sheet Applications to use
   * See EntitySheetConfig.unregisterSheet for details
   * @static
   *
   * @example <caption>Deregister the default ActorSheet subclass to replace it with others.</caption>
   * Actors.unregisterSheet("core", ActorSheet);
   */
  static unregisterSheet(scope: string, sheetClass: () => Application, {types}?: {
    types?: (() => Application)[]
  }): void

  /**
   * Return an Array of currently registered sheet classes for this Entity type
   * @type {ActorSheet[]}
   */
  static get registeredSheets(): (() => ActorSheet)[]
}

/**
 * The Actor Entity which represents the protagonists, characters, enemies, and more that inhabit and take actions
 * within the World.
 *
 * @typeParam DD - Actor.data.data field
 * @typeParam I - Item.Data for owned items
 * @typeParam D - Actor.data field
 *
 * @see {@link Actors} Each Actor belongs to the Actors collection.
 * @see {@link ActorSheet} Each Actor is edited using the ActorSheet application or a subclass thereof.
 * @see {@link ActorDirectory} All Actors which exist in the world are rendered within the ActorDirectory sidebar tab.
 *
 *
 * @example <caption>Create a new Actor</caption>
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
 *
 * @example <caption>Retrieve an existing Actor</caption>
 * let actor = game.actors.get(actorId);
 */
declare class Actor<DD = any, I extends Item.Data = Item.Data, D extends Actor.Data = Actor.Data<DD, I>> extends Entity {
  constructor (data?: D, options?: EntityCreateOptions)

  /**
     * A reference to a placed Token which creates a synthetic Actor
     * @type {Token}
     */
  token: Token | null

  /**
     * Construct the Array of Item instances for the Actor
     * Items are prepared by the Actor.prepareEmbeddedEntities() method
     * @type {Collection<string,I>}
     */
  items: Collection<Item>

  /**
     * ActiveEffects are prepared by the Actor.prepareEmbeddedEntities() method
     */
  effects: Collection<ActiveEffect>

  /**
     * A set that tracks which keys in the data model were modified by active effects
     * @type {Data}
     */
  overrides: DD

  /**
     * Cache an Array of allowed Token images if using a wildcard path
     * @type {string[]}
     * @private
     */
  _tokenImages: string[]

  /** @override */
  static get config (): EntityConfig

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenient reference to the file path of the Actor's profile image
   * @type {string}
   */
  get img (): string

  /**
   * Classify Owned Items by their type
   * @type {Object<string,Array>}
   */
  get itemTypes (): {
    [prop: string]: Item<I>[]
  }

  /**
   * Test whether an Actor entity is a synthetic representation of a Token (if true) or a full Entity (if false)
   * @type {boolean}
   */
  get isToken (): boolean

  /**
   * An array of ActiveEffect instances which are present on the Actor which have a limited duration.
   * @return {ActiveEffect[]}
   */
  get temporaryEffects (): ActiveEffect[]

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /**
   * @remarks
   * Returns void
   * @override
   */
  prepareData (): any

  /**
   * First prepare any derived data which is actor-specific and does not depend on Items or Active Effects
   */
  prepareBaseData (): void

  /**
   * Apply final transformations to the Actor data after all effects have been applied
   */
  prepareDerivedData (): void

  /** @override */
  prepareEmbeddedEntities (): void

  /**
   * Prepare a Collection of OwnedItem instances which belong to this Actor.
   * @param {object[]} items  The raw array of item objects
   * @return {Collection<string,Item>} The prepared owned items collection
   * @private
   */
  _prepareOwnedItems (items: I[]): Collection<Item>

  /**
   * Prepare a Collection of ActiveEffect instances which belong to this Actor.
   * @param {object[]} effects  The raw array of active effect objects
   * @return {Collection<string,ActiveEffect>}  The prepared active effects collection
   * @private
   */
  _prepareActiveEffects (effects: ActiveEffect[]): Collection<ActiveEffect>

  /**
   * Apply any transformations to the Actor data which are caused by ActiveEffects.
   */
  applyActiveEffects (): void

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Create a synthetic Actor using a provided Token instance
   * If the Token data is linked, return the true Actor entity
   * If the Token data is not linked, create a synthetic Actor using the Token's actorData override
   * @param {Token} token
   * @return {Actor}
   */
  static fromToken (token: Token): Actor

  /**
   * Create a synthetic Token Actor instance which is used in place of an actual Actor.
   * Cache the result in Actors.tokens.
   * @param {Actor} baseActor
   * @param {Token} token
   * @return {Actor}
   */
  static createTokenActor (baseActor: Actor, token: Token): Actor

  /**
   * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
   * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
   *
   * @param [linked] {boolean}  Only return tokens which are linked to the Actor. Default (false) is to return all
   *                            tokens even those which are not linked.
   *
   * @return {Token[]}          An array of tokens in the current Scene which reference this Actor.
   */
  getActiveTokens (linked?: boolean): Token[]

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Actor
   * @return {Object}
   */
  getRollData (): DD

  /**
   * Get an Array of Token images which could represent this Actor
   * @return {Promise<string[]>}
   */
  getTokenImages (): Promise<string[]>

  /**
   * Handle how changes to a Token attribute bar are applied to the Actor.
   * This allows for game systems to override this behavior and deploy special logic.
   * @param {string} attribute    The attribute path
   * @param {number} value        The target attribute value
   * @param {boolean} isDelta     Whether the number represents a relative change (true) or an absolute change (false)
   * @param {boolean} isBar       Whether the new value is part of an attribute bar, or just a direct value
   * @return {Promise<Actor>}     The updated Actor entity
   */
  modifyTokenAttribute (attribute: string, value: any, isDelta?: boolean, isBar?: boolean): Promise<this>

  /**
   * Roll initiative for all Combatants in the currently active Combat encounter which are associated with this Actor.
   * If viewing a full Actor entity, all Tokens which map to that actor will be targeted for initiative rolls.
   * If viewing a synthetic Token actor, only that particular Token will be targeted for an initiative roll.
   *
   * @param {object} options                Configuration for how initiative for this Actor is rolled.
   * @param {boolean} [options.createCombatants]      Create new Combatant entries for Tokens associated with this actor.
   * @param {boolean} [options.rerollInitiative]      Re-roll the initiative for this Actor if it has already been rolled.
   * @param {object} [options.initiativeOptions]      Additional options passed to the Combat#rollInitiative method.
   * @return {Promise<Combat|null>}         A promise which resolves to the Combat entity once rolls are complete.
   */
  rollInitiative ({ createCombatants, rerollInitiative, initiativeOptions }?: {
    createCombatants?: boolean
    rerollInitiative?: boolean
    initiativeOptions?: any
  }): Promise<Combat|null>

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers
  /* -------------------------------------------- */

  /** @override */
  update (data: D, options?: EntityUpdateOptions): Promise<this>

  /** @override */
  delete (options?: EntityDeleteOptions): Promise<Actor>

  /** @override */
  _onUpdate (data: D, options: EntityUpdateOptions, userId: string, context?: any): void

  /** @override */
  createEmbeddedEntity (embeddedName: string, data: ActiveEffect | any, options?: any): ActiveEffect | any // OwnedItem

  /**
   * When Owned Items are created process each item and extract Active Effects to transfer to the Actor.
   * @param {Data[]} created        Created owned Item data objects
   * @param {boolean} [temporary]   Is this a temporary item creation?
   * @return {Data[]}               An array of effects to transfer to the Actor
   * @private
   */
  _createItemActiveEffects (created: ActiveEffect, { temporary }?: { temporary?: boolean}): ActiveEffect

  /** @override */
  _onCreateEmbeddedEntity (embeddedName: string, child: I|ActiveEffect, options: any, userId: string): void

  /** @override */
  deleteEmbeddedEntity (embeddedName: string, data: string, options?: any): Promise<I|ActiveEffect>

  /**
   * When Owned Items are created process each item and extract Active Effects to transfer to the Actor.
   * @param {Data[]} deleted   The array of deleted owned Item data
   * @private
   */
  _deleteItemActiveEffects (deleted: I): ActiveEffect|ActiveEffect[]

  /** @override */
  _onDeleteEmbeddedEntity (embeddedName: string, child: I|ActiveEffect, options: any, userId: string): void

  /** @override */
  _onModifyEmbeddedEntity (embeddedName: string, changes: any[], options: any, userId: string, context?: any): void

  /* -------------------------------------------- */
  /*  Owned Item Management                       */
  /* -------------------------------------------- */

  /**
   * Get an Item instance corresponding to the Owned Item with a given id
   * @param {string} itemId   The owned Item id to retrieve
   * @return {Item}           An Item instance representing the Owned Item within the Actor entity
   */
  getOwnedItem (itemId: string): Item

  /**
   * Create a new item owned by this Actor. This redirects its arguments to the createEmbeddedEntity method.
   * @see {Entity#createEmbeddedEntity}
   *
   * @param {Object} itemData     Data for the newly owned item
   * @param {Object} options      Item creation options
   * @param {boolean} options.renderSheet Render the Item sheet for the newly created item data
   * @return {Promise.<Object>}   A Promise resolving to the created Owned Item data
   */
  createOwnedItem (itemData: I, options?: any): Promise<I>

  /**
   * Update an owned item using provided new data. This redirects its arguments to the updateEmbeddedEntity method.
   * @see {Entity#updateEmbeddedEntity}
   *
   * @param {Object} itemData     Data for the item to update
   * @param {Object} options      Item update options
   * @return {Promise.<Object>}   A Promise resolving to the updated Owned Item data
   */
  updateOwnedItem (itemData: I, options?: any): Promise<any>

  /* -------------------------------------------- */

  /**
   * Delete an owned item by its id. This redirects its arguments to the deleteEmbeddedEntity method.
   * @see {Entity#deleteEmbeddedEntity}
   *
   * @param {string} itemId       The ID of the item to delete
   * @param {Object} options      Item deletion options
   * @return {Promise.<Object>}   A Promise resolving to the deleted Owned Item data
   */
  deleteOwnedItem (itemId: string, options?: any): Promise<any>

  /* -------------------------------------------- */
  /*  DEPRECATED                                  */
  /* -------------------------------------------- */

  /**
   * @deprecated since 0.7.0
   */
  importItemFromCollection (collection: string, entryId: String): Promise<any>

  /**
   * @deprecated since 0.7.2
   * @see {@link Entity#hasPlayerOwner}
   */
  get isPC (): boolean
}

declare namespace Actor {
  interface Data<D = any, I extends Item.Data = Item.Data> extends EntityData {
    img?: string
    token?: any
    data?: D
    items?: I[]
    effects?: ActiveEffect[]
  }
}
