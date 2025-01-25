import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

const pause = new Pause();

expectTypeOf(Pause.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(pause.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(pause.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<Pause.PauseData>>>();
expectTypeOf(pause.render(true)).toEqualTypeOf<Pause>();
