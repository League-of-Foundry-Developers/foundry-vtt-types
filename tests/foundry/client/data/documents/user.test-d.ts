import { assertType, expectTypeOf } from "vitest";
import type { ConfiguredDocumentClass } from "../../../../../src/types/helperTypes.d.mts";

// @ts-expect-error - requires a name.
new User();

// @ts-expect-error - requires a name.
new User({});

const user = new User({ name: "Test" });

expectTypeOf(user.active).toEqualTypeOf<boolean>();
expectTypeOf(user.targets).toEqualTypeOf<UserTargets>();
expectTypeOf(user.id).toEqualTypeOf<string | null>();
expectTypeOf(user.viewedScene).toEqualTypeOf<string | null>();
assertType<Partial<Record<string, boolean>>>(user.permissions);
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<Array<Macro | null>>();
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<
  Array<InstanceType<ConfiguredDocumentClass<typeof Macro>> | null>
>();

user.assignHotbarMacro(new Macro({ name: "Foo" }), 1);

expectTypeOf(user._id).toEqualTypeOf<string | null>();
expectTypeOf(user.avatar).toEqualTypeOf<string | null | undefined>();

expectTypeOf(user.sheet).toEqualTypeOf<FormApplication | foundry.applications.api.ApplicationV2 | null>();

expectTypeOf(user.color).toEqualTypeOf<string>();
