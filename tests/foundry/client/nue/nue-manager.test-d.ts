import { expectTypeOf } from "vitest";

const newUserExperience = new foundry.nue.NewUserExperienceManager();

expectTypeOf(newUserExperience.initialize()).toEqualTypeOf<void>();
