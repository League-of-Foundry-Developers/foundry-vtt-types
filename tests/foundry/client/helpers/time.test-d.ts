import { expectTypeOf } from "vitest";

const GameTime = foundry.helpers.GameTime;

if (game) {
  const gameTime = new GameTime();

  expectTypeOf(gameTime.serverTime).toEqualTypeOf<number>();
  expectTypeOf(gameTime.worldTime).toEqualTypeOf<number>();
  expectTypeOf(gameTime.advance(100)).toEqualTypeOf<Promise<number>>();
  expectTypeOf(gameTime.sync()).toEqualTypeOf<Promise<GameTime>>();
  expectTypeOf(gameTime.onUpdateWorldTime(100, {}, game.userId!)).toEqualTypeOf<void>();

  expectTypeOf(GameTime.SYNC_INTERVAL_MS).toEqualTypeOf<number>();
}
