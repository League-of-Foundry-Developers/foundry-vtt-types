import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

const playerList = new PlayerList();

expectTypeOf(PlayerList.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(playerList.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(playerList.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<PlayerList.Data>>>();
expectTypeOf(playerList.render(true)).toEqualTypeOf<PlayerList>();
