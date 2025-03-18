import { expectTypeOf } from "vitest";
import type { RollParseArg, RollParseNode } from "../../../../src/foundry/client-esm/dice/_types.d.mts";

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
