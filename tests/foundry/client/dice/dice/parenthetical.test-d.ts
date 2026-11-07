import { expectTypeOf, test } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

declare const roll: foundry.dice.Roll;

declare const node: foundry.dice.types.ParentheticalRollParseNode;

test("foundry/client/dice/dice/parenthetical", () => {
  const parentheticalTerm = new foundry.dice.terms.ParentheticalTerm({ term: "" });
  new foundry.dice.terms.ParentheticalTerm({ roll });

  // @ts-expect-error The constructor destructures `termData` without a default, so it is required.
  new foundry.dice.terms.ParentheticalTerm();

  expectTypeOf(parentheticalTerm.term).toEqualTypeOf<string | undefined>();
  expectTypeOf(parentheticalTerm.roll).toEqualTypeOf<foundry.dice.Roll | undefined>();
  expectTypeOf(parentheticalTerm.isIntermediate).toEqualTypeOf<boolean>();
  expectTypeOf(parentheticalTerm.dice).toEqualTypeOf<foundry.dice.terms.DiceTerm[]>();
  expectTypeOf(parentheticalTerm.total).toEqualTypeOf<number | undefined>();
  expectTypeOf(parentheticalTerm.expression).toEqualTypeOf<string>();
  expectTypeOf(parentheticalTerm.isDeterministic).toEqualTypeOf<boolean>();
  expectTypeOf(parentheticalTerm.toJSON()).toEqualTypeOf<AnyMutableObject>();

  expectTypeOf(foundry.dice.terms.ParentheticalTerm.OPEN_REGEXP).toEqualTypeOf<RegExp>();
  expectTypeOf(foundry.dice.terms.ParentheticalTerm.CLOSE_REGEXP).toEqualTypeOf<RegExp>();
  expectTypeOf(foundry.dice.terms.ParentheticalTerm.SERIALIZE_ATTRIBUTES).toEqualTypeOf<string[]>();
  expectTypeOf(
    foundry.dice.terms.ParentheticalTerm.fromTerms([]),
  ).toEqualTypeOf<foundry.dice.terms.ParentheticalTerm>();
  expectTypeOf(
    foundry.dice.terms.ParentheticalTerm.fromParseNode(node),
  ).toEqualTypeOf<foundry.dice.terms.ParentheticalTerm>();
});
