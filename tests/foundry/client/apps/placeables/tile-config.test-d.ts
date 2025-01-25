import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const tile: TileDocument;
const tileConfig = new TileConfig(tile);

expectTypeOf(tileConfig.object).toEqualTypeOf<TileDocument>();
expectTypeOf(tileConfig.document).toEqualTypeOf<TileDocument>();
expectTypeOf(TileConfig.defaultOptions).toEqualTypeOf<TileConfig.Options>();
expectTypeOf(tileConfig.options).toEqualTypeOf<TileConfig.Options>();
expectTypeOf(tileConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(tileConfig.render(true)).toEqualTypeOf<TileConfig>();
