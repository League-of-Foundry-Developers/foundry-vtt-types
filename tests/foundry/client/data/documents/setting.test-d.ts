import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.mts";

const setting = new Setting({ key: "foo.bar", value: "bar" });

expectTypeOf(Setting.schema).toEqualTypeOf<typeof foundry.data.SettingData>();
expectTypeOf(setting.key).toEqualTypeOf<string>();
expectTypeOf(setting.value).toEqualTypeOf<unknown>();
expectTypeOf(Setting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<
  Promise<StoredDocument<Setting> | undefined>
>();
expectTypeOf(Setting.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Setting>[]>>();
expectTypeOf(Setting.updateDocuments([])).toEqualTypeOf<Promise<Setting[]>>();
expectTypeOf(Setting.deleteDocuments([])).toEqualTypeOf<Promise<Setting[]>>();
