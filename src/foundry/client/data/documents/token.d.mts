import type { DeepPartial, InexactPartial } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type { SchemaField } from "../../../common/data/fields.d.mts";
import type BaseToken from "../../../common/documents/token.d.mts";

declare global {
  namespace TokenDocument {
    type Metadata = Document.MetadataFor<TokenDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Token">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Token">;

    type ObjectClass = Document.ConfiguredObjectClassForName<"Token">;
    type ObjectInstance = Document.ConfiguredObjectInstanceForName<"Token">;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      extends Document.Database.Operations<
        TokenDocument,
        {},
        {
          previousActorId: string | null;
          animate: boolean;
          _priorRegions: Record<string, string[]>;
          _priorPosition: Record<string, { x: number; y: number; elevation: number }>;
          teleport: boolean;
          forced: boolean;
        },
        {}
      > {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    // Helpful aliases
    type ConstructorData = BaseToken.ConstructorData;
    type UpdateData = BaseToken.UpdateData;
    type Schema = BaseToken.Schema;
    type Source = BaseToken.Source;
  }

  /**
   * The client-side Token document which extends the common BaseToken model.
   *
   * @see {@link Scene}               The Scene document type which contains Token embedded documents
   * @see {@link TokenConfig}      The Token configuration application
   */
  class TokenDocument extends CanvasDocumentMixin(foundry.documents.BaseToken) {
    static override metadata: TokenDocument.Metadata;

    static get implementation(): TokenDocument.ConfiguredClass;

    /**
     * A singleton collection which holds a reference to the synthetic token actor by its base actor's ID.
     */
    actors(): Collection<Actor.ConfiguredInstance>;

    /**
     * A lazily evaluated reference to the Actor this Token modifies.
     * If actorLink is true, then the document is the primary Actor document.
     * Otherwise the Actor document is a synthetic (ephemeral) document constructed using the Token's ActorDelta.
     */
    get actor(): Actor.ConfiguredInstance | null;

    /**
     * A reference to the base, World-level Actor this token represents.
     */
    get baseActor(): Actor | undefined;

    /**
     * An indicator for whether or not the current User has full control over this Token document.
     */
    get isOwner(): boolean;

    /**
     * A convenient reference for whether this TokenDocument is linked to the Actor it represents, or is a synthetic copy
     */
    get isLinked(): boolean;

    /**
     * Does this TokenDocument have the SECRET disposition and is the current user lacking the necessary permissions
     * that would reveal this secret?
     */
    get isSecret(): boolean;

    /**
     * Return a reference to a Combatant that represents this Token, if one is present in the current encounter.
     */
    get combatant(): Combatant.ConfiguredInstance | null;

    /**
     * An indicator for whether or not this Token is currently involved in the active combat encounter.
     */
    get inCombat(): boolean;

    /**
     * The Regions this Token is currently in.
     */
    regions: Set<RegionDocument.ConfiguredInstance> | null;

    // TODO: Same as `DataModel._initialize`
    protected override _initialize(options?: any): void;

    override prepareBaseData(): void;

    override prepareEmbeddedDocuments(): void;

    override prepareDerivedData(): void;

    /**
     * Infer the subject texture path to use for a token ring.
     */
    protected _inferRingSubjectTexture(): string;

    /**
     * Prepare detection modes which are available to the Token.
     * Ensure that every Token has the basic sight detection mode configured.
     */
    protected _prepareDetectionModes(): void;

    /**
     * A helper method to retrieve the underlying data behind one of the Token's attribute bars
     * @param barName     - The named bar to retrieve the attribute for
     * @returns The attribute displayed on the Token bar, if any
     */
    getBarAttribute(
      barName: string,
      options?: InexactPartial<{
        /**
         * An alternative attribute path to get instead of the default one
         */
        alternative: string;
      }>,
    ): SingleAttributeBar | ObjectAttributeBar | null;

    /**
     * Test whether a Token has a specific status effect.
     * @param statusId - The status effect ID as defined in CONFIG.statusEffects
     * @returns Does the Actor of the Token have this status effect?
     */
    hasStatusEffect(statusId: string): boolean;

    /**
     * Add or remove this Token from a Combat encounter.
     * @param options - Additional options passed to TokenDocument.createCombatants or
     *                  TokenDocument.deleteCombatants
     *                  Default: `{}`
     *  @returns Is this Token now an active Combatant?
     */
    toggleCombatant({
      active,
      ...options
    }?: InexactPartial<
      CreateCombatantOptions & {
        /**
         * Require this token to be an active Combatant or to be removed.
         * Otherwise, the current combat state of the Token is toggled.
         */
        active: boolean;
      }
    >): Promise<boolean>;

    /**
     * Create or remove Combatants for an array of provided Token objects.
     * @param tokens  - The tokens which should be added to the Combat
     * @param options - Options which modify the toggle operation
     *                  Default: `{}`
     * @returns An array of created Combatant documents
     */
    static createCombatants(tokens: TokenDocument[], options?: CreateCombatantOptions): Promise<Combatant[]>;

    /**
     * Remove Combatants for the array of provided Tokens.
     * @param tokens  - The tokens which should removed from the Combat
     * @param options - Options which modify the operation
     *                  Default: `{}`
     * @returns An array of deleted Combatant documents
     */
    static deleteCombatants(tokens: TokenDocument[], options?: CreateCombatantOptions): Promise<Combatant[]>;

    /**
     * Convenience method to change a token vision mode.
     * @param visionMode - The vision mode to apply to this token.
     * @param defaults   - If the vision mode should be updated with its defaults.
     *                     Default = `true`
     */
    updateVisionMode(
      visionMode: typeof CONFIG.Canvas.visionModes,
      defaults?: boolean,
    ): Promise<ReturnType<this["update"]>>;

    override getEmbeddedCollection<DocType extends Document.Type>(
      embeddedName: DocType,
    ): Collection<Document.ConfiguredInstanceForName<DocType>>;

    /**
     * @privateRemarks _onCreate, _preUpdate, _onUpdate, _onDelete, preCreateOperation, _preUpdateOperation, _onCreateOperation,
     * _onUpdateOperation, _onDeleteOperation, _preCreateDescendantDocuments, _preUpdateDescendantDocuments, _preDeleteDescendantDocuments,
     * _onUpdateDescendantDocuments, and _onDeleteDescendantDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Is to Token document updated such that the Regions the Token is contained in may change?
     * Called as part of the preUpdate workflow.
     * @param changes - The changes.
     * @returns Could this Token update change Region containment?
     */

    protected _couldRegionsChange(
      changes: SchemaField.InnerAssignmentType<foundry.documents.BaseToken.Schema>,
    ): boolean;

    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     */
    protected _onUpdateBaseActor(
      update?: DeepPartial<Actor.ConfiguredInstance["_source"]>,
      options?: Document.OnUpdateOptions<"Actor">,
    ): void;

    /**
     * Whenever the token's actor delta changes, or the base actor changes, perform associated refreshes.
     * @param update  - The update delta.
     * @param options - The options provided to the update.
     */
    protected _onRelatedUpdate(
      update?: DeepPartial<Actor.ConfiguredInstance["_source"]>,
      /** @privateRemarks foundry calls this field operation
       * but it's being passed options (and then ignores them)
       */
      operation?: Document.OnUpdateOptions<"Actor">,
    ): void;

    /**
     * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
     * @param _path - (default: `[]`)
     */
    // TODO: There's some very complex handling for non-datamodel Actor system implementations if we want
    static getTrackedAttributes(
      data?: Actor.ConfiguredInstance["system"],
      _path?: string[],
    ): TrackedAttributesDescription;

    /**
     * Retrieve an Array of attribute choices from a plain object.
     * @param schema - The schema to explore for attributes.
     */
    protected static _getTrackedAttributesFromObject(data: object, _path?: string[]): TrackedAttributesDescription;

    /**
     * Retrieve an Array of attribute choices from a SchemaField.
     * @param schema - The schema to explore for attributes.
     */
    protected static _getTrackedAttributesFromSchema(
      schema: foundry.data.fields.SchemaField.Any,
      _path?: string[],
    ): TrackedAttributesDescription;

    /**
     * Retrieve any configured attributes for a given Actor type.
     * @param type - The Actor type.
     */
    static _getConfiguredTrackedAttributes(type: string): TrackedAttributesDescription | void;

    /**
     * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
     * @param attributes - The tracked attributes which can be chosen from
     * @returns A nested object of attribute choices to display
     */
    static getTrackedAttributeChoices(attributes?: TrackedAttributesDescription): Record<string, string[]>;

    /**
     * @deprecated since v11
     * @remarks `"TokenDocument#getActor has been deprecated. Please use the`
     * `TokenDocument#actor getter to retrieve the Actor instance that the TokenDocument represents, or use`
     * `TokenDocument#delta#apply to generate a new synthetic Actor instance."`
     */
    getActor(): Actor.ConfiguredInstance;

    /**
     * @deprecated since v11
     */
    get actorData(): this["delta"]["_source"];

    /**
     * @deprecated since v11
     */
    set actorData(actorData: this["delta"]["_source"]);

    /**
     * A helper function to toggle a status effect which includes an Active Effect template
     * @param effectData - The Active Effect data, including statusId
     * @param options    - Options to configure application of the Active Effect
     *                     (default: `{}`)
     * @returns Whether the Active Effect is now on or off
     * @deprecated since v12
     * @remarks `TokenDocument#toggleActiveEffect is deprecated in favor of Actor#toggleStatusEffect"`
     */
    toggleActiveEffect(
      effectData: CONFIG.StatusEffect,
      options?: InexactPartial<ToggleActiveEffectOptions>,
    ): Promise<boolean>;
  }

  // The getBarAttribute monkeypatch is simply inside the data model definition at `src\foundry\common\data\data.d.mts`

  interface TrackedAttributesDescription {
    /** A list of property path arrays to attributes with both a value and a max property. */
    bar: string[][];
    /** A list of property path arrays to attributes that have only a value property. */
    value: string[][];
  }

  interface CreateCombatantOptions {
    /**
     * A specific Combat instance which should be modified. If undefined,
     * the current active combat will be modified if one exists. Otherwise, a new
     * Combat encounter will be created if the requesting user is a Gamemaster.
     */
    combat?: Combat | undefined;
  }
}

interface SingleAttributeBar {
  type: "value";
  attribute: string;
  value: number;
  editable: boolean;
}

interface ObjectAttributeBar {
  type: "bar";
  attribute: string;
  value: number;
  max: number;
  editable: boolean;
}

interface ToggleActiveEffectOptions {
  /**
   * Should the Active Effect icon be displayed as an overlay on the token?
   * @defaultValue `false`
   */
  overlay: boolean;

  /** Force a certain active state for the effect. */
  active: boolean;
}
