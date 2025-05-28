import { expectTypeOf } from "vitest";

const operatorTerm = new foundry.dice.terms.OperatorTerm({ operator: "+" });

expectTypeOf(operatorTerm.operator).toEqualTypeOf<string>();
expectTypeOf(operatorTerm.flavor).toEqualTypeOf<string>();
expectTypeOf(operatorTerm.expression).toEqualTypeOf<string>();
expectTypeOf(operatorTerm.total).toEqualTypeOf<string>();

expectTypeOf(foundry.dice.terms.OperatorTerm.PRECEDENCE).toEqualTypeOf<{
  "+": 10;
  "-": 10;
  "*": 20;
  "/": 20;
  "%": 20;
}>();
expectTypeOf(foundry.dice.terms.OperatorTerm.OPERATORS).toEqualTypeOf<string[]>();
expectTypeOf(foundry.dice.terms.OperatorTerm.REGEXP).toEqualTypeOf<RegExp>();
expectTypeOf(foundry.dice.terms.OperatorTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();
