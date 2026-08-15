import { expectTypeOf } from "vitest";

type RollParseArg = foundry.dice.types.RollParseArg;
type RollParseNode = foundry.dice.types.RollParseNode;
type RollParseOffset = foundry.dice.types.RollParseOffset;

expectTypeOf<RollParseOffset>().toEqualTypeOf<{ start: number; end: number }>();

declare const parseNode: RollParseNode;
expectTypeOf(parseNode.formula).toEqualTypeOf<string | undefined>();
expectTypeOf(parseNode.offset).toEqualTypeOf<RollParseOffset | undefined>();

declare const flavorNode: foundry.dice.types.FlavorRollParseNode;
expectTypeOf(flavorNode.options.flavor).toEqualTypeOf<string | null>();
expectTypeOf(flavorNode.offset).toEqualTypeOf<RollParseOffset>();

declare const parentheticalNode: foundry.dice.types.ParentheticalRollParseNode;
expectTypeOf(parentheticalNode.term).toEqualTypeOf<RollParseNode>();

declare const diceNode: foundry.dice.types.DiceRollParseNode;
expectTypeOf(diceNode.number).toEqualTypeOf<number | foundry.dice.types.ParentheticalRollParseNode | null>();
expectTypeOf(diceNode.faces).toEqualTypeOf<string | number | foundry.dice.types.ParentheticalRollParseNode>();

const rollParser = new foundry.dice.RollParser("");

expectTypeOf(rollParser.formula).toEqualTypeOf<string>();

declare const node: RollParseNode;
expectTypeOf(foundry.dice.RollParser.flattenTree(node)).toEqualTypeOf<RollParseNode[]>();

declare const term: foundry.dice.terms.RollTerm;
expectTypeOf(foundry.dice.RollParser.toAST(node)).toEqualTypeOf<RollParseNode>();
expectTypeOf(foundry.dice.RollParser.toAST([term])).toEqualTypeOf<RollParseNode>();
expectTypeOf(foundry.dice.RollParser.isOperatorTerm(node)).toEqualTypeOf<boolean>();
expectTypeOf(foundry.dice.RollParser.isOperatorTerm(term)).toEqualTypeOf<boolean>();

declare const arg: RollParseArg;
expectTypeOf(foundry.dice.RollParser.formatList([arg])).toEqualTypeOf<string>();
expectTypeOf(foundry.dice.RollParser.formatArg(arg)).toEqualTypeOf<string>();
expectTypeOf(foundry.dice.RollParser.formatDebug("", arg)).toEqualTypeOf<string>();
