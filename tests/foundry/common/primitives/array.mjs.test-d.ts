import { expectTypeOf } from "vitest";
import "../../index";

expectTypeOf([["testing"], "test"].deepFlatten()).toEqualTypeOf<string[]>();

expectTypeOf(Array<"a" | "b">().partition((val): val is "b" => val === "b")).toEqualTypeOf<["a"[], "b"[]]>();
expectTypeOf([1, ""].partition((val): val is string => typeof val === "string")).toEqualTypeOf<[number[], string[]]>();
expectTypeOf(Array<string>().partition((val): boolean => val.length < 5)).toEqualTypeOf<[string[], string[]]>();
expectTypeOf(Array<string>().partition((val) => val.length < 5)).toEqualTypeOf<[string[], string[]]>();
