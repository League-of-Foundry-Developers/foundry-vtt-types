import { describe, expectTypeOf, test } from "vitest";

import UserTargets = foundry.canvas.placeables.tokens.UserTargets;
import Token = foundry.canvas.placeables.Token;

declare const user: User.Implementation;
declare const token: Token.Implementation;

describe("UserTargets Tests", () => {
  test("Construction", () => {
    expectTypeOf(new UserTargets(user)).toEqualTypeOf<UserTargets>();
  });

  const targets = new UserTargets(user);

  test("Miscellaneous", () => {
    expectTypeOf(targets.user).toEqualTypeOf<User.Implementation>();
    expectTypeOf(targets.ids).toEqualTypeOf<string[]>();
  });

  test("Set overrides", () => {
    expectTypeOf(targets.add(token)).toEqualTypeOf<typeof targets>();
    expectTypeOf(targets.clear()).toEqualTypeOf<void>();
    expectTypeOf(targets.delete(token)).toBeBoolean();
  });
});
