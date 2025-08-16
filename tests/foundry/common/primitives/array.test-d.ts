import { describe, expectTypeOf, test } from "vitest";

declare const actor: Actor.Implementation;

describe("Array Extension Tests", () => {
  test("deepFlatten", () => {
    expectTypeOf([["testing"], [["test"], ["test"]], "test"].deepFlatten()).toEqualTypeOf<string[]>();
    expectTypeOf([["testing"], [[3], [4]], "test"].deepFlatten()).toEqualTypeOf<Array<string | number>>();
  });

  test("equals", () => {
    // @ts-expect-error can't compare arrays that don't have overlapping element types
    ["foo", "bar"].equals([1, 2]);
    expectTypeOf([].equals([])).toEqualTypeOf<boolean>();
    expectTypeOf(["foo", "bar"].equals([])).toEqualTypeOf<boolean>();
    expectTypeOf(["foo", "bar"].equals(["fizz", "buzz"])).toEqualTypeOf<boolean>();
    expectTypeOf([actor].equals([actor])).toEqualTypeOf<boolean>();
  });

  test("partition", () => {
    expectTypeOf(Array<"a" | "b">().partition((val): val is "b" => val === "b")).toEqualTypeOf<["a"[], "b"[]]>();
    expectTypeOf([1, ""].partition((val): val is string => typeof val === "string")).toEqualTypeOf<
      [number[], string[]]
    >();
    expectTypeOf(Array<string>().partition((val): boolean => val.length < 5)).toEqualTypeOf<[string[], string[]]>();
    expectTypeOf(Array<string>().partition((val) => val.length < 5)).toEqualTypeOf<[string[], string[]]>();
  });

  test("filterJoin", () => {
    expectTypeOf([].filterJoin("")).toEqualTypeOf<string>();
  });

  test("findSplice", () => {
    expectTypeOf(["a"].findSplice((_val: string, _i: number, _obj: string[]) => true)).toEqualTypeOf<string | null>();
  });

  test("fromRange", () => {
    expectTypeOf(Array.fromRange(20)).toEqualTypeOf<number[]>();
    expectTypeOf(Array.fromRange(20, 10)).toEqualTypeOf<number[]>();
  });
});
