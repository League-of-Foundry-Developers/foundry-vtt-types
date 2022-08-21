import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

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
     * A reference to the User who created the MeasuredTemplate document.
     * @remarks Will return undefined if the user has been deleted
     */
    get author(): InstanceType<ConfiguredDocumentClass<typeof User>> | undefined;
  }
}

export {};
