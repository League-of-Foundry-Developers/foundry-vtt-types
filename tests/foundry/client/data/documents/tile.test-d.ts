import { expectTypeOf } from "vitest";

// @ts-expect-error - requires width and height
new TileDocument();

// @ts-expect-error - requires width and height
new TileDocument({});

const tile = new TileDocument({ width: 400, height: 400 });
expectTypeOf(tile).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(tile.prepareDerivedData()).toEqualTypeOf<void>();
