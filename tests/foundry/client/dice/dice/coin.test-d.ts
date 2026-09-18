import { expectTypeOf, test } from "vitest";

declare const result: foundry.dice.terms.DiceTerm.Result;

test("foundry/client/dice/dice/coin", () => {
  const coin = new foundry.dice.terms.Coin();

  expectTypeOf(coin.roll()).toEqualTypeOf<Promise<foundry.dice.terms.DiceTerm.Result>>();
  expectTypeOf(coin.getResultLabel(result)).toEqualTypeOf<string>();
  expectTypeOf(coin.getResultCSS(result)).toEqualTypeOf<(string | null)[]>();
  expectTypeOf(coin.call("")).toEqualTypeOf<void>();

  expectTypeOf(foundry.dice.terms.Coin.DENOMINATION).toEqualTypeOf<string>();
  expectTypeOf(foundry.dice.terms.Coin.MODIFIERS).toEqualTypeOf<foundry.dice.terms.Coin.Modifiers>();
});
