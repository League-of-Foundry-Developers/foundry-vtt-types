import { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * The client-side MeasuredTemplate embedded document which extends the common BaseMeasuredTemplate abstraction.
   * Each MeasuredTemplate document contains MeasuredTemplateData which defines its data schema.
   *
   * @see {@link data.MeasuredTemplateData}              The MeasuredTemplate data schema
   * @see {@link documents.Scene}               The Scene document type which contains MeasuredTemplate embedded documents
   * @see {@link applications.MeasuredTemplateConfig}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(foundry.documents.BaseMeasuredTemplate) {
    /**
     * @param data  - Initial data provided to construct the MeasuredTemplate document
     *                (default: `{}`)
     * @param scene - The parent Scene document to which this MeasuredTemplate belongs
     */
    constructor(
      data?: ConstructorParameters<typeof foundry.documents.BaseMeasuredTemplate>[0],
      scene?: ConstructorParameters<typeof foundry.documents.BaseMeasuredTemplate>[1]
    );

    /**
     * A reference to the User who created the MeasuredTemplate document.
     */
    get author(): InstanceType<ConfiguredDocumentClass<typeof User>>;

    /* -------------------------------------------- */

    /**
     * A flag for whether the current User has full ownership over the MeasuredTemplate document.
     */
    get isOwner(): boolean;
  }
}

export {};
