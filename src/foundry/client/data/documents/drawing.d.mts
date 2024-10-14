import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";

declare global {
  namespace DrawingDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Drawing">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"Drawing">;
  }

  /**
   * The client-side Drawing document which extends the common BaseDrawing model.
   *
   * @see {@link Scene}               The Scene document type which contains Drawing embedded documents
   * @see {@link DrawingConfig}       The Drawing configuration application
   */
  class DrawingDocument extends CanvasDocumentMixin(foundry.documents.BaseDrawing) {
    /**
     * Define an elevation property on the Drawing Document which in the future will become a part of its data schema.
     */
    get elevation(): number;

    set elevation(value);
    /**
     * Define a sort property on the Drawing Document which in the future will become a core part of its data schema.
     */
    get sort(): this["z"];
  }
}
