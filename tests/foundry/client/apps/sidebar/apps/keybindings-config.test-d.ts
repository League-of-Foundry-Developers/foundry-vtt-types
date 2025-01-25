import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const keybindingsConfig = new KeybindingsConfig();

expectTypeOf(KeybindingsConfig.defaultOptions).toEqualTypeOf<PackageConfiguration.Options>();
expectTypeOf(keybindingsConfig.options).toEqualTypeOf<PackageConfiguration.Options>();
expectTypeOf(keybindingsConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(keybindingsConfig.render(true)).toEqualTypeOf<KeybindingsConfig>();

expectTypeOf(KeybindingsConfig.categoryOrder).toEqualTypeOf<string[]>();
