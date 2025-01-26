import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

const defaultSheetsConfig = new DefaultSheetsConfig({});

expectTypeOf(defaultSheetsConfig.object).toEqualTypeOf<object>();
expectTypeOf(DefaultSheetsConfig.defaultOptions).toEqualTypeOf<DefaultSheetsConfig.Options>();
expectTypeOf(defaultSheetsConfig.options).toEqualTypeOf<DefaultSheetsConfig.Options>();
expectTypeOf(defaultSheetsConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<CombatTrackerConfig.CombatTrackerConfigData>>
>();
expectTypeOf(defaultSheetsConfig.render(true)).toEqualTypeOf<DefaultSheetsConfig>();
