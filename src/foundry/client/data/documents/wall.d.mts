import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace WallDocument {
    type ConfiguredClass = Document.ConfiguredClassForName<"Wall">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Wall">;

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface DatabaseOperations extends DocumentDatabaseOperations<WallDocument> {}
  }

  /**
   * The client-side Wall document which extends the common BaseWall model.
   *
   * @see {@link Scene}            The Scene document type which contains Wall embedded documents
   * @see {@link WallConfig}       The Wall configuration application
   */
  class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {}
}
