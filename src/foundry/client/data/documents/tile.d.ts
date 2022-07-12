/**
 * The client-side Tile document which extends the common BaseTile model.
 * Each Tile document contains TileData which defines its data schema.
 *
 * @see {@link data.TileData}                 The Tile data schema
 * @see {@link documents.Scene}               The Scene document type which contains Tile embedded documents
 * @see {@link applications.TileConfig}       The Tile configuration application
 */
declare class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
  /**
   * Define an elevation property on the Tile Document which in the future will become a core part of its data schema.
   */
  get elevation(): number;

  /**
   * Define a sort property on the Tile Document which in the future will become a core part of its data schema.
   */
  get sort(): number;

  /** {@inheritdoc} */
  override prepareDerivedData(): void;
}
