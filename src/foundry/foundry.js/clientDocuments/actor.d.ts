import { ConfiguredDocumentClass, DocumentConstructor } from '../../../types/helperTypes';
import { DocumentModificationOptions } from '../../common/abstract/document.mjs';
import EmbeddedCollection from '../../common/abstract/embedded-collection.mjs';

declare global {
  /**
   * The client-side Actor document which extends the common BaseActor model.
   * Each Actor document contains ActorData which defines its data schema.
   *
   * @see {@link data.ActorData}              The Actor data schema
   * @see {@link documents.Actors}            The world-level collection of Actor documents
   * @see {@link applications.ActorSheet}     The Actor configuration application
   *
   * @example <caption>Create a new Actor</caption>
   * ```typescript
   * let actor = await Actor.create({
   *   name: "New Test Actor",
   *   type: "character",
   *   img: "artwork/character-profile.jpg"
   * });
   * ```
   *
   * @example <caption>Retrieve an existing Actor</caption>
   * ```typescript
   * let actor = game.actors.get(actorId);
   * ```
   */
  class Actor extends ClientDocumentMixin(foundry.documents.BaseActor) {
    /**
     * @override
     * @param data    - Initial data provided to construct the Actor document
     * @param context - The document context, see {@link foundry.abstract.Document}
     */
    constructor(
      data: ConstructorParameters<typeof foundry.documents.BaseActor>[0],
      context?: ConstructorParameters<typeof foundry.documents.BaseActor>[1]
    );

    /**
     * An object that tracks which tracks the changes to the data model which were applied by active effects
     * @defaultValue `{}`
     */
    overrides: Record<string, unknown>;

    /**
     * A cached array of image paths which can be used for this Actor's token.
     * Null if the list has not yet been populated.
     * @defaultValue `null`
     */
    protected _tokenImages: string[] | null;

    /**
     * Cache the last drawn wildcard token to avoid repeat draws
     * @defaultValue `null`
     */
    protected _lastWildcard: string | null;

    /**
     * A convenient reference to the file path of the Actor's profile image
     */
    get img(): this['data']['img'];

    /**
     * Provide an object which organizes all embedded Item instances by their type
     */
    get itemTypes(): Record<
      foundry.documents.BaseItem['data']['type'],
      Array<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>>>
    >;
    /**
     * Test whether an Actor entity is a synthetic representation of a Token (if true) or a full Entity (if false)
     */
    get isToken(): boolean;

    /**
     * An array of ActiveEffect instances which are present on the Actor which have a limited duration.
     */
    get temporaryEffects(): ReturnType<this['effects']['filter']>;

    /**
     * Return a reference to the TokenDocument which owns this Actor as a synthetic override
     */
    get token(): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseToken>> | null;

    /**
     * A convenience reference to the item type (data.type) of this Actor
     */
    get type(): this['data']['type'];

    /** @override */
    get uuid(): string;

    /**
     * Apply any transformations to the Actor data which are caused by ActiveEffects.
     */
    applyActiveEffects(): void;

    /**
     * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
     * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
     * If the Actor is a synthetic token actor, only the exact Token which it represents will be returned.
     *
     * @param linked   - Limit results to Tokens which are linked to the Actor. Otherwise return all Tokens even those which are not linked. (default: `false`)
     * @param document - Return the Document instance rather than the PlaceableObject (default: `false`)
     * @returns An array of Token instances in the current Scene which reference this Actor.
     */
    getActiveTokens(
      linked?: boolean,
      document?: boolean
    ): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseToken>>[];

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Actor
     */
    getRollData(): this['data']['data'];

    /** @override */
    protected _getSheetClass(): ConstructorOf<FormApplication> | null;

    /**
     * Create a new TokenData object which can be used to create a Token representation of the Actor.
     * @param data - Additional data, such as x, y, rotation, etc. for the created token data (default: `{}`)
     * @returns The created TokenData instance
     */
    getTokenData(data?: object): Promise<foundry.data.TokenData>;

    /**
     * Get an Array of Token images which could represent this Actor
     */
    getTokenImages(): Promise<string[]>;

    /**
     * Handle how changes to a Token attribute bar are applied to the Actor.
     * This allows for game systems to override this behavior and deploy special logic.
     * @param attribute - The attribute path
     * @param value     - The target attribute value
     * @param isDelta   - Whether the number represents a relative change (true) or an absolute change (false) (default: `false`)
     * @param isBar     - Whether the new value is part of an attribute bar, or just a direct value (default: `true`)
     * @returns The updated Actor document
     */
    modifyTokenAttribute(attribute: string, value: number, isDelta: boolean, isBar: boolean): Promise<this>;

    /** @override */
    prepareEmbeddedEntities(): void;

    /**
     * Roll initiative for all Combatants in the currently active Combat encounter which are associated with this Actor.
     * If viewing a full Actor entity, all Tokens which map to that actor will be targeted for initiative rolls.
     * If viewing a synthetic Token actor, only that particular Token will be targeted for an initiative roll.
     *
     * @param options - Configuration for how initiative for this Actor is rolled.
     * @returns A promise which resolves to the Combat entity once rolls are complete.
     */
    rollInitiative(options?: Actor.RollInitiativeOptions): Promise<void>;

    /** @override */
    getEmbeddedCollection(embeddedName: string): EmbeddedCollection<DocumentConstructor, foundry.data.ActorData>;

    /** @override */
    protected _preCreate(
      data: Parameters<foundry.data.ActorData['_initializeSource']>[0],
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    /** @override */
    protected _onUpdate(
      changed: DeepPartial<foundry.data.ActorData['_source']> & Record<string, unknown>,
      options: DocumentModificationOptions,
      user: string
    ): void;

    /** @override */
    protected _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @override */
    protected _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @override */
    protected _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /**
     * Refresh the display of active Tokens for this Actor if ActiveEffects were changed
     */
    protected _refreshTokens(): void;

    /**
     * You are referencing Actor#_data which has been deprecated in favor of Actor#data#_source. Support for this reference will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    get _data(): this['data']['_source'];

    /**
     * You are referencing Actor#getOwnedItem(itemId) which is deprecated in favor of Actor#items#get(itemId). Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    getOwnedItem(itemId: string): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>> | undefined;

    /**
     * You are referencing Actor#createOwnedItem which is deprecated in favor of Item.create or Actor#createEmbeddedDocuments. Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    createOwnedItem(
      itemData: Parameters<this['createEmbeddedDocuments']>[1][] | Parameters<this['createEmbeddedDocuments']>[1],
      options: Parameters<this['createEmbeddedDocuments']>[2]
    ): ReturnType<this['createEmbeddedDocuments']>;

    /**
     * You are referencing Actor#updateOwnedItem which is deprecated in favor of Item#update or Actor#updateEmbeddedDocuments. Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    updateOwnedItem(
      itemData: Parameters<this['updateEmbeddedDocuments']>[1][] | Parameters<this['updateEmbeddedDocuments']>[1],
      options: Parameters<this['updateEmbeddedDocuments']>[2]
    ): ReturnType<this['updateEmbeddedDocuments']>;

    /**
     * You are referencing Actor#deleteOwnedItem which is deprecated in favor of Item#delete or Actor#deleteEmbeddedDocuments. Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    deleteOwnedItem(
      itemId: Parameters<this['deleteEmbeddedDocuments']>[1][] | Parameters<this['deleteEmbeddedDocuments']>[1],
      options: Parameters<this['deleteEmbeddedDocuments']>[2]
    ): ReturnType<this['deleteEmbeddedDocuments']>;

    /**
     * You are referencing Actor.fromToken which is deprecated in favor of TokenDocument#getActor. Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    static fromToken(
      token: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseToken>>
    ): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>;

    /**
     * You are referencing Actor.createTokenActor which is deprecated in favor of TokenDocument#getActor. Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    static createTokenActor(
      _baseActor: unknown,
      token: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseToken>>
    ): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>;
  }
  namespace Actor {
    interface RollInitiativeOptions {
      /**
       * Create new Combatant entries for Tokens associated with this actor.
       * @defaultValue `false`
       */
      createCombatants?: boolean;

      /**
       * Re-roll the initiative for this Actor if it has already been rolled.
       * @defaultValue `false`
       */
      rerollInitiative?: boolean;

      /**
       * Additional options passed to the Combat#rollInitiative method.
       * @defaultValue `{}`
       * TODO: Solve once Combat is more fleshed out. @see Combat#rollInitiative
       */
      initiativeOptions?: object;
    }
  }
}
