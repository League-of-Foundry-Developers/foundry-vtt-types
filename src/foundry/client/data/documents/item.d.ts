import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The client-side Item document which extends the common BaseItem model.
   *
   * @see {@link documents.Items}        - The world-level collection of Item documents
   * @see {@link applications.ItemSheet} - The Item configuration application
   */
  class Item extends ClientDocumentMixin(foundry.documents.BaseItem) {
    /**
     * A convenience alias of Item#parent which is more semantically intuitive
     */
    get actor(): this["parent"];

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    // FIXME: this should be typed as `this["img"]`, but this won't be possible until its ancestor class is updated for v10.
    get thumbnail(): string | null;

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
     */
    getRollData(): object;

    // @ts-expect-error For some reason, protected static methods from Document are lost, so ts complains that this isn't actually an override
    protected static override _onCreateDocuments(
      items: Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>,
      context: DocumentModificationContext
    ): Promise<unknown>;

    // @ts-expect-error For some reason, proctected static methods from Document are lost, so ts complains that this isn't actually an override
    protected static override _onDeleteDocuments(
      items: Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>,
      context: DocumentModificationContext
    ): Promise<unknown>;
  }
}
