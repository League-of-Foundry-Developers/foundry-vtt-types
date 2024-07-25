import { expectTypeOf } from "vitest";

const doc = new TileDocument({ width: 400, height: 400 });
expectTypeOf(doc.object).toEqualTypeOf<Tile.ConfiguredInstance | null>();
expectTypeOf(doc.layer).toEqualTypeOf<TilesLayer>();
