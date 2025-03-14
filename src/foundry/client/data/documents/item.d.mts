import type Document from "../../../common/abstract/document.d.mts";
import type BaseItem from "../../../common/documents/item.d.mts";

declare global {
  namespace Item {
    type Metadata = Document.MetadataFor<Item>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Item">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Item">;

    interface DatabaseOperations extends Document.Database.Operations<Item> {}

    // Helpful aliases
    type TypeNames = BaseItem.TypeNames;
    type ConstructorData = BaseItem.ConstructorData;
    type UpdateData = BaseItem.UpdateData;
    type Schema = BaseItem.Schema;
    type Source = BaseItem.Source;
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
    // Note(LukeAbby): Temporary fix, look into solving this at the root of the issue.
    documentName: "Item";

    static override metadata: Item.Metadata;

    static get implementation(): Item.ConfiguredClass;

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
    getRollData(): Record<string, unknown>;

    /**
     * @privateRemarks _preCreate, _onCreateDocuments and _onDeleteDocuments are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */
  }
}
