import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

const combatTrackerConfig = new CombatTrackerConfig();

expectTypeOf(combatTrackerConfig.object).toEqualTypeOf<FormApplication.NoObject>();
expectTypeOf(CombatTrackerConfig.defaultOptions).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(combatTrackerConfig.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(combatTrackerConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<CombatTrackerConfig.CombatTrackerConfigData>>
>();
expectTypeOf(combatTrackerConfig.render(true)).toEqualTypeOf<CombatTrackerConfig>();
