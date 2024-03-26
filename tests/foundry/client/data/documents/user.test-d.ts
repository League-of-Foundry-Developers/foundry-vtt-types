import { assertType, expectTypeOf } from "vitest";
import type { ConfiguredDocumentClass } from "../../../../../src/types/helperTypes.d.mts";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const user = new User({ name: "Test" });

expectTypeOf(user.active).toEqualTypeOf<boolean>();
expectTypeOf(user.targets).toEqualTypeOf<UserTargets>();
expectTypeOf(user.id).toEqualTypeOf<string | null>();
expectTypeOf(user.viewedScene).toEqualTypeOf<string | null>();
expectTypeOf(user.avatar).toEqualTypeOf<string>();
expectTypeOf(user.character).toEqualTypeOf<
  StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Actor>>> | undefined
>();
expectTypeOf(user.character).toEqualTypeOf<StoredDocument<Actor> | undefined>();
assertType<Partial<Record<string, boolean>>>(user.permissions);
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<Array<Macro | null>>();
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<
  Array<InstanceType<ConfiguredDocumentClass<typeof Macro>> | null>
>();

user.assignHotbarMacro(new Macro(), 1);

expectTypeOf(user.data._id).toEqualTypeOf<string | null>();
expectTypeOf(user.data.character).toEqualTypeOf<string | null>();
expectTypeOf(user.data.avatar).toEqualTypeOf<string | null | undefined>();

// TODO: Modify to ConfiguredDocumentSheet<typeof User> | null once data can be grabbed from CONFIG
expectTypeOf(user.sheet).toEqualTypeOf<FormApplication | null>();

expectTypeOf(user.charname).toEqualTypeOf<string | undefined>();
expectTypeOf(user.color).toEqualTypeOf<string | undefined>();
expectTypeOf(user.border).toEqualTypeOf<string | undefined>();
