import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

export {};

declare global {
  /**
   * The client-side Tile document which extends the common BaseTile model.
   *
   * @see {@link Scene}            The Scene document type which contains Tile embedded documents
   * @see {@link TileConfig}       The Tile configuration application
   */
  class TileDocument extends CanvasDocumentMixin(foundry.documents.BaseTile) {
    /**
     * Define an elevation property on the Tile Document which in the future will become a core part of its data schema.
     */
    get elevation(): number;

    set elevation(value);

    /**
     * Define a sort property on the Tile Document which in the future will become a core part of its data schema.
     */
    get sort(): this["z"];

    override prepareDerivedData(): void;
  }

  namespace TileDocument {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"Tile">>;
  }
}
