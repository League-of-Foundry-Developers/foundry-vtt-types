import { expectTypeOf } from "vitest";

new NewUserExperience();
const newUserExperience = new foundry.nue.NewUserExperienceManager();

expectTypeOf(newUserExperience.initialize()).toEqualTypeOf<void>();
