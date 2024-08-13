import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace DrawingDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Drawing">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations extends DocumentDatabaseOperations<DrawingDocument> {}
  }

  /**
   * The client-side Drawing document which extends the common BaseDrawing model.
   *
   * @see {@link Scene}               The Scene document type which contains Drawing embedded documents
   * @see {@link DrawingConfig}       The Drawing configuration application
   */
  class DrawingDocument extends CanvasDocumentMixin(foundry.documents.BaseDrawing) {
    /**
     * Is the current User the author of this drawing?
     */
    get isAuthor(): boolean;
  }
}
