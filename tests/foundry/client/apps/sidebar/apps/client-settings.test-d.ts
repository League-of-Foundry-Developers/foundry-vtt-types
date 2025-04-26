import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const settingsConfig = new SettingsConfig();

expectTypeOf(settingsConfig.object).toEqualTypeOf<FormApplication.NoObject>();
expectTypeOf(SettingsConfig.defaultOptions).toEqualTypeOf<typeof FormApplication.defaultOptions>();
expectTypeOf(settingsConfig.options).toEqualTypeOf<typeof FormApplication.defaultOptions>();
expectTypeOf(settingsConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(settingsConfig.render(true)).toEqualTypeOf<SettingsConfig>();

expectTypeOf(settingsConfig.id).toEqualTypeOf<string>();
expectTypeOf(settingsConfig.title).toEqualTypeOf<string>();
