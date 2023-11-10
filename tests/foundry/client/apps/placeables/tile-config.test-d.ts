import { expectTypeOf } from "vitest";

declare const tile: TileDocument;

const tileConfig = new TileConfig(tile, { preview: true });
expectTypeOf(tileConfig.document).toEqualTypeOf<TileDocument>();
