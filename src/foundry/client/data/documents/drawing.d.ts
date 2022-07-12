export {};

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
     * Define an elevation property on the Drawing Document which in the future will become a part of its data schema.
     */
    get elevation(): number;

    /**
     * Define a sort property on the Drawing Document which in the future will become a core part of its data schema.
     */
    get sort(): number;

    /** {@inheritdoc} */
    override prepareBaseData(): void;
  }
}
