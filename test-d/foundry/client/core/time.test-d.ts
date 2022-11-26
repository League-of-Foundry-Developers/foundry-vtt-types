import { expectType } from "tsd";

expectType<number>(GameTime.SYNC_INTERVAL_MS);
new GameTime(undefined);
new GameTime(null);

if (game instanceof Game) {
  const time = new GameTime(game.socket);
  expectType<number>(time.serverTime);
  expectType<number>(time.worldTime);
  expectType<Promise<number>>(time.advance(100));
  expectType<Promise<GameTime>>(time.sync(game.socket));
  expectType<Promise<GameTime>>(time.sync(undefined));
  expectType<Promise<GameTime>>(time.sync(null));
  expectType<void>(time.onUpdateWorldTime(100));
  expectType<number>(game.settings.get("core", "time"));
}
