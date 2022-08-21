import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs.js";
import type { ActiveEffectDataConstructorData } from "../../../common/data/data.mjs/activeEffectData";
import * as data from "../../../common/data/data.mjs/index.js";
import type { PrototypeTokenDataConstructorData } from "../../../common/data/data.mjs/prototypeTokenData";

declare global {
  /**
   * The client-side Token document which extends the common BaseToken model.
   * Each Token document contains TokenData which defines its data schema.
   *
   * @see {@link data.TokenData}                The Token data schema
   * @see {@link documents.Scene}               The Scene document type which contains Token embedded documents
   * @see {@link applications.TokenConfig}      The Token configuration application
   */
  class TokenDocument extends CanvasDocumentMixin(foundry.documents.BaseToken) {
    /**
     * @param data    - Initial data provided to construct the Token document
     *                  (default: `{}`)
     * @param context - The parent Scene document to which this Token belongs
     */
    constructor(
      data?: ConstructorParameters<ConstructorOf<foundry.documents.BaseToken>>[0],
      context?: ConstructorParameters<ConstructorOf<foundry.documents.BaseToken>>[1]
    );

    /**
     * A cached reference to the Actor document that this Token modifies.
     * This may be a "synthetic" unlinked Token Actor which does not exist in the World.
     */
    protected _actor: InstanceType<ConfiguredDocumentClass<typeof Actor>> | null;

    /**
     * A lazily evaluated reference to the Actor this Token modifies.
     * If actorLink is true, then the document is the primary Actor document.
     * Otherwise the Actor document is a synthetic (ephemeral) document constructed using the Token's actorData.
     */
    get actor(): InstanceType<ConfiguredDocumentClass<typeof Actor>> | null;

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
    get combatant(): InstanceType<ConfiguredDocumentClass<typeof Combatant>> | null;

    /**
     * An indicator for whether or not this Token is currently involved in the active combat encounter.
     */
    get inCombat(): boolean;

    /**
     * Is the Token currently hidden from player view?
     */
    get hidden(): boolean;

    /**
     * @param data    - (default: `{}`, unused)
     * @param options - (default: `{}`, unused)
     */
    override clone(
      data?: Parameters<foundry.documents.BaseToken["clone"]>[0],
      options?: Parameters<foundry.documents.BaseToken["clone"]>[1]
    ): TemporaryDocument<this>;

    /**
     * Create a synthetic Actor using a provided Token instance
     * If the Token data is linked, return the true Actor document
     * If the Token data is not linked, create a synthetic Actor using the Token's actorData override
     */
    getActor(): InstanceType<ConfiguredDocumentClass<typeof Actor>> | null;

    /**
     * A helper method to retrieve the underlying data behind one of the Token's attribute bars
     * @param barName     - The named bar to retrieve the attribute for
     * @param alternative - An alternative attribute path to get instead of the default one
     * @returns The attribute displayed on the Token bar, if any
     */
    getBarAttribute(
      barName: string,
      { alternative }?: { alternative?: string }
    ): SingleAttributeBar | ObjectAttributeBar | null;

    /**
     * A helper function to toggle a status effect which includes an Active Effect template
     * @param effectData - The Active Effect data, including statusId
     * @param options    - Options to configure application of the Active Effect
     *                     (default: `{}`)
     * @returns Whether the Active Effect is now on or off
     */
    toggleActiveEffect(effectData: StatusEffect, options?: ToggleActiveEffectOptions | undefined): Promise<boolean>;

    /**
     * Redirect updates to a synthetic Token Actor to instead update the tokenData override object.
     * Once an attribute in the Token has been overridden, it must always remain overridden.
     *
     * @param update  - The provided differential update data which should update the Token Actor
     * @param options - Provided options which modify the update request
     * @returns The updated un-linked Actor instance
     */
    modifyActorDocument(
      update: Parameters<InstanceType<ConfiguredDocumentClass<typeof Actor>>["update"]>[0],
      options: Parameters<this["update"]>[1]
    ): Promise<[this["actor"]]>;

    override getEmbeddedCollection(embeddedName: "Item"): data.ActorData["items"];
    getEmbeddedCollection(embeddedName: "ActiveEffect"): data.ActorData["effects"];

    /**
     * Redirect creation of Documents within a synthetic Token Actor to instead update the tokenData override object.
     * @param embeddedName - The named embedded Document type being modified
     * @param data         - The provided initial data with which to create the embedded Documents
     * @param options      - Provided options which modify the creation request
     * @returns The created Embedded Document instances
     */
    createActorEmbeddedDocuments(
      embeddedName: "Item",
      data: Array<ConstructorParameters<ConfiguredDocumentClass<typeof Item>>[0] | Record<string, unknown>>,
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Item>>[]>;
    createActorEmbeddedDocuments(
      embeddedName: "ActiveEffect",
      data: Array<ConstructorParameters<ConfiguredDocumentClass<typeof ActiveEffect>>[0] | Record<string, unknown>>,
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>[]>;

    /**
     * Redirect updating of Documents within a synthetic Token Actor to instead update the tokenData override object.
     * @param embeddedName - The named embedded Document type being modified
     * @param updates      - The provided differential data with which to update the embedded Documents
     * @param options      - Provided options which modify the update request
     * @returns The updated Embedded Document instances
     */
    updateActorEmbeddedDocuments(
      embeddedName: "Item",
      updates: Array<ConstructorParameters<ConfiguredDocumentClass<typeof Item>>[0] | Record<string, unknown>>,
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Item>>[]>;
    updateActorEmbeddedDocuments(
      embeddedName: "ActiveEffect",
      updates: Array<ConstructorParameters<ConfiguredDocumentClass<typeof ActiveEffect>>[0] | Record<string, unknown>>,
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>[]>;

    /**
     * Redirect deletion of Documents within a synthetic Token Actor to instead update the tokenData override object.
     * @param embeddedName - The named embedded Document type being deleted
     * @param ids          - The IDs of Documents to delete
     * @param options      - Provided options which modify the deletion request
     * @returns The deleted Embedded Document instances
     */
    deleteActorEmbeddedDocuments(
      embeddedName: "Item",
      ids: string[],
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Item>>[]>;
    deleteActorEmbeddedDocuments(
      embeddedName: "ActiveEffect",
      ids: string[],
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>[]>;

    protected override _preUpdate(
      data: Parameters<foundry.documents.BaseToken["_preUpdate"]>[0],
      options: DocumentModificationOptions,
      user: InstanceType<ConfiguredDocumentClass<typeof User>>
    ): Promise<void>;

    /**
     * When the Actor data overrides change for an un-linked Token Actor, simulate the pre-update process.
     * @internal
     */
    protected _preUpdateTokenActor(
      data: Parameters<foundry.documents.BaseActor["_preUpdate"]>[0],
      options: DocumentModificationOptions,
      user: InstanceType<ConfiguredDocumentClass<typeof User>>
    ): Promise<void>;

    protected override _onUpdate(
      data: Parameters<foundry.documents.BaseToken["_onUpdate"]>[0],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     * @param update - (default: `{}`)
     * @internal
     */
    protected _onUpdateBaseActor(
      update?: Parameters<foundry.documents.BaseActor["_onUpdate"]>[0],
      options?: Parameters<foundry.data.ActorData["update"]>[1]
    ): void;

    /**
     * When the Actor data overrides change for an un-linked Token Actor, simulate the post-update process.
     * @internal
     */
    protected _onUpdateTokenActor(
      data: Parameters<foundry.documents.BaseActor["_onUpdate"]>[0],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
     * @param _path - (default: `[]`)
     */
    static getTrackedAttributes(
      data?: InstanceType<ConfiguredDocumentClass<typeof Actor>>["data"]["data"],
      _path?: string[]
    ): TrackedAttributes;

    /**
     * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
     */
    static getTrackedAttributeChoices(attributes?: TrackedAttributes): Record<string, string[]>;
  }

  /**
   * An extended Document definition used specifically
   * This ensures that the PrototypeTokenData schema is used instead of the standard TokenData.
   * This exists specifically for prototype Token configuration in the TokenConfig app and should not be used otherwise.
   * @internal
   * @remarks The types for this are incorrect, in particular everything related to the data should use
   * {@link foundry.data.PrototypeTokenData} instead of {@link foundry.data.TokenData}. However, with the current approach
   * to type documents, we don't see a way to do this. This class is just added for reference. As the documentation above
   * says, don't use it (there really shouldn't be a need to do so).
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  class PrototypeTokenDocument extends TokenDocument {
    static get schema(): typeof foundry.data.PrototypeTokenData;

    override update(
      data?: DeepPartial<PrototypeTokenDataConstructorData> | undefined,
      context?: (DocumentModificationContext & foundry.utils.MergeObjectOptions) | undefined
    ): Promise<this | undefined>;
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

interface TrackedAttributes {
  bar: string[][];
  value: string[][];
}

interface ToggleActiveEffectOptions {
  /**
   * Should the Active Effect icon be displayed as an overlay on the token?
   * @defaultValue `false`
   */
  overlay?: boolean | undefined;

  /** Force a certain active state for the effect. */
  active?: boolean | undefined;
}

export type StatusEffect = ActiveEffectDataConstructorData & { id: string };
