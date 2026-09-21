import { expectTypeOf, test } from "vitest";

test("foundry/client/dice/_module", () => {
  expectTypeOf(foundry.dice.RollGrammar.parse("1d20 + 5")).toEqualTypeOf<
    foundry.dice.types.RollParseNode | foundry.dice.terms.RollTerm.Data
  >();
  foundry.dice.RollGrammar.parse("(1d20 * -1)", { parser: foundry.dice.RollParser });
  foundry.dice.RollGrammar.parse("1d20", { grammarSource: "test formula", startRule: "Expression" });
  expectTypeOf(foundry.dice.RollGrammar.StartRules).toEqualTypeOf<"Expression"[]>();
  expectTypeOf(foundry.dice.RollGrammar.SyntaxError).toEqualTypeOf<typeof import("peggy").parser.SyntaxError>();
  // @ts-expect-error Only the Expression rule is exported by the compiled grammar.
  foundry.dice.RollGrammar.parse("1d20", { startRule: "Term" });
});
