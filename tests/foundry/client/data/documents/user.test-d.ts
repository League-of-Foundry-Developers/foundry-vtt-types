import { assertType, expectTypeOf } from "vitest";
import type { ConfiguredDocumentInstance } from "../../../../../src/types/helperTypes.d.mts";

const user = new User({ name: "Test" });

expectTypeOf(user.active).toEqualTypeOf<boolean>();
expectTypeOf(user.targets).toEqualTypeOf<UserTargets>();
expectTypeOf(user.id).toEqualTypeOf<string | null>();
expectTypeOf(user.viewedScene).toEqualTypeOf<string | null>();
assertType<Partial<Record<string, boolean>>>(user.permissions);
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<Array<Macro | null>>();
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<
  Array<ConfiguredDocumentInstance<typeof Macro> | null>
>();

user.assignHotbarMacro(new Macro({ name: "Foo" }), 1);

expectTypeOf(user._id).toEqualTypeOf<string | null>();
expectTypeOf(user.avatar).toEqualTypeOf<string | null | undefined>();

// TODO: Modify to ConfiguredDocumentSheet<typeof User> | null once data can be grabbed from CONFIG
expectTypeOf(user.sheet).toEqualTypeOf<FormApplication | null>();

expectTypeOf(user.color).toEqualTypeOf<string>();
