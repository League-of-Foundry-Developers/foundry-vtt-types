import { expectType } from "tsd";

declare const tile: TileDocument;

const tileConfig = new TileConfig(tile, { preview: true });
expectType<TileDocument>(tileConfig.document);
