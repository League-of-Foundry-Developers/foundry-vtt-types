import type { Evaluated, MessageData } from '../../../src/foundry/foundry.js/roll';

import { expectType } from 'tsd';
import '../../index';

class CustomRoll<D extends object = {}> extends Roll<D> {}

CONFIG.Dice.rolls = [CustomRoll, Roll];

// Attack with advantage!
const r = new Roll('2d20kh + @prof + @strMod', { prof: 2, strMod: 4 });

// create the configured roll instance
expectType<CustomRoll<{}>>(Roll.create('1d20'));
expectType<CustomRoll<{ prof: number }>>(Roll.create('1d20 + @prof', { prof: 2 }));
expectType<Roll<object>>(Roll.fromTerms([]));
expectType<CustomRoll<object>>(CustomRoll.fromTerms([]));

// The parsed terms of the roll formula
// [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
expectType<RollTerm[]>(r.terms);

// Execute the roll
type TypeOfR = Roll<{ prof: number; strMod: number }>;
expectType<Promise<Evaluated<TypeOfR>>>(r.evaluate({ async: true }));
expectType<Evaluated<TypeOfR>>(r.evaluate({ async: false }));
expectType<Evaluated<TypeOfR>>(r.evaluate());
expectType<Evaluated<TypeOfR>>(r.evaluate({ minimize: true, maximize: true }));
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.evaluate({ minimize: true, maximize: true, async: false as boolean })
);
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.evaluate({ minimize: true, maximize: true, async: false as boolean | undefined })
);
expectType<Evaluated<TypeOfR>>(r.evaluate({ minimize: true, maximize: true, async: false as false | undefined }));
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.evaluate({ minimize: true, maximize: true, async: false as true | undefined })
);
expectType<number>(await r.evaluate().total);

expectType<Promise<Evaluated<TypeOfR>>>(r.roll({ async: true }));
expectType<Evaluated<TypeOfR>>(r.roll({ async: false }));
expectType<Evaluated<TypeOfR>>(r.roll());
expectType<Evaluated<TypeOfR>>(r.roll({ minimize: true, maximize: true }));
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.roll({ minimize: true, maximize: true, async: false as boolean })
);
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.roll({ minimize: true, maximize: true, async: false as boolean | undefined })
);
expectType<Evaluated<TypeOfR>>(r.roll({ minimize: true, maximize: true, async: false as false | undefined }));
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.roll({ minimize: true, maximize: true, async: false as true | undefined })
);
expectType<number>(await r.roll().total);

expectType<Promise<Evaluated<TypeOfR>>>(r.reroll({ async: true }));
expectType<Evaluated<TypeOfR>>(r.reroll({ async: false }));
expectType<Evaluated<TypeOfR>>(r.reroll());
expectType<Evaluated<TypeOfR>>(r.reroll({ minimize: true, maximize: true }));
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.reroll({ minimize: true, maximize: true, async: false as boolean })
);
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.reroll({ minimize: true, maximize: true, async: false as boolean | undefined })
);
expectType<Evaluated<TypeOfR>>(r.reroll({ minimize: true, maximize: true, async: false as false | undefined }));
expectType<Evaluated<TypeOfR> | Promise<Evaluated<TypeOfR>>>(
  r.reroll({ minimize: true, maximize: true, async: false as true | undefined })
);
expectType<number>(await r.reroll().total);

// The resulting equation after it was rolled
expectType<string>(r.result); // 16 + 2 + 4

// The total resulting from the roll
expectType<number | undefined>(r.total); // 22

expectType<Promise<ChatMessage | undefined>>(r.toMessage());
expectType<Promise<ChatMessage | undefined>>(r.toMessage({}, { create: true }));
expectType<MessageData<{}>>(r.toMessage({}, { create: false }));
expectType<Promise<ChatMessage | undefined> | MessageData<{}>>(r.toMessage({}, { create: false as boolean }));
