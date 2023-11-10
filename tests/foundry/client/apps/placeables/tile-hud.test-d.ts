import { expectTypeOf } from "vitest";

declare const tile: Tile;

const hud = new TileHUD();
expectTypeOf(hud.layer).toEqualTypeOf<ForegroundLayer | BackgroundLayer | undefined>();
expectTypeOf(hud.object).toEqualTypeOf<Tile | undefined>();
hud.bind(tile);
expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(hud.setPosition()).toEqualTypeOf<void>();
