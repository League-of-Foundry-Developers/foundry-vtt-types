import { expectTypeOf } from "vitest";

const numericTerm = new foundry.dice.terms.NumericTerm({ number: 6 });

expectTypeOf(numericTerm.number).toEqualTypeOf<number>();
expectTypeOf(numericTerm.expression).toEqualTypeOf<string>();
expectTypeOf(numericTerm.total).toEqualTypeOf<number>();

expectTypeOf(foundry.dice.terms.NumericTerm.REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.NumericTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();
expectTypeOf(foundry.dice.terms.NumericTerm.matchTerm("")).toEqualTypeOf<RegExpMatchArray | null>();

declare const rema: RegExpMatchArray;
expectTypeOf(foundry.dice.terms.NumericTerm.fromMatch(rema)).toEqualTypeOf<foundry.dice.terms.NumericTerm>();
