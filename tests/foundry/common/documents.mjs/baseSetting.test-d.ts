import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.mts";

expectTypeOf(foundry.documents.BaseSetting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<
  Promise<StoredDocument<Setting> | undefined>
>();
expectTypeOf(foundry.documents.BaseSetting.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Setting>[]>>();
expectTypeOf(foundry.documents.BaseSetting.updateDocuments([])).toEqualTypeOf<Promise<Setting[]>>();
expectTypeOf(foundry.documents.BaseSetting.deleteDocuments([])).toEqualTypeOf<Promise<Setting[]>>();

const settingData = await foundry.documents.BaseSetting.create(
  { key: "fizz.buzz", value: "buzz" },
  { temporary: true },
);
if (settingData) {
  expectTypeOf(settingData.data).toEqualTypeOf<foundry.data.SettingData>();
}
