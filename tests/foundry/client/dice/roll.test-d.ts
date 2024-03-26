import { expectTypeOf } from "vitest";
import type { Evaluated, MessageData } from "../../../../src/foundry/client/dice/roll.d.mts";

class CustomRoll<D extends object = {}> extends Roll<D> {}

CONFIG.Dice.rolls = [CustomRoll, Roll];

// Attack with advantage!
const r = new Roll("2d20kh + @prof + @strMod", { prof: 2, strMod: 4 });

// create the configured roll instance
expectTypeOf(Roll.create("1d20")).toEqualTypeOf<CustomRoll<{}>>();
expectTypeOf(Roll.create("1d20 + @prof", { prof: 2 })).toEqualTypeOf<CustomRoll<{ prof: number }>>();
expectTypeOf(Roll.fromTerms([])).toEqualTypeOf<Roll<object>>();
expectTypeOf(CustomRoll.fromTerms([])).toEqualTypeOf<CustomRoll<object>>();

// The parsed terms of the roll formula
// [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
expectTypeOf(r.terms).toEqualTypeOf<RollTerm[]>();

// Execute the roll
type TypeOfR = Roll<{ prof: number; strMod: number }>;
expectTypeOf(r.evaluate({ async: true })).toEqualTypeOf<Promise<Evaluated<TypeOfR>>>();
expectTypeOf(r.evaluate({ async: false })).toEqualTypeOf<Evaluated<TypeOfR>>();
expectTypeOf(r.evaluate()).toEqualTypeOf<Promise<Evaluated<TypeOfR>>>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true })).toEqualTypeOf<Evaluated<TypeOfR>>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as boolean })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as boolean | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as false | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR>
>();
expectTypeOf(r.evaluate({ minimize: true, maximize: true, async: false as true | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf((await r.evaluate()).total).toEqualTypeOf<number>();

expectTypeOf(r.roll({ async: true })).toEqualTypeOf<Promise<Evaluated<TypeOfR>>>();
expectTypeOf(r.roll({ async: false })).toEqualTypeOf<Evaluated<TypeOfR>>();
expectTypeOf(r.roll()).toEqualTypeOf<Promise<Evaluated<TypeOfR>>>();
expectTypeOf(r.roll({ minimize: true, maximize: true })).toEqualTypeOf<Evaluated<TypeOfR>>();
expectTypeOf(r.roll({ minimize: true, maximize: true, async: false as boolean })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf(r.roll({ minimize: true, maximize: true, async: false as boolean | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf(r.roll({ minimize: true, maximize: true, async: false as false | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR>
>();
expectTypeOf(r.roll({ minimize: true, maximize: true, async: false as true | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf((await r.roll()).total).toEqualTypeOf<number>();

expectTypeOf(r.reroll({ async: true })).toEqualTypeOf<Promise<Evaluated<TypeOfR>>>();
expectTypeOf(r.reroll({ async: false })).toEqualTypeOf<Evaluated<TypeOfR>>();
expectTypeOf(r.reroll()).toEqualTypeOf<Promise<Evaluated<TypeOfR>>>();
expectTypeOf(r.reroll({ minimize: true, maximize: true })).toEqualTypeOf<Evaluated<TypeOfR>>();
expectTypeOf(r.reroll({ minimize: true, maximize: true, async: false as boolean })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf(r.reroll({ minimize: true, maximize: true, async: false as boolean | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf(r.reroll({ minimize: true, maximize: true, async: false as false | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR>
>();
expectTypeOf(r.reroll({ minimize: true, maximize: true, async: false as true | undefined })).toEqualTypeOf<
  Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>
>();
expectTypeOf((await r.reroll()).total).toEqualTypeOf<number>();

// The resulting equation after it was rolled
expectTypeOf(r.result).toEqualTypeOf<string>(); // 16 + 2 + 4

// The total resulting from the roll
expectTypeOf(r.total).toEqualTypeOf<number | undefined>(); // 22

expectTypeOf(r.toMessage()).toEqualTypeOf<Promise<ChatMessage | undefined>>();
expectTypeOf(r.toMessage({}, { create: true })).toEqualTypeOf<Promise<ChatMessage | undefined>>();
expectTypeOf(r.toMessage({}, { create: false })).toEqualTypeOf<MessageData<{}>>();
expectTypeOf(r.toMessage({}, { create: false as boolean })).toEqualTypeOf<
  Promise<ChatMessage | undefined> | MessageData<{}>
>();
