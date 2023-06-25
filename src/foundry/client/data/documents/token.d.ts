// FOUNDRY_VERSION: 10.291

import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs.js";
import type BaseActiveEffect from "../../../common/documents/active-effect.mjs";
import type BaseActor from "../../../common/documents/actor.mjs";
import type BaseToken from "../../../common/documents/token.mjs";

declare global {
  /**
   * The client-side Token document which extends the common BaseToken document model.
   *
   * @see {@link Scene}          The Scene document type which contains Token documents
   * @see {@link TokenConfig}    The Token configuration application
   */
  class TokenDocument extends CanvasDocumentMixin(BaseToken) {
    constructor(
      data?: ConstructorParameters<ConstructorOf<BaseToken>>[0],
      context?: ConstructorParameters<ConstructorOf<BaseToken>>[1]
    );

    /**
     * A cached reference to the Actor document that this Token modifies.
     * This may be a "synthetic" unlinked Token Actor which does not exist in the World.
     * @internal
     */
    protected _actor: InstanceType<ConfiguredDocumentClass<typeof Actor>> | null;

    /**
     * A lazily evaluated reference to the Actor this Token modifies.
     * If actorLink is true, then the document is the primary Actor document.
     * Otherwise, the Actor document is a synthetic (ephemeral) document constructed using the Token's actorData.
     */
    get actor(): InstanceType<ConfiguredDocumentClass<typeof Actor>> | null;

    /**
     * An indicator for whether the current User has full control over this Token document.
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
     * An indicator for whether this Token is currently involved in the active combat encounter.
     */
    get inCombat(): boolean;

    /**
     * Define a sort order for this TokenDocument.
     * This controls its rendering order in the PrimaryCanvasGroup relative to siblings at the same elevation.
     * In the future this will be replaced with a persisted database field for permanent adjustment of token stacking.
     * In case of ties, Tokens will be sorted above other types of objects.
     */
    get sort(): number;

    set sort(value: number);

    /** @internal */
    #sort: number;

    override prepareBaseData(): void;

    /**
     * Prepare detection modes which are available to the Token.
     * Ensure that every Token has the basic sight detection mode configured.
     * @internal
     */
    protected _prepareDetectionModes(): void;

    override clone(
      data?: Parameters<BaseToken["clone"]>[0],
      options?: Parameters<BaseToken["clone"]>[1]
    ): this | Promise<this>;

    /**
     * Create a synthetic Actor using a provided Token instance
     * If the Token data is linked, return the true Actor document
     * If the Token data is not linked, create a synthetic Actor using the Token's actorData override
     */
    getActor(): InstanceType<ConfiguredDocumentClass<typeof Actor>>;

    /**
     * A helper method to retrieve the underlying data behind one of the Token's attribute bars
     * @param barName       - The named bar to retrieve the attribute for
     * @param alternative   - An alternative attribute path to get instead of the default one
     * @returns The attribute displayed on the Token bar, if any
     */
    getBarAttribute(
      barName: string,
      { alternative }?: { alternative?: string }
    ): SingleAttributeBar | ObjectAttributeBar | null;

    /**
     * A helper function to toggle a status effect which includes an Active Effect template
     * @param effectData  - The Active Effect data, including statusId
     * @param options     - Options to configure application of the Active Effect
     *                    (default: `{}`)
     * @returns Whether the Active Effect is now on or off
     */
    toggleActiveEffect(effectData: StatusEffect, options?: ToggleActiveEffectOptions): Promise<boolean>;

    /**
     * Test whether a Token has a specific status effect.
     * @param statusId    - The status effect ID as defined in CONFIG.statusEffects
     * @returns Does the Token have this status effect?
     */
    hasStatusEffect(statusId: string): boolean;

    /**
     * Convenience method to change a token vision mode.
     * @param visionMode    - The vision mode to apply to this token.
     * @param defaults      - If the vision mode should be updated with its defaults.
     *                      (default: `true`)
     */
    updateVisionMode(visionMode: string, defaults: boolean): Promise<this>;

    /**
     * Redirect updates to a synthetic Token Actor to instead update the tokenData override object.
     * Once an attribute in the Token has been overridden, it must always remain overridden.
     *
     * @param update    - The provided differential update data which should update the Token Actor
     * @param options   - Provided options which modify the update request
     * @returns The updated un-linked Actor instance
     */
    modifyActorDocument(
      update: Parameters<InstanceType<ConfiguredDocumentClass<typeof Actor>>["update"]>[0],
      options: Parameters<this["update"]>[1]
    ): Promise<[this["actor"]]>;

    override getEmbeddedCollection(embeddedName: "Item"): ActorData["items"];
    getEmbeddedCollection(embeddedName: "ActiveEffect"): ActorData["effects"];

    /**
     * Redirect creation of Documents within a synthetic Token Actor to instead update the tokenData override object.
     * @param embeddedName    - The named embedded Document type being modified
     * @param data            - The provided initial data with which to create the embedded Documents
     * @param options         - Provided options which modify the creation request
     * @returns The created Embedded Document instances
     */
    createActorEmbeddedDocuments(
      embeddedName: string,
      data: InstanceType<typeof foundry.abstract.DataModel>[],
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<typeof foundry.abstract.DataModel>[]>;

    /**
     * Redirect updating of Documents within a synthetic Token Actor to instead update the tokenData override object.
     * @param embeddedName    - The named embedded Document type being modified
     * @param updates         - The provided differential data with which to update the embedded Documents
     * @param options         - Provided options which modify the update request
     * @returns The updated Embedded Document instances
     */
    updateActorEmbeddedDocuments(
      embeddedName: string,
      data: InstanceType<typeof foundry.abstract.DataModel>[],
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<typeof foundry.abstract.DataModel>[]>;

    /**
     * Redirect deletion of Documents within a synthetic Token Actor to instead update the tokenData override object.
     * @param embeddedName    - The named embedded Document type being deleted
     * @param ids             - The IDs of Documents to delete
     * @param options         - Provided options which modify the deletion request
     * @returns The deleted Embedded Document instances
     */
    deleteActorEmbeddedDocuments(
      embeddedName: string,
      ids: string[],
      options: Parameters<this["update"]>[1]
    ): Promise<InstanceType<typeof foundry.abstract.DataModel>[]>;

    /** @internal */
    protected override _preUpdate(
      data: Parameters<BaseToken["_preUpdate"]>[0],
      options: DocumentModificationOptions,
      user: InstanceType<ConfiguredDocumentClass<typeof User>>
    ): Promise<void>;

    /**
     * When the Actor data overrides change for an un-linked Token Actor, simulate the pre-update process.
     * @internal
     */
    protected _preUpdateTokenActor(
      data: Parameters<BaseActor["_preUpdate"]>[0],
      options: DocumentModificationOptions,
      user: InstanceType<ConfiguredDocumentClass<typeof User>>
    ): Promise<void>;

    /** @internal */
    protected _onUpdate(
      data: Parameters<BaseToken["_onUpdate"]>[0],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * When the base Actor for a TokenDocument changes, we may need to update its Actor instance
     * @param update - (default: `{}`)
     * @internal
     */
    protected _onUpdateBaseActor(
      update?: Parameters<BaseActor["_onUpdate"]>[0],
      options?: Parameters<BaseActor["update"]>[1]
    ): void;

    /**
     * When the Actor data overrides change for an un-linked Token Actor, simulate the post-update process.
     * @internal
     */
    protected _onUpdateTokenActor(
      data: Parameters<BaseActor["_onUpdate"]>[0],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Get an Array of attribute choices which could be tracked for Actors in the Combat Tracker
     * @param _path - (default: `[]`)
     */
    static getTrackedAttributes(data?: ActorData, _path?: string[]): TrackedAttributes;

    /**
     * Inspect the Actor data model and identify the set of attributes which could be used for a Token Bar
     * @param attributes    - The tracked attributes which can be chosen from
     * @returns A nested object of attribute choices to display
     */
    static getTrackedAttributeChoices(attributes: TrackedAttributes): Record<string, string[]>;
  }
}

declare interface PrototypeToken {
  getBarAttribute(
    barName: Parameters<TokenDocument["getBarAttribute"]>[0],
    { alternative }?: Parameters<TokenDocument["getBarAttribute"]>[1]
  ): ReturnType<TokenDocument["getBarAttribute"]>;
}

/**
 * @deprecated since v10
 * @see PrototypeToken
 */
declare class PrototypeTokenDocument extends PrototypeToken {}

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

export type StatusEffect = BaseActiveEffect.ConstructorData & { id: string };
