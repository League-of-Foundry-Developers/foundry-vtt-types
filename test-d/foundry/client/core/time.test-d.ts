import { expectType } from 'tsd';

expectType<number>(GameTime.SYNC_INTERVAL_MS);
new GameTime(undefined);
new GameTime(null);

if (socket) {
  const time = new GameTime(socket);
  expectType<number>(time.serverTime);
  expectType<number>(time.worldTime);
  expectType<Promise<number>>(time.advance(100));
  expectType<Promise<GameTime>>(time.sync(socket));
  expectType<Promise<GameTime>>(time.sync(undefined));
  expectType<Promise<GameTime>>(time.sync(null));
  expectType<void>(time.onUpdateWorldTime(100));
}

expectType<number>((game as Game).settings.get('core', 'time'));
