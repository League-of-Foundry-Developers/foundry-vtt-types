import { expectTypeOf } from "vitest";

expectTypeOf(GameTime.SYNC_INTERVAL_MS).toEqualTypeOf<number>();
new GameTime(undefined);
new GameTime(null);

if (game instanceof Game) {
  const time = new GameTime(game.socket);
  expectTypeOf(time.serverTime).toEqualTypeOf<number>();
  expectTypeOf(time.worldTime).toEqualTypeOf<number>();
  expectTypeOf(time.advance(100)).toEqualTypeOf<Promise<number>>();
  expectTypeOf(time.sync(game.socket)).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(time.sync(undefined)).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(time.sync(null)).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(time.onUpdateWorldTime(100)).toEqualTypeOf<void>();
  expectTypeOf(game.settings.get("core", "time")).toEqualTypeOf<number>();
}
