import { expectTypeOf } from "vitest";
import type { ParentheticalRollParseNode } from "../../../../../src/foundry/client/dice/_types.d.mts";

const poolTerm = new foundry.dice.terms.PoolTerm();

expectTypeOf(poolTerm.terms).toEqualTypeOf<string[]>();
expectTypeOf(poolTerm.modifiers).toEqualTypeOf<(keyof foundry.dice.terms.PoolTerm.Modifiers)[]>();
expectTypeOf(poolTerm.rolls).toEqualTypeOf<foundry.dice.Roll[]>();
expectTypeOf(poolTerm.results).toEqualTypeOf<foundry.dice.terms.DiceTerm.Result[]>();
expectTypeOf(poolTerm.dice).toEqualTypeOf<foundry.dice.terms.DiceTerm[]>();
expectTypeOf(poolTerm.expression).toEqualTypeOf<string>();
expectTypeOf(poolTerm.total).toEqualTypeOf<number | undefined>();
expectTypeOf(poolTerm.values).toEqualTypeOf<number[]>();
expectTypeOf(poolTerm.isDeterministic).toEqualTypeOf<boolean>();
expectTypeOf(poolTerm.alter(3, 3)).toEqualTypeOf<foundry.dice.terms.PoolTerm>();
expectTypeOf(poolTerm.toJSON()).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(poolTerm.keep("")).toEqualTypeOf<boolean | void>();
expectTypeOf(poolTerm.drop("")).toEqualTypeOf<boolean | void>();
expectTypeOf(poolTerm.countSuccess("")).toEqualTypeOf<boolean | void>();
expectTypeOf(poolTerm.countFailures("")).toEqualTypeOf<boolean | void>();

expectTypeOf(foundry.dice.terms.PoolTerm.MODIFIERS).toEqualTypeOf<foundry.dice.terms.PoolTerm.Modifiers>();
expectTypeOf(foundry.dice.terms.PoolTerm.OPEN_REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.PoolTerm.CLOSE_REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.PoolTerm.REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.PoolTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();
expectTypeOf(foundry.dice.terms.PoolTerm.fromExpression("")).toEqualTypeOf<foundry.dice.terms.PoolTerm | null>();
expectTypeOf(foundry.dice.terms.PoolTerm.fromRolls([])).toEqualTypeOf<foundry.dice.terms.PoolTerm>();

declare const node: ParentheticalRollParseNode;
expectTypeOf(
  foundry.dice.terms.ParentheticalTerm.fromParseNode(node),
).toEqualTypeOf<foundry.dice.terms.ParentheticalTerm>();
