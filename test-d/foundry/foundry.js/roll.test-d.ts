import { expectType } from 'tsd';
import { MessageData } from '../../../src/foundry/foundry.js/roll';
import '../../index';

class CustomRoll<D extends object = {}> extends Roll<D> {}

CONFIG.Dice.rolls = [CustomRoll, Roll];

// Attack with advantage!
const r = new Roll('2d20kh + @prof + @strMod', { prof: 2, strMod: 4 });

// create the configured roll instance
expectType<CustomRoll<{}>>(Roll.create('1d20'));
expectType<CustomRoll<{ prof: number }>>(Roll.create('1d20 + @prof', { prof: 2 }));
expectType<CustomRoll<{}>>(Roll.fromTerms([]));

// The parsed terms of the roll formula
// [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
expectType<RollTerm[]>(r.terms);

// Execute the roll
type TypeOfR = Roll<{ prof: number; strMod: number }>;
expectType<Promise<TypeOfR>>(r.evaluate({ async: true }));
expectType<TypeOfR>(r.evaluate({ async: false }));
expectType<TypeOfR>(r.evaluate());
expectType<TypeOfR>(r.evaluate({ minimize: true, maximize: true }));

expectType<Promise<TypeOfR>>(r.roll({ async: true }));
expectType<TypeOfR>(r.roll({ async: false }));
expectType<TypeOfR>(r.roll());
expectType<TypeOfR>(r.roll({ minimize: true, maximize: true }));

expectType<Promise<TypeOfR>>(r.reroll({ async: true }));
expectType<TypeOfR>(r.reroll({ async: false }));
expectType<TypeOfR>(r.reroll());
expectType<TypeOfR>(r.reroll({ minimize: true, maximize: true }));

// The resulting equation after it was rolled
expectType<string>(r.result); // 16 + 2 + 4

// The total resulting from the roll
expectType<number | undefined>(r.total); // 22

expectType<Promise<ChatMessage | undefined>>(r.toMessage());
expectType<Promise<ChatMessage | undefined>>(r.toMessage({}, { create: true }));
expectType<MessageData<{}>>(r.toMessage({}, { create: false }));
expectType<Promise<ChatMessage | undefined> | MessageData<{}>>(r.toMessage({}, { create: false as boolean }));
