import { expectTypeOf } from "vitest";
import type { AnyObject, EmptyObject } from "fvtt-types/utils";
import type { RollParseNode } from "../../../../src/foundry/client-esm/dice/_types.d.mts";

class CustomRoll<D extends Record<string, unknown> = EmptyObject> extends Roll<D> {}
expectTypeOf(Roll).toEqualTypeOf<foundry.dice.Roll>();

// Attack with advantage!
type RollType = Roll<{ prof: number; strMod: number }>;

const roll = new Roll("2d20kh + @prof + @strMod", { prof: 2, strMod: 4 });
expectTypeOf(roll.data).toEqualTypeOf<{ prof: number; strMod: number }>();
expectTypeOf(roll.options).toEqualTypeOf<Roll.Options>();

// The parsed terms of the roll formula
// [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
expectTypeOf(roll.terms).toEqualTypeOf<foundry.dice.terms.RollTerm[]>();

expectTypeOf(roll.dice).toEqualTypeOf<foundry.dice.terms.DiceTerm[]>();
expectTypeOf(roll.formula).toEqualTypeOf<string>();

// The resulting equation after it was rolled
expectTypeOf(roll.result).toEqualTypeOf<string>(); // 16 + 2 + 4

// The total resulting from the roll
expectTypeOf(roll.total).toEqualTypeOf<number | undefined>(); // 22

expectTypeOf(roll.product).toEqualTypeOf<number | undefined>();
expectTypeOf(roll.isDeterministic).toEqualTypeOf<boolean>();
expectTypeOf(roll.alter(1, 2)).toEqualTypeOf<RollType>();
expectTypeOf(roll.clone()).toEqualTypeOf<RollType>();

// Execute the roll
type TypeOfR = Roll<{ prof: number; strMod: number }>;
expectTypeOf(roll.evaluate()).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf(roll.evaluate({ minimize: true, maximize: true })).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf((await roll.evaluate()).total).toEqualTypeOf<number>();

expectTypeOf(roll.evaluateSync()).toEqualTypeOf<Roll.Evaluated<TypeOfR>>();

expectTypeOf(roll.roll()).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf(roll.roll()).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf(roll.roll({ minimize: true, maximize: true })).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf((await roll.roll()).total).toEqualTypeOf<number>();

declare const customRoll: CustomRoll<EmptyObject>;
expectTypeOf(await customRoll.roll()).toEqualTypeOf<Roll.Evaluated<CustomRoll<EmptyObject>>>();

expectTypeOf(roll.reroll()).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf(roll.reroll({ minimize: true, maximize: true })).toEqualTypeOf<Promise<Roll.Evaluated<TypeOfR>>>();
expectTypeOf((await roll.reroll()).total).toEqualTypeOf<number>();

