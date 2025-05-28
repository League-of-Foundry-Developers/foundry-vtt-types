import { expectTypeOf } from "vitest";
import type { FunctionRollParseNode } from "../../../../../src/foundry/client/dice/_types.d.mts";

const functionTerm = new foundry.dice.terms.FunctionTerm({ fn: "max" });

expectTypeOf(functionTerm.fn).toEqualTypeOf<string>();
expectTypeOf(functionTerm.terms).toEqualTypeOf<string[]>();
expectTypeOf(functionTerm.rolls).toEqualTypeOf<foundry.dice.Roll[]>();
expectTypeOf(functionTerm.result).toEqualTypeOf<string | number | undefined>();
expectTypeOf(functionTerm.isIntermediate).toEqualTypeOf<true>();
expectTypeOf(functionTerm.dice).toEqualTypeOf<foundry.dice.terms.DiceTerm[]>();
expectTypeOf(functionTerm.total).toEqualTypeOf<string | number>();
expectTypeOf(functionTerm.expression).toEqualTypeOf<string>();
expectTypeOf(functionTerm.function).toEqualTypeOf<CONFIG.Dice.RollFunction>();
expectTypeOf(functionTerm.isDeterministic).toEqualTypeOf<boolean>();
expectTypeOf(functionTerm.toJSON()).toEqualTypeOf<Record<string, unknown>>();

expectTypeOf(functionTerm.expression).toEqualTypeOf<string>();

expectTypeOf(foundry.dice.terms.FunctionTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<["fn", "terms", "rolls", "result"]>();

declare const node: FunctionRollParseNode;
expectTypeOf(foundry.dice.terms.FunctionTerm.fromParseNode(node)).toEqualTypeOf<foundry.dice.terms.RollTerm>();
