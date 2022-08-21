import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The client-side Drawing document which extends the common BaseDrawing model.
   * Each Drawing document contains DrawingData which defines its data schema.
   *
   * @see {@link data.DrawingData}              The Drawing data schema
   * @see {@link documents.Scene}               The Scene document type which contains Drawing embedded documents
   * @see {@link applications.DrawingConfig}    The Drawing configuration application
   */
  class DrawingDocument extends CanvasDocumentMixin(foundry.documents.BaseDrawing) {
    /**
     * A reference to the User who created the Drawing document.
     * @remarks Will return undefined if the user has been deleted
     */
    get author(): InstanceType<ConfiguredDocumentClass<typeof User>> | undefined;
  }
}
