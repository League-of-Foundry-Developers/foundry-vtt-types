import type { DeepPartial, InexactPartial } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseActor from "../../../common/documents/actor.d.mts";

declare global {
  namespace Actor {
    type Metadata = Document.MetadataFor<Actor>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Actor">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Actor">;

    interface DatabaseOperations extends DocumentDatabaseOperations<Actor> {}

    type ItemTypes = {
      [K in Game.Model.TypeNames<"Item">]: Array<
        // TODO(LukeAbby): Looks like a `Item.OfType` helper would be useful.
        Item.ConfiguredInstance & {
          type: K;
        } & (DataModelConfig extends { Item: { readonly [_ in K]?: infer SystemData } }
            ? {
                system: SystemData;
              }
            : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
              {})
      >;
    };

    // Helpful aliases
    type TypeNames = BaseActor.TypeNames;
    type ConstructorData = BaseActor.ConstructorData;
    type UpdateData = BaseActor.UpdateData;
    type Schema = BaseActor.Schema;
    type Source = BaseActor.Source;

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
       */
      initiativeOptions?: Combat.InitiativeOptions;
    }
  }

  /**
   * The client-side Actor document which extends the common BaseActor model.
   *
   *  ### Hook Events
   * {@link hookEvents.applyCompendiumArt}
   *
   * @see {@link Actors}            The world-level collection of Actor documents
   * @see {@link ActorSheet}     The Actor configuration application
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
    static override metadata: Actor.Metadata;

    static get implementation(): Actor.ConfiguredClass;

    protected override _configure(options?: { pack?: string | null }): void;

    /**
     * Maintain a list of Token Documents that represent this Actor, stored by Scene.
     */
    protected _dependentTokens: foundry.utils.IterableWeakMap<
      Scene.ConfiguredInstance,
      TokenDocument.ConfiguredInstance
    >;

    protected override _initializeSource(
      data: this | Actor.ConstructorData,
      options?: Omit<foundry.abstract.DataModel.DataValidationOptions, "parent">,
    ): Actor.Source;

    /**
     * An object that tracks which tracks the changes to the data model which were applied by active effects
     * @defaultValue `{}`
     */
    overrides: Record<string, unknown>;

    /**
     * The statuses that are applied to this actor by active effects
     */
    statuses: Set<string>;

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
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * Provide an object which organizes all embedded Item instances by their type
     */
    get itemTypes(): Actor.ItemTypes;
    /**
     * Test whether an Actor document is a synthetic representation of a Token (if true) or a full Document (if false)
     */
    get isToken(): boolean;

    /**
     * Retrieve the list of ActiveEffects that are currently applied to this Actor.
     */
    get appliedEffects(): ActiveEffect.ConfiguredInstance[];

    /**
     * An array of ActiveEffect instances which are present on the Actor which have a limited duration.
     */
    get temporaryEffects(): ReturnType<this["effects"]["filter"]>;

    /**
     * Return a reference to the TokenDocument which owns this Actor as a synthetic override
     */
    get token(): TokenDocument.ConfiguredInstance | null;

    /**
     * Whether the Actor has at least one Combatant in the active Combat that represents it.
     */
    get inCombat(): boolean;

    /**
     * Apply any transformations to the Actor data which are caused by ActiveEffects.
     */
    applyActiveEffects(): void;

    /**
     * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
     * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
     * If the Actor is a synthetic token actor, only the exact Token which it represents will be returned.
     *
     * @param linked   - Limit results to Tokens which are linked to the Actor. Otherwise return all
     *                   Tokens even those which are not linked. (default: `false`)
     * @param document - Return the Document instance rather than the PlaceableObject (default: `false`)
     * @returns An array of Token instances in the current Scene which reference this Actor.
     */
    getActiveTokens<ReturnDocument extends boolean = false>(
      linked?: boolean,
      document?: ReturnDocument,
    ): ReturnDocument extends true ? TokenDocument.ConfiguredInstance[] : Token.ConfiguredInstance[];

    /**
     * Get all ActiveEffects that may apply to this Actor.
     * If CONFIG.ActiveEffect.legacyTransferral is true, this is equivalent to actor.effects.contents.
     * If CONFIG.ActiveEffect.legacyTransferral is false, this will also return all the transferred ActiveEffects on any
     * of the Actor's owned Items.
     */
    allApplicableEffects(): Generator<ActiveEffect.ConfiguredInstance>;

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Actor
     * @remarks defaults to this.system, but provided as object for flexible overrides
     */
    getRollData(): object;

    /**
     * Create a new TokenData object which can be used to create a Token representation of the Actor.
     * @param data - Additional data, such as x, y, rotation, etc. for the created token data (default: `{}`)
     * @returns The created TokenData instance
     */
    getTokenDocument(data?: foundry.documents.BaseToken.ConstructorData): Promise<TokenDocument.ConfiguredInstance>;

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
    modifyTokenAttribute(attribute: string, value: number, isDelta: boolean, isBar: boolean): Promise<this | undefined>;

    override prepareData(): void;

    override prepareEmbeddedDocuments(): void;

    /**
     * Roll initiative for all Combatants in the currently active Combat encounter which are associated with this Actor.
     * If viewing a full Actor document, all Tokens which map to that actor will be targeted for initiative rolls.
     * If viewing a synthetic Token actor, only that particular Token will be targeted for an initiative roll.
     *
     * @param options - Configuration for how initiative for this Actor is rolled.
     * @returns A promise which resolves to the Combat document once rolls are complete.
     */
    rollInitiative(options?: Actor.RollInitiativeOptions): Promise<void>;

    /**
     * Toggle a configured status effect for the Actor.
     * @param statusId  - A status effect ID defined in CONFIG.statusEffects
     * @param options   - Additional options which modify how the effect is created
     * @returns A promise which resolves to one of the following values:
     *            - ActiveEffect if a new effect need to be created
     *            - true if was already an existing effect
     *            - false if an existing effect needed to be removed
     *            - undefined if no changes need to be made
     */
    toggleStatusEffect(
      statusId: string,
      options?: InexactPartial<{
        /** Force the effect to be active or inactive regardless of its current state. */
        active: boolean;
        /** Display the toggled effect as an overlay. Default `false`. */
        overlay: boolean;
      }>,
    ): Promise<ActiveEffect.ConfiguredInstance | boolean | undefined>;

    /**
     * Request wildcard token images from the server and return them.
     * @param actorId - The actor whose prototype token contains the wildcard image path.
     * @internal
     */
    protected static _requestTokenImages(
      actorId: string,
      options?: {
        /** The name of the compendium the actor is in. */
        pack: string;
      },
    ): Promise<string[]>;

    /**
     * Get this actor's dependent tokens.
     * If the actor is a synthetic token actor, only the exact Token which it represents will be returned.
     */
    getDependentTokens(
      options?: InexactPartial<{
        /**
         * A single Scene, or list of Scenes to filter by.
         */
        scenes: Scene | Scene[];
        /**
         * Limit the results to tokens that are linked to the actor.
         * @defaultValue `false`
         */
        linked: boolean;
      }>,
    ): TokenDocument.ConfiguredInstance[];

    /**
     * Register a token as a dependent of this actor.
     * @param token - The Token
     */
    protected _registerDependantToken(token: TokenDocument): void;

    /**
     * Remove a token from this actor's dependents.
     * @param token - The Token
     */
    protected _unregisterDependentToken(token: TokenDocument): void;

    /**
     * Prune a whole scene from this actor's dependent tokens.
     * @param scene - The scene
     */
    protected _unregisterDependentScene(scene: Scene): void;

    /**
     * @privateRemarks _preCreate, _onUpdate, onCreateDescendantDocuments, onUpdateDescendantDocuments, and _onDeleteDescendentDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Additional workflows to perform when any descendant document within this Actor changes.
     * @internal
     */
    protected _onEmbeddedDocumentChange(): void;

    /**
     * Update the active TokenDocument instances which represent this Actor.
     * @param update  - The update delta.
     * @param options - The update context.
     */
    protected _updateDependentTokens(
      update: DeepPartial<TokenDocument["_source"]>,
      options: Document.OnUpdateOptions<"Token">,
    ): void;
  }
}
