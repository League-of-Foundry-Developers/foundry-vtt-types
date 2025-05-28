import { expectTypeOf } from "vitest";

const twister = new foundry.dice.MersenneTwister(4);

expectTypeOf(twister.seed(4)).toEqualTypeOf<number>();
expectTypeOf(twister.seedArray([])).toEqualTypeOf<void>();
expectTypeOf(twister.int()).toEqualTypeOf<number>();
expectTypeOf(twister.int31()).toEqualTypeOf<number>();
expectTypeOf(twister.real()).toEqualTypeOf<number>();
expectTypeOf(twister.realx()).toEqualTypeOf<number>();
expectTypeOf(twister.rnd()).toEqualTypeOf<number>();
expectTypeOf(twister.random()).toEqualTypeOf<number>();
expectTypeOf(twister.rndHiRes()).toEqualTypeOf<number>();
expectTypeOf(twister.normal(1, 2)).toEqualTypeOf<number>();

expectTypeOf(foundry.dice.MersenneTwister.random()).toEqualTypeOf<number>();
expectTypeOf(foundry.dice.MersenneTwister.normal(1, 2)).toEqualTypeOf<number>();
