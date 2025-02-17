import { expectTypeOf } from "vitest";

declare const set: Set<string>;
declare const set2: Set<string>;

expectTypeOf(set.difference(set2)).toEqualTypeOf<Set<string>>();
expectTypeOf(set.equals(set2)).toEqualTypeOf<boolean>();
expectTypeOf(set.first()).toEqualTypeOf<string | undefined>();
expectTypeOf(set.intersection(set2)).toEqualTypeOf<Set<string>>();
expectTypeOf(set.intersects(set2)).toEqualTypeOf<boolean>();
expectTypeOf(set.intersects(set2)).toEqualTypeOf<boolean>();
expectTypeOf(set.toObject()).toEqualTypeOf<string[]>();
expectTypeOf(set.every((_val: string, _idx: number, _set: Set<string>) => true)).toEqualTypeOf<boolean>();

expectTypeOf(new Set<number | string>().filter((value): value is string => typeof value === "string")).toEqualTypeOf<
  Set<string>
>();
expectTypeOf(new Set<"a" | "b">().filter((value): value is "a" => value === "a")).toEqualTypeOf<Set<"a">>();

expectTypeOf(new Set<number>().find((value) => value > 5)).toEqualTypeOf<number | undefined>();
expectTypeOf(new Set<number | string>().find((value): value is number => typeof value === "number")).toEqualTypeOf<
  number | undefined
>();
expectTypeOf(new Set<"a" | "b">().find((value): value is "a" => value === "a")).toEqualTypeOf<"a" | undefined>();

expectTypeOf(set.map((_v: string, _i: number, _s: Set<string>) => true)).toEqualTypeOf<Set<boolean>>();

type ReduceType = {
  foo: string;
};
expectTypeOf(
  set.reduce((_a: ReduceType, _v: string, _i: number, _s: Set<string>): ReduceType => ({ foo: "a" }), {
    foo: "a",
  } as ReduceType),
).toEqualTypeOf<ReduceType>();

expectTypeOf(set.some((_v: string, _i: number, _s: Set<string>) => true)).toEqualTypeOf<boolean>();
