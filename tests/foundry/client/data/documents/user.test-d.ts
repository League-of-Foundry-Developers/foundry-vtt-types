import { assertType, expectTypeOf } from "vitest";

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
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<Array<Macro.ConfiguredInstance | null>>();

user.assignHotbarMacro(new Macro({ name: "Foo" }), 1);

expectTypeOf(user._id).toEqualTypeOf<string | null>();
expectTypeOf(user.avatar).toEqualTypeOf<string | null | undefined>();

expectTypeOf(user.sheet).toEqualTypeOf<FormApplication | foundry.applications.api.ApplicationV2 | null>();

expectTypeOf(user.color).toEqualTypeOf<string>();

declare class ConfiguredUser extends User {}

declare global {
  interface DocumentClassConfig {
    User: typeof ConfiguredUser;
  }

  interface FlagConfig {
    User: {
      someScope: {
        someFlag: number;
      };
    };
  }
}

expectTypeOf<User.ConfiguredClass>().toEqualTypeOf<typeof ConfiguredUser>();
expectTypeOf<User.ConfiguredInstance>().toEqualTypeOf<ConfiguredUser>();
