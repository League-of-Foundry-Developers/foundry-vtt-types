import type { DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  namespace TokenDocument {
    type ConfiguredClass = Document.ConfiguredClassForName<"Token">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    // TODO(LukeAbby): This causes a circularity that's likely latent.
    // Look into this.
    // type ConfiguredInstance = ConfiguredDocumentInstanceForName<"Token">;

    type ObjectClass = Document.ConfiguredObjectClassForName<"Token">;
    type ObjectInstance = Document.ConfiguredObjectInstanceForName<"Token">;
  }

  /**
   * The client-side Token document which extends the common BaseToken model.
   *
   * @see {@link Scene}               The Scene document type which contains Token embedded documents
   * @see {@link TokenConfig}      The Token configuration application
   */
  class TokenDocument extends CanvasDocumentMixin(foundry.documents.BaseToken) {
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
     * An indicator for whether or not the current User has full control over this Token document.
     */
    get isOwner(): boolean;

    /**
     * A convenient reference for whether this TokenDocument is linked to the Actor it represents, or is a synthetic copy
     */
    get isLinked(): boolean;

    /**
     * Return a reference to a Combatant that represents this Token, if one is present in the current encounter.
     */
    get combatant(): Combatant.ConfiguredInstance | null;

    /**
     * An indicator for whether or not this Token is currently involved in the active combat encounter.
     */
    get inCombat(): boolean;

    /**
     * Define a sort order for this TokenDocument.
     * This controls its rendering order in the PrimaryCanvasGroup relative to siblings at the same elevation.
     * In the future this will be replaced with a persisted database field for permanent adjustment of token stacking.
     * In case of ties, Tokens will be sorted above other types of objects.
     */
    get sort(): number;

    set sort(value);

    protected override _initialize(options?: any): void;
    protected override _initialize(): void;

    override prepareBaseData(): void;

    override prepareEmbeddedDocuments(): void;

    /**
     * Prepare detection modes which are available to the Token.
     * Ensure that every Token has the basic sight detection mode configured.
     */
    _prepareDetectionModes(): void;

    /**
     * A helper method to retrieve the underlying data behind one of the Token's attribute bars
     * @param barName     - The named bar to retrieve the attribute for
     * @returns The attribute displayed on the Token bar, if any
     */
    getBarAttribute(
      barName: string,
      options?: {
        /**
         * An alternative attribute path to get instead of the default one
         */
        alternative?: string;
      },
    ): SingleAttributeBar | ObjectAttributeBar | null;

    /**
     * A helper function to toggle a status effect which includes an Active Effect template
     * @param effectData - The Active Effect data, including statusId
     * @param options    - Options to configure application of the Active Effect
     *                     (default: `{}`)
     * @returns Whether the Active Effect is now on or off
     */
    toggleActiveEffect(
      effectData: StatusEffect,
      options?: InexactPartial<ToggleActiveEffectOptions> | undefined,
    ): Promise<boolean>;

    /**
     * The status effect ID as defined in CONFIG.statusEffects
     * @param statusId - Does the Token have this status effect?
     */
    hasStatusEffect(statusId: string): boolean;

    /**
     * Convenience method to change a token vision mode.
     * @param visionMode - The vision mode to apply to this token.
     * @param defaults   - If the vision mode should be updated with its defaults.
     */
    updateVisionMode(
      visionMode: typeof CONFIG.Canvas.visionModes,
      defaults?: boolean,
    ): Promise<ReturnType<this["update"]>>;

    /**
     * Redirect updates to a synthetic Token Actor to instead update the tokenData override object.
     * Once an attribute in the Token has been overridden, it must always remain overridden.
     *
     * @param update  - The provided differential update data which should update the Token Actor
     * @param options - Provided options which modify the update request
     * @returns The updated un-linked Actor instance
     */
    modifyActorDocument(
      update: Parameters<Actor.ConfiguredInstance["update"]>[0],
      options: Parameters<this["update"]>[1],
    ): Promise<[this["actor"]]>;

    override getEmbeddedCollection<DocType extends Document.Type>(
      embeddedName: DocType,
    ): Collection<Document.ConfiguredInstanceForName<DocType>>;

    protected override _preUpdate(
      data: foundry.documents.BaseToken.UpdateData,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser,
    ): Promise<void>;

    protected override _onUpdate(
      data: foundry.documents.BaseToken.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _preCreateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      data: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _preUpdateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      changes: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _preDeleteDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      ids: string[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onCreateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      data: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      changes: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      ids: string,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     */
    protected _onUpdateBaseActor(
      update?: DeepPartial<Actor.ConfiguredInstance["_source"]>,
      options?: Document.ModificationContext<Document.Any | null>,
    ): void;

    /**
     * Whenever the token's actor delta changes, or the base actor changes, perform associated refreshes.
     * @param update  - The update delta.
     * @param options - The options provided to the update.
     */
    protected _onRelatedUpdate(
      update?: DeepPartial<Actor.ConfiguredInstance["_source"]>,
      options?: Document.ModificationContext<Document.Any | null>,
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
    set actorData(actorData);
  }

  // The getBarAttribute monkeypatch is simply inside the data model definition at `src\foundry\common\data\data.d.mts`

  interface TrackedAttributesDescription {
    /** A list of property path arrays to attributes with both a value and a max property. */
    bar: string[][];
    /** A list of property path arrays to attributes that have only a value property. */
    value: string[][];
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

export type StatusEffect = foundry.documents.BaseActiveEffect.ConstructorData & { id: string };
