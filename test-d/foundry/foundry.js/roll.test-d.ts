import { expectType } from 'tsd';
import '../../index';

// Attack with advantage!
const r = new Roll('2d20kh + @prof + @strMod', { prof: 2, strMod: 4 });

// The parsed terms of the roll formula
// [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
expectType<RollTerm[]>(r.terms);

// Execute the roll
r.evaluate();

// The resulting equation after it was rolled
expectType<string>(r.result); // 16 + 2 + 4

// The total resulting from the roll
expectType<number | undefined>(r.total); // 22
