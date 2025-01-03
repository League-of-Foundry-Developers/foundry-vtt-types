import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseDrawing from "../../../common/documents/drawing.d.mts";

declare global {
  namespace DrawingDocument {
    type Metadata = Document.MetadataFor<DrawingDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Drawing">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Drawing">;

    interface DatabaseOperations extends DocumentDatabaseOperations<DrawingDocument> {}

    // Helpful aliases
    type ConstructorData = BaseDrawing.ConstructorData;
    type UpdateData = BaseDrawing.UpdateData;
    type Schema = BaseDrawing.Schema;
    type Source = BaseDrawing.Source;
  }

  /**
   * The client-side Drawing document which extends the common BaseDrawing model.
   *
   * @see {@link Scene}               The Scene document type which contains Drawing embedded documents
   * @see {@link DrawingConfig}       The Drawing configuration application
   */
  class DrawingDocument extends CanvasDocumentMixin(foundry.documents.BaseDrawing) {
    static override metadata: DrawingDocument.Metadata;

    static get implementation(): DrawingDocument.ConfiguredClass;

    /**
     * Is the current User the author of this drawing?
     */
    get isAuthor(): boolean;
  }
}
