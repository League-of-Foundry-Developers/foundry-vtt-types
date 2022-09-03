import { expectType } from "tsd";
import type { ArrayOrTupleKey, DotNotationKeys, GetValueFromDotKey } from "../../src/types/helperTypes";

declare function type<T>(): T;

// basic objects
expectType<"k1">(type<DotNotationKeys<{ k1: 1 }>>());
expectType<"k2">(type<DotNotationKeys<{ k2: 1 }>>());
expectType<"k1" | "k2">(type<DotNotationKeys<{ k1: 1; k2: 1 }>>());

// objects with depth
expectType<"k1" | "k2" | "deep" | "deep.value">(type<DotNotationKeys<{ k1: 1; k2: 1; deep: { value: 1 } }>>());
expectType<
  | "a"
  | "a.really"
  | "a.really.deep"
  | "a.really.deep.object"
  | "a.really.deep.object.holding"
  | "a.really.deep.object.holding.a"
  | "a.really.deep.object.holding.a.value"
>(type<DotNotationKeys<{ a: { really: { deep: { object: { holding: { a: { value: 1 } } } } } } }>>());

// arrays
expectType<`${number}`>(type<DotNotationKeys<number[]>>());
expectType<`${number}` | `${number}.${number}`>(type<DotNotationKeys<number[][]>>());
expectType<`${number}` | `${number}.${number}` | `${number}.${number}.${number}`>(
  type<DotNotationKeys<number[][][]>>()
);

// tuples!
expectType<"0">(type<ArrayOrTupleKey<[9]>>());
expectType<"0" | "1">(type<ArrayOrTupleKey<[9, 9]>>());
expectType<number>(type<ArrayOrTupleKey<9[]>>());
expectType<"0">(type<DotNotationKeys<[9]>>());
expectType<"0" | "1">(type<DotNotationKeys<[9, 9]>>());
expectType<"0" | "0.int" | "0.str">(type<DotNotationKeys<[{ int: 1; str: "" }]>>());
expectType<"0" | "0.int" | "0.str" | "1">(type<DotNotationKeys<[{ int: 1; str: "" }, 2]>>());

// arrays with objects
expectType<`${number}` | `${number}.k1`>(type<DotNotationKeys<{ k1: 1 }[]>>());
expectType<`${number}` | `${number}.k2`>(type<DotNotationKeys<{ k2: 2 }[]>>());
expectType<`${number}` | `${number}.k1` | `${number}.k2`>(type<DotNotationKeys<{ k1: 1; k2: 2 }[]>>());

// objects with arrays
expectType<`array` | `array.${number}`>(type<DotNotationKeys<{ array: number[] }>>());
expectType<`array` | `array.${number}` | `deep` | `deep.array` | `deep.array.${number}`>(
  type<DotNotationKeys<{ array: number[]; deep: { array: number[] } }>>()
);

// objects with tuples
expectType<"tuple" | "tuple.0" | "tuple.1" | "tuple.0.name" | "tuple.1.name">(
  type<DotNotationKeys<{ tuple: [{ name: string }, { name: string }] }>>()
);

// mixed
expectType<"tuple" | "tuple.0" | "tuple.1" | "tuple.2" | "array" | `array.${number}` | "deep" | "deep.value">(
  type<DotNotationKeys<{ tuple: [1, 2, 3]; array: number[]; deep: { value: number } }>>()
);
expectType<"0" | "1" | `1.${number}` | "2" | "2.value">(type<DotNotationKeys<[1, number[], { value: number }]>>());
expectType<`${number}` | `${number}.0` | `${number}.1`>(type<DotNotationKeys<[number, number][]>>());

expectType<number>(type<GetValueFromDotKey<{ value: number }, "value">>());
expectType<number>(type<GetValueFromDotKey<[number, 1], "0">>());
