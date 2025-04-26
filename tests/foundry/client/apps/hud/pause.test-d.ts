import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

const pause = new Pause();

expectTypeOf(Pause.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(pause.options).toEqualTypeOf<Application.Options>();
expectTypeOf(pause.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<Pause.PauseData>>>();
expectTypeOf(pause.render(true)).toEqualTypeOf<Pause>();
