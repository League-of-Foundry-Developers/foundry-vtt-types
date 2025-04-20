import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

// @ts-expect-error - requires key
new Setting.implementation();

// @ts-expect-error - requires key
new Setting.implementation({});

const setting = new Setting.implementation({ key: "foo.bar", value: "bar" });

expectTypeOf(setting.config).toEqualTypeOf<SettingsConfig | undefined>();

expectTypeOf(setting.key).toEqualTypeOf<string>();
expectTypeOf(setting.value).toEqualTypeOf<AnyObject | null>();
expectTypeOf(Setting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<Promise<Setting.Stored | undefined>>();
expectTypeOf(Setting.createDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();
expectTypeOf(Setting.updateDocuments([])).toEqualTypeOf<Promise<Setting.Implementation[]>>();
expectTypeOf(Setting.deleteDocuments([])).toEqualTypeOf<Promise<Setting.Implementation[]>>();

// @ts-expect-error - Setting doesn't include any flags and so the parameters should error with `Argument of type 'string' is not assignable to parameter of type 'never'.`
const flagValue = setting.getFlag("scope", "key");

// However if it is called, since the flag doesn't exist it returns `undefined` which matches what happens at runtime.
expectTypeOf(flagValue).toEqualTypeOf<never>();
