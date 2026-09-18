import { expectTypeOf, test } from "vitest";

type RollParseArg = foundry.dice.types.RollParseArg;
type RollParseNode = foundry.dice.types.RollParseNode;

declare const parseNode: RollParseNode;

declare const flavorNode: foundry.dice.types.FlavorRollParseNode;

declare const parentheticalNode: foundry.dice.types.ParentheticalRollParseNode;

declare const diceNode: foundry.dice.types.DiceRollParseNode;

declare const node: RollParseNode;

declare const term: foundry.dice.terms.RollTerm;

declare const arg: RollParseArg;

test("foundry/client/dice/parser", () => {
  type RollParseOffset = foundry.dice.types.RollParseOffset;

  expectTypeOf<RollParseOffset>().toEqualTypeOf<{ start: number; end: number }>();
  expectTypeOf(parseNode.formula).toEqualTypeOf<string | undefined>();
  expectTypeOf(parseNode.offset).toEqualTypeOf<RollParseOffset | undefined>();
  expectTypeOf(flavorNode.options.flavor).toEqualTypeOf<string | null>();
  expectTypeOf(flavorNode.offset).toEqualTypeOf<RollParseOffset>();
  expectTypeOf(parentheticalNode.term).toEqualTypeOf<RollParseNode>();
  expectTypeOf(diceNode.number).toEqualTypeOf<number | foundry.dice.types.ParentheticalRollParseNode | null>();
  expectTypeOf(diceNode.faces).toEqualTypeOf<string | number | foundry.dice.types.ParentheticalRollParseNode>();

  const rollParser = new foundry.dice.RollParser("");

  expectTypeOf(rollParser.formula).toEqualTypeOf<string>();
  expectTypeOf(foundry.dice.RollParser.flattenTree(node)).toEqualTypeOf<RollParseNode[]>();
  expectTypeOf(foundry.dice.RollParser.toAST(node)).toEqualTypeOf<RollParseNode>();
  expectTypeOf(foundry.dice.RollParser.toAST([term])).toEqualTypeOf<RollParseNode>();
  expectTypeOf(foundry.dice.RollParser.isOperatorTerm(node)).toEqualTypeOf<boolean>();
  expectTypeOf(foundry.dice.RollParser.isOperatorTerm(term)).toEqualTypeOf<boolean>();
  expectTypeOf(foundry.dice.RollParser.formatList([arg])).toEqualTypeOf<string>();
  expectTypeOf(foundry.dice.RollParser.formatArg(arg)).toEqualTypeOf<string>();
  expectTypeOf(foundry.dice.RollParser.formatDebug("", arg)).toEqualTypeOf<string>();
});
