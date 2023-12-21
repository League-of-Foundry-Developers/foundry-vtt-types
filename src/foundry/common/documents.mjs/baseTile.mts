import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.ts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BaseScene } from "./baseScene.mts";

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
