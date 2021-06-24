import { ConfiguredDocumentClass } from '../../../types/helperTypes';

declare global {
  /**
   * The client-side Item document which extends the common BaseItem abstraction.
   * Each Item document contains ItemData which defines its data schema.
   *
   * @see {@link data.ItemData}              The Item data schema
   * @see {@link documents.Items}            The world-level collection of Item documents
   * @see {@link applications.ItemSheet}     The Item configuration application
   *
   * @param data    - Initial data provided to construct the Item document
   * @param context - The document context, see {@link foundry.abstract.Document}
   */
  class Item extends ClientDocumentMixin(foundry.documents.BaseItem) {
    /**
     * A convenience alias of Item#parent which is more semantically intuitive
     */
    get actor(): this['parent'];

    /**
     * A convenience reference to the image path (data.img) used to represent this Item
     */
    get img(): this['data']['img'];

    /**
     * A convenience alias of Item#isEmbedded which is preserves legacy support
     */
    get isOwned(): this['isEmbedded'];

    /**
     * Return an array of the Active Effect instances which originated from this Item.
     * The returned instances are the ActiveEffect instances which exist on the Item itself.
     */
    get transferredEffects(): ReturnType<this['effects']['filter']>;

    /**
     * A convenience reference to the item type (data.type) of this Item
     */
    get type(): this['data']['type'];

    /**
     * Prepare a data object which defines the data schema used by dice roll commands against this Item
     */
    getRollData(): this['data']['data'];

    /** @override */
    protected _getSheetClass(): typeof ItemSheet | null;

    /** @override */
    protected static _onCreateDocuments(
      items: Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>,
      context: DocumentModificationContext
    ): Promise<unknown>;

    /** @override */
    protected static _onDeleteDocuments(
      items: Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>,
      context: DocumentModificationContext
    ): Promise<unknown>;

    /**
     * You are referencing Item#_data which has been deprecated in favor of Item#data#_source. Support for this reference will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    get _data(): this['data']['_source'];

    /**
     * @deprecated since 0.8.1
     */
    static createOwned(
      itemData: Parameters<Item['data']['_initializeSource']>[0] & Record<string, unknown>,
      actor: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>
    ): InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>>;
  }
}

export {};
