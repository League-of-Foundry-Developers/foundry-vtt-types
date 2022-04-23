/**
 * The client-side Tile document which extends the common BaseTile model.
 * Each Tile document contains TileData which defines its data schema.
 *
 * @see {@link data.TileData}                 The Tile data schema
 * @see {@link documents.Scene}               The Scene document type which contains Tile embedded documents
 * @see {@link applications.TileConfig}       The Tile configuration application
 */
declare class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
  override prepareDerivedData(): void;

  override get layer(): ForegroundLayer | BackgroundLayer;
}
