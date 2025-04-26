import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const tileHUD = new TileHUD();

expectTypeOf(tileHUD.object).toEqualTypeOf<Tile.Object | undefined>();
expectTypeOf(TileHUD.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(tileHUD.options).toEqualTypeOf<Application.Options>();
expectTypeOf(tileHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(tileHUD.render(true)).toEqualTypeOf<TileHUD>();
expectTypeOf(tileHUD.layer).toEqualTypeOf<TilesLayer.Any>();
