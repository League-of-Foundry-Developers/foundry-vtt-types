import { expectTypeOf } from "vitest";
import type { EmptyObject } from "../../../../src/types/utils.d.mts";

class CustomRoll<D extends Record<string, unknown> = EmptyObject> extends Roll<D> {}

CONFIG.Dice.rolls = [CustomRoll, Roll];

const rollCls = CONFIG.Dice.rolls[0];

expectTypeOf(rollCls.CHAT_TEMPLATE).toEqualTypeOf<string>();

// Attack with advantage!
const r = new Roll("2d20kh + @prof + @strMod", { prof: 2, strMod: 4 });

// create the configured roll instance
// TODO: Find way to ensure that first element of CONFIG.Dice.rolls array is used by `Roll.create`
// expectTypeOf(Roll.create("1d20")).toEqualTypeOf<CustomRoll<EmptyObject>>();
// expectTypeOf(Roll.create("1d20 + @prof", { prof: 2 })).toEqualTypeOf<CustomRoll<{ prof: number }>>();
// expectTypeOf(Roll.fromTerms([])).toEqualTypeOf<Roll<EmptyObject>>();
// expectTypeOf(CustomRoll.fromTerms([])).toEqualTypeOf<CustomRoll<EmptyObject>>();

// The parsed terms of the roll formula
// [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
expectTypeOf(r.terms).toEqualTypeOf<foundry.dice.terms.RollTerm[]>();

// Execute the roll
type TypeOfR = Roll<{ prof: number; strMod: number }>;
expectTypeOf(r.evaluate()).toEqualTypeOf<Promise<foundry.dice.Roll.Evaluated<TypeOfR>>>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true })).toEqualTypeOf<
  Promise<foundry.dice.Roll.Evaluated<TypeOfR>>
>();
expectTypeOf((await r.evaluate()).total).toEqualTypeOf<number>();

expectTypeOf(r.roll()).toEqualTypeOf<Promise<foundry.dice.Roll.Evaluated<TypeOfR>>>();
expectTypeOf(r.roll()).toEqualTypeOf<Promise<foundry.dice.Roll.Evaluated<TypeOfR>>>();
expectTypeOf(r.roll({ minimize: true, maximize: true })).toEqualTypeOf<Promise<foundry.dice.Roll.Evaluated<TypeOfR>>>();
expectTypeOf((await r.roll()).total).toEqualTypeOf<number>();

expectTypeOf(r.reroll()).toEqualTypeOf<Promise<foundry.dice.Roll.Evaluated<TypeOfR>>>();
expectTypeOf(r.reroll({ minimize: true, maximize: true })).toEqualTypeOf<
  Promise<foundry.dice.Roll.Evaluated<TypeOfR>>
>();
expectTypeOf((await r.reroll()).total).toEqualTypeOf<number>();

// The resulting equation after it was rolled
expectTypeOf(r.result).toEqualTypeOf<string>(); // 16 + 2 + 4

// The total resulting from the roll
expectTypeOf(r.total).toEqualTypeOf<number | undefined>(); // 22

declare const testBool: boolean;

expectTypeOf(r.toMessage()).toEqualTypeOf<Promise<ChatMessage | undefined>>();
expectTypeOf(r.toMessage({}, { create: true })).toEqualTypeOf<Promise<ChatMessage | undefined>>();
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
expectTypeOf(r.toMessage({}, { create: false })).toEqualTypeOf<Promise<foundry.dice.Roll.MessageData<{}>>>();
expectTypeOf(r.toMessage({}, { create: testBool })).toEqualTypeOf<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Promise<ChatMessage | undefined | foundry.dice.Roll.MessageData<{}>>
>();
