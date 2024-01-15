import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/types/utils.d.mts";

declare const tile: Tile;

const hud = new TileHUD();
expectTypeOf(hud.layer).toEqualTypeOf<ForegroundLayer | BackgroundLayer | undefined>();
expectTypeOf(hud.object).toEqualTypeOf<Tile | undefined>();
hud.bind(tile);
expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(hud.setPosition()).toEqualTypeOf<void>();
