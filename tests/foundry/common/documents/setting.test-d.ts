import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseSetting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<
  Promise<Setting.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseSetting.createDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();
expectTypeOf(foundry.documents.BaseSetting.updateDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();
expectTypeOf(foundry.documents.BaseSetting.deleteDocuments([])).toEqualTypeOf<Promise<Setting.Stored[]>>();

expectTypeOf(foundry.documents.BaseSetting["_GAMEMASTER_ONLY_KEYS"]).toEqualTypeOf<string[]>();
expectTypeOf(foundry.documents.BaseSetting["_ALLOWED_ASSISTANT_KEYS"]).toEqualTypeOf<string[]>();
