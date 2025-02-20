import { expectTypeOf } from "vitest";

const stringTerm = new foundry.dice.terms.StringTerm({ term: "aaa" });

expectTypeOf(stringTerm.term).toEqualTypeOf<string>();
expectTypeOf(stringTerm.expression).toEqualTypeOf<string>();
expectTypeOf(stringTerm.total).toEqualTypeOf<string>();
expectTypeOf(stringTerm.isDeterministic).toEqualTypeOf<boolean>();
expectTypeOf(stringTerm.evaluate()).toEqualTypeOf<never>();

expectTypeOf(foundry.dice.terms.StringTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();
