import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(foundry.documents.BaseSetting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<
  Promise<Document.Stored<Setting> | undefined>
>();
expectTypeOf(foundry.documents.BaseSetting.createDocuments([])).toEqualTypeOf<Promise<Document.Stored<Setting>[]>>();
expectTypeOf(foundry.documents.BaseSetting.updateDocuments([])).toEqualTypeOf<Promise<Setting[]>>();
expectTypeOf(foundry.documents.BaseSetting.deleteDocuments([])).toEqualTypeOf<Promise<Setting[]>>();

const mySetting = await foundry.documents.BaseSetting.create({ key: "fizz.buzz", value: "buzz" }, { temporary: true });
if (mySetting) {
  expectTypeOf(mySetting).toEqualTypeOf<Setting>();
}
