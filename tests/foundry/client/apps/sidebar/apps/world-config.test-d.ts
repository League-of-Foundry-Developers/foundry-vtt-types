import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const worldConfig = new WorldConfig(new World());

expectTypeOf(worldConfig.object).toEqualTypeOf<World>();
expectTypeOf(WorldConfig.defaultOptions).toEqualTypeOf<WorldConfig.Options>();
expectTypeOf(worldConfig.options).toEqualTypeOf<WorldConfig.Options>();
expectTypeOf(worldConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(worldConfig.render(true)).toEqualTypeOf<WorldConfig>();

expectTypeOf(worldConfig.world).toEqualTypeOf<World>();
expectTypeOf(worldConfig.title).toEqualTypeOf<string>();
