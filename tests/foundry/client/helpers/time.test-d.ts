import { expectTypeOf } from "vitest";

import GameTime = foundry.helpers.GameTime;
import CalendarData = foundry.data.CalendarData;

expectTypeOf(GameTime.SYNC_INTERVAL_MS).toEqualTypeOf<number>();

const gameTime = new GameTime();

expectTypeOf(gameTime.calendar).toEqualTypeOf<CalendarData<CalendarData.TimeComponents>>();
expectTypeOf(gameTime.earthCalendar).toEqualTypeOf<CalendarData<CalendarData.TimeComponents>>();
expectTypeOf(gameTime.serverTime).toEqualTypeOf<number>();
expectTypeOf(gameTime.worldTime).toEqualTypeOf<number>();
expectTypeOf(gameTime.components).toEqualTypeOf<CalendarData.TimeComponents>();
expectTypeOf(gameTime.averageLatency).toBeNumber();
expectTypeOf(gameTime.initializeCalendar()).toBeVoid();

expectTypeOf(gameTime.advance(100)).toEqualTypeOf<Promise<number>>();
expectTypeOf(gameTime.advance({ season: 2, hour: 21 })).toEqualTypeOf<Promise<number>>();
expectTypeOf(
  gameTime.advance(100, {
    // document create/update operation props passed on to `game.settings.set`; None should be relevant afaict
  }),
).toEqualTypeOf<Promise<number>>();

expectTypeOf(gameTime.set(36234634623)).toEqualTypeOf<Promise<number>>();
expectTypeOf(gameTime.set({ second: 50, minute: 20, year: 2000 })).toEqualTypeOf<Promise<number>>();
expectTypeOf(
  gameTime.set(36234634623, {
    // document create/update operation props passed on to `game.settings.set`; None should be relevant afaict
  }),
).toEqualTypeOf<Promise<number>>();

expectTypeOf(gameTime.sync()).toEqualTypeOf<Promise<GameTime>>();
expectTypeOf(
  gameTime.onUpdateWorldTime(100, { diff: true, modifiedTime: 5, render: true, recursive: true }, game.userId!),
).toEqualTypeOf<void>();
