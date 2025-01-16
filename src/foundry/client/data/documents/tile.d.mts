import type Document from "../../../common/abstract/document.d.mts";
import type BaseTile from "../../../common/documents/tile.d.mts";

declare global {
  namespace TileDocument {
    type Metadata = Document.MetadataFor<"Tile">;

    type ConfiguredClass = Document.ConfiguredClassForName<"Tile">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Tile">;

    interface DatabaseOperations extends Document.Database.Operations<TileDocument> {}

    // Helpful aliases
    type ConstructorData = BaseTile.ConstructorData;
    type UpdateData = BaseTile.UpdateData;
    type Schema = BaseTile.Schema;
    type Source = BaseTile.Source;
  }

  /**
   * The client-side Tile document which extends the common BaseTile model.
   *
   * @see {@link Scene}            The Scene document type which contains Tile embedded documents
   * @see {@link TileConfig}       The Tile configuration application
   */
  class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
    static override metadata: TileDocument.Metadata;

    static get implementation(): TileDocument.ConfiguredClass;

    override prepareDerivedData(): void;
  }
}
