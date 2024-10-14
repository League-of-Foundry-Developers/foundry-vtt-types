import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { BaseUser } from "../../../common/documents/module.d.mts";

declare global {
  namespace Item {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Item">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"Item">;
  }

  /**
   * The client-side Item document which extends the common BaseItem abstraction.
   * Each Item document contains ItemData which defines its data schema.
   *
   * @see {@link Items}            The world-level collection of Item documents
   * @see {@link ItemSheet}     The Item configuration application
   *
   * @param data    - Initial data provided to construct the Item document
   * @param context - The document context, see {@link foundry.abstract.Document}
   */
  class Item extends ClientDocumentMixin(foundry.documents.BaseItem) {
    /**
     * A convenience alias of Item#parent which is more semantically intuitive
     */
    get actor(): this["parent"];

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * A convenience alias of Item#isEmbedded which is preserves legacy support
     */
    get isOwned(): this["isEmbedded"];

    /**
     * Return an array of the Active Effect instances which originated from this Item.
     * The returned instances are the ActiveEffect instances which exist on the Item itself.
     */
    get transferredEffects(): ReturnType<this["effects"]["filter"]>;

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Item
     * @remarks defaults to this.system, but provided as object for flexible overrides
     */
    getRollData(): object;

    protected override _preCreate(
      data: foundry.documents.BaseItem.ConstructorData,
      options: DocumentModificationOptions,
      user: BaseUser,
    ): Promise<boolean | void>;

    /**
     * @privateRemarks _onCreateDocuments and _onDeleteDocuments are overridden but left off because the signature doesn't change and unnecessarily adds to the type complexity.
     */
  }
}
