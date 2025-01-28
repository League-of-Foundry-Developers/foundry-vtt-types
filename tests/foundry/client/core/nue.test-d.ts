import { expectTypeOf } from "vitest";

const newUserExperience = new NewUserExperience();

expectTypeOf(newUserExperience.initialize()).toEqualTypeOf<void>();
