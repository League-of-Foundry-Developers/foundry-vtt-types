import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const tile: Tile;

const hud = new TileHUD();
// TODO: Fix after document updates
// expectTypeOf(hud.layer).toEqualTypeOf<ForegroundLayer | BackgroundLayer | undefined>();
expectTypeOf(hud.object).toEqualTypeOf<Tile | undefined>();
hud.bind(tile);
expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(hud.setPosition()).toEqualTypeOf<void>();