expectTypeOf(roll.resetFormula()).toEqualTypeOf<string>();
expectTypeOf(roll.propagateFlavor("")).toEqualTypeOf<void>();
expectTypeOf(roll.toString()).toEqualTypeOf<string>();
expectTypeOf(roll.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();
expectTypeOf(roll.toJSON()).toEqualTypeOf<{
  class: string;
  options: Roll.Options;
  dice: foundry.dice.terms.DiceTerm[];
  formula: string;
  terms: foundry.dice.terms.RollTerm[];
  total: number | undefined;
  evaluated: boolean;
}>();
expectTypeOf(roll.getTooltip()).toEqualTypeOf<Promise<string>>();
expectTypeOf(roll.render()).toEqualTypeOf<Promise<string>>();

declare const testBool: boolean;
expectTypeOf(roll.toMessage()).toEqualTypeOf<Promise<ChatMessage.Implementation | undefined>>();
expectTypeOf(roll.toMessage({}, { create: true })).toEqualTypeOf<Promise<ChatMessage.Implementation | undefined>>();
expectTypeOf(roll.toMessage({}, { create: false })).toEqualTypeOf<
  Promise<foundry.data.fields.SchemaField.SourceData<ChatMessage.Schema>>
>();
expectTypeOf(roll.toMessage({}, { create: null })).toEqualTypeOf<
  Promise<foundry.data.fields.SchemaField.SourceData<ChatMessage.Schema>>
>();
expectTypeOf(roll.toMessage({}, { create: testBool })).toEqualTypeOf<
  Promise<ChatMessage.Implementation | undefined | foundry.data.fields.SchemaField.SourceData<ChatMessage.Schema>>
>();

expectTypeOf(Roll.MATH_PROXY).toEqualTypeOf<Math>();
expectTypeOf(Roll.CHAT_TEMPLATE).toEqualTypeOf<string>();
expectTypeOf(Roll.TOOLTIP_TEMPLATE).toEqualTypeOf<string>();
expectTypeOf(Roll.RESOLVERS).toEqualTypeOf<Map<Roll, foundry.applications.dice.RollResolver>>();

// create the configured roll instance
// TODO: Find way to ensure that first element of CONFIG.Dice.rolls array is used by `Roll.create`
// expectTypeOf(Roll.create("1d20")).toEqualTypeOf<CustomRoll<EmptyObject>>();
// expectTypeOf(Roll.create("1d20 + @prof", { prof: 2 })).toEqualTypeOf<CustomRoll<{ prof: number }>>();
// expectTypeOf(Roll.fromTerms([])).toEqualTypeOf<CustomRoll<EmptyObject>>();
// expectTypeOf(Roll.defaultImplementation).toEqualTypeOf<CustomRoll<EmptyObject>>();

expectTypeOf(Roll.resolverImplementation).toEqualTypeOf<typeof foundry.applications.dice.RollResolver>();
expectTypeOf(Roll.getFormula([])).toEqualTypeOf<string>();
expectTypeOf(Roll.safeEval("")).toEqualTypeOf<number>();
expectTypeOf(Roll.simplifyTerms([])).toEqualTypeOf<foundry.dice.terms.RollTerm[]>();
expectTypeOf(Roll.simulate("")).toEqualTypeOf<Promise<number[]>>();
expectTypeOf(Roll.registerResult("", "", 1)).toEqualTypeOf<boolean | void>();
expectTypeOf(Roll.parse("", {})).toEqualTypeOf<foundry.dice.terms.RollTerm[]>();

declare const rpn: RollParseNode;
expectTypeOf(Roll.instantiateAST(rpn)).toEqualTypeOf<foundry.dice.terms.RollTerm[]>();
expectTypeOf(Roll.replaceFormulaData("", {})).toEqualTypeOf<string>();
expectTypeOf(Roll.validate("")).toEqualTypeOf<boolean>();
expectTypeOf(Roll.identifyFulfillableTerms([])).toEqualTypeOf<foundry.dice.terms.DiceTerm[]>();
expectTypeOf(Roll._classifyStringTerm("")).toEqualTypeOf<foundry.dice.terms.RollTerm>();

declare const a: HTMLAnchorElement;
expectTypeOf(Roll.expandInlineResult(a)).toEqualTypeOf<Promise<void>>();
expectTypeOf(Roll.collapseInlineResult(a)).toEqualTypeOf<void>();

declare const d: foundry.dice.Roll.Data;

expectTypeOf(Roll.fromData(d)).toEqualTypeOf<Roll<AnyObject>>();
expectTypeOf(Roll.fromJSON("")).toEqualTypeOf<Roll<AnyObject>>();
expectTypeOf(Roll.fromTerms([])).toEqualTypeOf<Roll<AnyObject>>();

expectTypeOf(CustomRoll.fromData(d)).toEqualTypeOf<CustomRoll<Record<string, unknown>>>();
expectTypeOf(CustomRoll.fromJSON("")).toEqualTypeOf<CustomRoll<Record<string, unknown>>>();
expectTypeOf(CustomRoll.fromTerms([])).toEqualTypeOf<CustomRoll<Record<string, unknown>>>();

CONFIG.Dice.rolls = [CustomRoll, Roll];
const rollCls = CONFIG.Dice.rolls[0];
expectTypeOf(rollCls!.CHAT_TEMPLATE).toEqualTypeOf<string>();
