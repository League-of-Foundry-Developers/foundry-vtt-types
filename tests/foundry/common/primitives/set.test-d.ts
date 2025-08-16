import { describe, expectTypeOf, test } from "vitest";

declare const stringSet: Set<string>;
declare const stringSet2: Set<string>;
declare const numberSet: Set<number>;
declare const stringUnionSet: Set<"foo" | "bar">;
declare const numberOrStringSet: Set<number | string>;

type ReduceType = {
  foo: string;
};

describe("Set Tests", () => {
  test("Miscellaneous", () => {
    expectTypeOf(stringSet.first()).toEqualTypeOf<string | undefined>();
    expectTypeOf(numberSet.first()).toEqualTypeOf<number | undefined>();

    expectTypeOf(stringSet.toObject()).toEqualTypeOf<string[]>();
    expectTypeOf(numberSet.toObject()).toEqualTypeOf<number[]>();
  });

  test("Comparison", () => {
    expectTypeOf(stringSet.equals(stringSet2)).toBeBoolean();
    expectTypeOf(stringUnionSet.equals(stringSet)).toBeBoolean();
    expectTypeOf(stringSet.equals(stringUnionSet)).toBeBoolean();
    // @ts-expect-error A set cannot equal a set with an element type its does not overlap with
    stringSet.equals(numberSet);

    expectTypeOf(stringSet.intersects(stringSet2)).toBeBoolean();
    expectTypeOf(stringUnionSet.intersects(stringSet)).toBeBoolean();
    expectTypeOf(stringSet.intersects(stringUnionSet)).toBeBoolean();
    // @ts-expect-error A set cannot intersect a set with an element type its does not overlap with
    stringSet.intersects(numberSet);
  });

  test("Composition tests", () => {
    expectTypeOf(stringSet.every((_val: string, _idx: number, _set: Set<string>) => true)).toEqualTypeOf<boolean>();

    expectTypeOf(stringSet.some((_v: string, _i: number, _s: Set<string>) => true)).toEqualTypeOf<boolean>();
  });

  test("Search", () => {
    expectTypeOf(numberOrStringSet.filter((value): value is string => typeof value === "string")).toEqualTypeOf<
      Set<string>
    >();
    expectTypeOf(stringUnionSet.filter((value): value is "foo" => value === "foo")).toEqualTypeOf<Set<"foo">>();

    expectTypeOf(numberSet.find((value) => value > 5)).toEqualTypeOf<number | undefined>();
    expectTypeOf(numberOrStringSet.find((value): value is number => typeof value === "number")).toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf(stringUnionSet.find((value): value is "bar" => value === "bar")).toEqualTypeOf<"bar" | undefined>();
  });

  test("Transforms", () => {
    expectTypeOf(stringSet.map((_v: string, _i: number, _s: Set<string>) => true)).toEqualTypeOf<Set<boolean>>();

    expectTypeOf(
      stringSet.reduce((_a: ReduceType, _v: string, _i: number, _s: Set<string>): ReduceType => ({ foo: "a" }), {
        foo: "a",
      } as ReduceType),
    ).toEqualTypeOf<ReduceType>();
  });

  test("Deprecated", () => {
    // Deprecated since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(stringSet.isSubset(stringSet2)).toBeBoolean();
    // @ts-expect-error A set cannot be a subset of a set with an element type its does not overlap with
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    stringSet.isSubset(numberSet);
  });
});
