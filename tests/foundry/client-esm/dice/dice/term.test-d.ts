import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";
import type { RollParseNode } from "../../../../../src/foundry/client-esm/dice/_types.d.mts";

declare const rollTerm: foundry.dice.terms.RollTerm;

expectTypeOf(rollTerm.options).toEqualTypeOf<foundry.dice.terms.RollTerm.Options>();
expectTypeOf(rollTerm.isIntermediate).toEqualTypeOf<boolean>();
expectTypeOf(rollTerm.expression).toEqualTypeOf<string>();
expectTypeOf(rollTerm.formula).toEqualTypeOf<string>();
expectTypeOf(rollTerm.total).toEqualTypeOf<number | string | null | undefined>();
expectTypeOf(rollTerm.flavor).toEqualTypeOf<string>();
expectTypeOf(rollTerm.isDeterministic).toEqualTypeOf<boolean>();
expectTypeOf(rollTerm.resolver).toEqualTypeOf<foundry.applications.dice.RollResolver>();
expectTypeOf(rollTerm.evaluate()).toEqualTypeOf<MaybePromise<foundry.dice.terms.RollTerm>>();
expectTypeOf(rollTerm.toJSON()).toEqualTypeOf<Record<string, unknown>>();

expectTypeOf(foundry.dice.terms.RollTerm.FLAVOR_REGEXP_STRING).toEqualTypeOf<string>();
expectTypeOf(foundry.dice.terms.RollTerm.REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.RollTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();

declare const term: foundry.dice.terms.RollTerm;
expectTypeOf(foundry.dice.terms.RollTerm.isDeterministic(term)).toEqualTypeOf<boolean>();
expectTypeOf(foundry.dice.terms.RollTerm.fromData({})).toEqualTypeOf<foundry.dice.terms.RollTerm>();

declare const node: RollParseNode;
expectTypeOf(foundry.dice.terms.RollTerm.fromParseNode(node)).toEqualTypeOf<foundry.dice.terms.RollTerm>();
expectTypeOf(foundry.dice.terms.RollTerm.fromJSON("")).toEqualTypeOf<foundry.dice.terms.RollTerm>();
