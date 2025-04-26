import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseSetting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<
  Promise<Setting.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseSetting.createDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();
expectTypeOf(foundry.documents.BaseSetting.updateDocuments([])).toEqualTypeOf<Promise<Setting.Implementation[]>>();
expectTypeOf(foundry.documents.BaseSetting.deleteDocuments([])).toEqualTypeOf<Promise<Setting.Implementation[]>>();

const mySetting = await foundry.documents.BaseSetting.create({ key: "fizz.buzz", value: "buzz" }, { temporary: true });
if (mySetting) {
  expectTypeOf(mySetting).toEqualTypeOf<Setting.Implementation>();
}
