import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace TileDocument {
    type ConfiguredClass = Document.ConfiguredClassForName<"Tile">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Tile">;

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DatabaseOperations extends DocumentDatabaseOperations<TileDocument> {}
  }

  /**
   * The client-side Tile document which extends the common BaseTile model.
   *
   * @see {@link Scene}            The Scene document type which contains Tile embedded documents
   * @see {@link TileConfig}       The Tile configuration application
   */
  class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
    override prepareDerivedData(): void;
  }
}
