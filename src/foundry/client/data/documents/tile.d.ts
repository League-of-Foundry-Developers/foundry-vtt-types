// FOUNDRY_VERSION: 10.291

import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type BaseTile from "../../../common/documents/tile.mjs";

/**
 * The client-side Tile document which extends the common BaseTile document model.
 *
 * @see {@link Scene}                     The Scene document type which contains Tile documents
 * @see {@link TileConfig}                The Tile configuration application
 */
declare class TileDocument extends CanvasDocumentMixin(BaseTile) {
  /**
   * Define an elevation property on the Tile Document which in the future will become a core part of its data schema.
   */
  get elevation(): number;

  /** @internal */
  #elevation: number;

  /**
   * Define a sort property on the Tile Document which in the future will become a core part of its data schema.
   */
  get sort(): number;

  override prepareDerivedData(): void;

  /** @internal */
  protected override _onUpdate(
    changed: BaseTile.UpdateData,
    options: DocumentModificationOptions,
    userId: string,
  ): void;
}
