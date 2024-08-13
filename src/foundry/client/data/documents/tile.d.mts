import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace TileDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Tile">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

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
