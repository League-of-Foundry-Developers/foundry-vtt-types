import { expectTypeOf } from "vitest";

const myMovement = new MovementSource();

expectTypeOf(myMovement.initialize()).toEqualTypeOf<MovementSource>();
