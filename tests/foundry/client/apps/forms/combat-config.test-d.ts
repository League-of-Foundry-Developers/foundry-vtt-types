import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

const combatTrackerConfig = new CombatTrackerConfig();

expectTypeOf(combatTrackerConfig.object).toEqualTypeOf<undefined>();
expectTypeOf(CombatTrackerConfig.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(combatTrackerConfig.options).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(combatTrackerConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<CombatTrackerConfig.CombatTrackerConfigData>>
>();
expectTypeOf(combatTrackerConfig.render(true)).toEqualTypeOf<CombatTrackerConfig>();
