import { expectTypeOf } from "vitest";
import "../../index";

expectTypeOf(new Set<number | string>().filter((value): value is string => typeof value === "string")).toEqualTypeOf<
  Set<string>
>();
expectTypeOf(new Set<"a" | "b">().filter((value): value is "a" => value === "a")).toEqualTypeOf<Set<"a">>();

expectTypeOf(new Set<number>().find((value) => value > 5)).toEqualTypeOf<number | undefined>();
expectTypeOf(new Set<number | string>().find((value): value is number => typeof value === "number")).toEqualTypeOf<
  number | undefined
>();
expectTypeOf(new Set<"a" | "b">().find((value): value is "a" => value === "a")).toEqualTypeOf<"a" | undefined>();
