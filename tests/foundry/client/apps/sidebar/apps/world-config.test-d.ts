import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const worldConfig = new WorldConfig();

expectTypeOf(worldConfig.object).toEqualTypeOf<World>();
expectTypeOf(WorldConfig.defaultOptions).toEqualTypeOf<WorldConfigOptions>();
expectTypeOf(worldConfig.options).toEqualTypeOf<WorldConfigOptions>();
expectTypeOf(worldConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(worldConfig.render(true)).toEqualTypeOf<WorldConfig>();

expectTypeOf(worldConfig.world).toEqualTypeOf<World>();
expectTypeOf(worldConfig.title).toEqualTypeOf<string>();
