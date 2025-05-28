import { expectTypeOf } from "vitest";

const die = new foundry.dice.terms.Die();

expectTypeOf(die.total).toEqualTypeOf<number | undefined>();
expectTypeOf(die.denomination).toEqualTypeOf<string>();
expectTypeOf(die.reroll("")).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(die.rerollRecursive("")).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(die.explode("")).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(die.explodeOnce("")).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(die.keep("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.drop("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.countSuccess("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.countFailures("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.countEven("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.countOdd("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.deductFailures("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.subtractFailures("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.marginSuccess("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.minimum("")).toEqualTypeOf<boolean | void>();
expectTypeOf(die.maximum("")).toEqualTypeOf<boolean | void>();

expectTypeOf(foundry.dice.terms.Die.DENOMINATION).toEqualTypeOf<string>();
expectTypeOf(foundry.dice.terms.Die.MODIFIERS).toEqualTypeOf<foundry.dice.terms.Die.Modifiers>();
