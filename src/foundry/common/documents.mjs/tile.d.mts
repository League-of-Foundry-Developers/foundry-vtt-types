import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { BaseScene } from "./scene.d.mts";

type TileMetadata = Merge<
  DocumentMetadata,
  {
    name: "Tile";
    collection: "tiles";
    label: "DOCUMENT.Tile";
    labelPlural: "DOCUMENT.Tiles";
    isEmbedded: true;
  }
>;

/**
 * The base Tile model definition which defines common behavior of an Tile document between both client and server.
 */
export declare class BaseTile extends Document<
  data.TileData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>,
  TileMetadata
> {
  static override get schema(): typeof data.TileData;

  static override get metadata(): TileMetadata;
}
