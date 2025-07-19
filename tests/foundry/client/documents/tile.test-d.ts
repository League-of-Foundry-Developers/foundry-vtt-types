import { expectTypeOf } from "vitest";

// @ts-expect-error requires width and height
new TileDocument.implementation();

// @ts-expect-error requires width and height
new TileDocument.implementation({});

const tile = new TileDocument.implementation({ width: 400, height: 400 });
expectTypeOf(tile).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(tile.prepareDerivedData()).toEqualTypeOf<void>();
