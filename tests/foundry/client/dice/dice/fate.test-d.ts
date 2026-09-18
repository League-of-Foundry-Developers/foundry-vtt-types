import { expectTypeOf, test } from "vitest";

declare const result: foundry.dice.terms.DiceTerm.Result;

test("foundry/client/dice/dice/fate", () => {
  const fateDie = new foundry.dice.terms.FateDie();

  expectTypeOf(fateDie.roll()).toEqualTypeOf<Promise<foundry.dice.terms.DiceTerm.Result>>();
  expectTypeOf(fateDie.mapRandomFace(5)).toEqualTypeOf<number>();
  expectTypeOf(fateDie.getResultLabel(result)).toEqualTypeOf<string>();

  expectTypeOf(foundry.dice.terms.FateDie.DENOMINATION).toEqualTypeOf<string>();
  expectTypeOf(foundry.dice.terms.FateDie.MODIFIERS).toEqualTypeOf<foundry.dice.terms.FateDie.Modifiers>();
});
