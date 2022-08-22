import { expectType } from "tsd";

declare const tile: Tile;

const hud = new TileHUD();
expectType<ForegroundLayer | BackgroundLayer | undefined>(hud.layer);
expectType<Tile | undefined>(hud.object);
hud.bind(tile);
expectType<MaybePromise<object>>(hud.getData());
expectType<void>(hud.setPosition());
