import { expectTypeOf, test } from "vitest";

declare const result: foundry.dice.terms.DiceTerm.Result;

test("foundry/client/dice/dice/coin", () => {
  // @ts-expect-error The constructor reads `termData` without a default, so it is required.
  new foundry.dice.terms.Coin();

  const coin = new foundry.dice.terms.Coin({});

  expectTypeOf(coin.roll()).toEqualTypeOf<Promise<foundry.dice.terms.DiceTerm.Result>>();
  expectTypeOf(coin.minValue).toEqualTypeOf<0>();
  expectTypeOf(coin.getResultLabel(result)).toEqualTypeOf<string>();
  expectTypeOf(coin.getResultCSS(result)).toEqualTypeOf<(string | null)[]>();
  expectTypeOf(coin.call("")).toEqualTypeOf<void>();

  expectTypeOf(foundry.dice.terms.Coin.DENOMINATION).toEqualTypeOf<string>();
  expectTypeOf(foundry.dice.terms.Coin.MODIFIERS).toEqualTypeOf<foundry.dice.terms.Coin.Modifiers>();
});
