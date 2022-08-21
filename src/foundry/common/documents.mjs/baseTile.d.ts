import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import { BaseScene } from "./baseScene";

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
