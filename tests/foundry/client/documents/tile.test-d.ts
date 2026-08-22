import { expectTypeOf } from "vitest";

// @ts-expect-error requires width and height
new TileDocument.implementation();

// @ts-expect-error requires width and height
new TileDocument.implementation({});

const tile = new TileDocument.implementation({ width: 400, height: 400 });
expectTypeOf(tile).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(tile.prepareDerivedData()).toEqualTypeOf<void>();

declare const someTile: TileDocument.Stored;

expectTypeOf(someTile.name).toEqualTypeOf<string | undefined>();
expectTypeOf(someTile.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(someTile.occlusion.modes).toEqualTypeOf<Set<CONST.OCCLUSION_MODES | null>>();
expectTypeOf(someTile.prepareBaseData()).toEqualTypeOf<void>();
