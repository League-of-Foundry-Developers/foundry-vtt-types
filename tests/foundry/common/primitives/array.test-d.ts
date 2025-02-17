import { expectTypeOf } from "vitest";

expectTypeOf([["testing"], [["test"], ["test"]], "test"].deepFlatten()).toEqualTypeOf<string[]>();
expectTypeOf([["testing"], [[3], [4]], "test"].deepFlatten()).toEqualTypeOf<Array<string | number>>();

expectTypeOf([].equals([])).toEqualTypeOf<boolean>();

expectTypeOf(Array<"a" | "b">().partition((val): val is "b" => val === "b")).toEqualTypeOf<["a"[], "b"[]]>();
expectTypeOf([1, ""].partition((val): val is string => typeof val === "string")).toEqualTypeOf<[number[], string[]]>();
expectTypeOf(Array<string>().partition((val): boolean => val.length < 5)).toEqualTypeOf<[string[], string[]]>();
expectTypeOf(Array<string>().partition((val) => val.length < 5)).toEqualTypeOf<[string[], string[]]>();

expectTypeOf([].filterJoin("")).toEqualTypeOf<string>();
expectTypeOf(["a"].findSplice((_val: string, _i: number, _obj: string[]) => true)).toEqualTypeOf<string | null>();
