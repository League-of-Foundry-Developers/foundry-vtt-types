import { assertType, expectTypeOf, test } from "vitest";

import UserTargets = foundry.canvas.placeables.tokens.UserTargets;
import FormApplication = foundry.appv1.api.FormApplication;

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
expectTypeOf(user.avatar).toEqualTypeOf<string | null>();

expectTypeOf(user.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();

expectTypeOf(user.color).toEqualTypeOf<Color>();

const queryConfig = { timeout: 100 };

expectTypeOf(user.query("dialog", { type: "confirm", config: { content: "Do thing?" } }, queryConfig)).toEqualTypeOf<
  Promise<User.QueryReturn<"dialog">>
>();

declare module "fvtt-types/configuration" {
  namespace CONFIG {
    interface Queries {
      "draw-steel.spendHeroToken": (
        payload: { userId: string; spendType: string; flavor: string },
        queryOptions: User.QueryOptions,
      ) => void;
    }
  }
}

const queryPayload = {
  userId: "test",
  spendType: "test",
  flavor: "test",
};

expectTypeOf(user.query("draw-steel.spendHeroToken", queryPayload, queryConfig)).toEqualTypeOf<Promise<void>>();

declare class ConfiguredUser extends User {}

declare module "fvtt-types/configuration" {
  interface DocumentClassConfig {
    User: typeof ConfiguredUser;
  }

  interface FlagConfig {
    User: {
      someScope: {
        someFlag: number;
        otherFlag: string;
      };
    };
  }
}

expectTypeOf<User.ImplementationClass>().toEqualTypeOf<typeof ConfiguredUser>();
expectTypeOf<User.Implementation>().toEqualTypeOf<ConfiguredUser>();

// Regression test for partial flags. @exxaminator reported that the `flags` weren't partial in `update`.
test("partial update of flags allowed", () => {
  user.update({
    flags: {
      someScope: {
        someFlag: 123,
      },
    },
  });
});
