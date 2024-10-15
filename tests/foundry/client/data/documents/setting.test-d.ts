import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";
import type { AnyObject } from "../../../../../src/types/utils.d.mts";

const setting = new Setting({ key: "foo.bar", value: "bar" });

expectTypeOf(setting.key).toEqualTypeOf<string>();
expectTypeOf(setting.value).toEqualTypeOf<AnyObject | null>();
expectTypeOf(Setting.create({ key: "foo.bar", value: "bar" })).toEqualTypeOf<
  Promise<Document.Stored<Setting> | undefined>
>();
expectTypeOf(Setting.createDocuments([])).toEqualTypeOf<Promise<Document.Stored<Setting>[]>>();
expectTypeOf(Setting.updateDocuments([])).toEqualTypeOf<Promise<Setting[]>>();
expectTypeOf(Setting.deleteDocuments([])).toEqualTypeOf<Promise<Setting[]>>();

// @ts-expect-error - Setting doesn't include any flags and so the parameters should error with `Argument of type 'string' is not assignable to parameter of type 'never'.`
const flagValue = setting.getFlag("scope", "key");

// However if it is called, since the flag doesn't exist it returns `undefined` which matches what happens at runtime.
expectTypeOf(flagValue).toEqualTypeOf<never>();
