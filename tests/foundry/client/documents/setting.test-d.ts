import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import ClientSettings = foundry.helpers.ClientSettings;

// @ts-expect-error requires key
new Setting.implementation();

// @ts-expect-error requires key
new Setting.implementation({});

const setting = new Setting.implementation({ key: "foo.bar", value: "bar" });

expectTypeOf(setting.config).toEqualTypeOf<ClientSettings.SettingConfig | undefined>();

expectTypeOf(setting.key).toEqualTypeOf<`${string}.${string}`>();
expectTypeOf(setting.value).toEqualTypeOf<AnyObject | null>();
expectTypeOf(Setting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<Promise<Setting.Stored | undefined>>();
expectTypeOf(Setting.createDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();
expectTypeOf(Setting.updateDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();
expectTypeOf(Setting.deleteDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();

// @ts-expect-error Setting doesn't include any flags and so the parameters should error with `Argument of type 'string' is not assignable to parameter of type 'never'.`
setting.getFlag("scope", "key");
