import { describe, expectTypeOf, test } from "vitest";

import NewUserExperienceManager = foundry.nue.NewUserExperienceManager;

describe("NewUserExperienceManager Tests", () => {
  test("Construction", () => {
    new NewUserExperienceManager();
  });

  const newUserExperience = new foundry.nue.NewUserExperienceManager();

  test("Miscellaneous", () => {
    expectTypeOf(newUserExperience.initialize()).toEqualTypeOf<void>();

    expectTypeOf(newUserExperience.createDefaultScene()).toEqualTypeOf<Promise<Scene.Implementation>>();
    expectTypeOf(
      newUserExperience.createDefaultScene({
        weather: "leaves",
        fog: {
          colors: {
            unexplored: "#ABCDEF",
          },
        },
      }),
    ).toEqualTypeOf<Promise<Scene.Implementation>>();
  });
});
