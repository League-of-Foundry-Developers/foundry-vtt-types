import { expectTypeOf } from "vitest";

new GameTime(undefined);
new GameTime(null);

if (game) {
  const gameTime = new GameTime(game.socket);

  expectTypeOf(gameTime.serverTime).toEqualTypeOf<number>();
  expectTypeOf(gameTime.worldTime).toEqualTypeOf<number>();
  expectTypeOf(gameTime.advance(100)).toEqualTypeOf<Promise<number>>();
  expectTypeOf(gameTime.sync(game.socket)).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(gameTime.sync(undefined)).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(gameTime.sync(null)).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(gameTime.onUpdateWorldTime(100)).toEqualTypeOf<void>();

  expectTypeOf(GameTime.SYNC_INTERVAL_MS).toEqualTypeOf<number>();
}
