import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

const playerList = new PlayerList();

expectTypeOf(PlayerList.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(playerList.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(playerList.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<PlayerList.Data>>>();
expectTypeOf(playerList.render(true)).toEqualTypeOf<PlayerList>();
