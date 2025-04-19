import { assertType, expectTypeOf } from "vitest";

// @ts-expect-error - requires a name.
new User.implementation();

// @ts-expect-error - requires a name.
new User.implementation({});

const user = new User.implementation({ name: "Test" });

expectTypeOf(user.active).toEqualTypeOf<boolean>();
expectTypeOf(user.targets).toEqualTypeOf<UserTargets>();
expectTypeOf(user.id).toEqualTypeOf<string | null>();
expectTypeOf(user.viewedScene).toEqualTypeOf<string | null>();
assertType<Partial<Record<string, boolean>>>(user.permissions);
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<Array<Macro.Implementation | null>>();
expectTypeOf(user.getHotbarMacros().map((each) => each.macro)).toEqualTypeOf<Array<Macro.Implementation | null>>();

user.assignHotbarMacro(new Macro.implementation({ name: "Foo" }), 1);

expectTypeOf(user._id).toEqualTypeOf<string | null>();
expectTypeOf(user.avatar).toEqualTypeOf<string | null | undefined>();

expectTypeOf(user.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();

expectTypeOf(user.color).toEqualTypeOf<Color>();

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

expectTypeOf<User.ImplementationClass>().toEqualTypeOf<typeof ConfiguredUser>();
expectTypeOf<User.Implementation>().toEqualTypeOf<ConfiguredUser>();
