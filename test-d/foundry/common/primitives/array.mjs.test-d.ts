import { expectType } from "tsd";
import "../../index";

expectType<string[]>([["testing"], "test"].deepFlatten());

expectType<["a"[], "b"[]]>(Array<"a" | "b">().partition((val): val is "b" => val === "b"));
expectType<[number[], string[]]>([1, ""].partition((val): val is string => typeof val === "string"));
expectType<[string[], string[]]>(Array<string>().partition((val): boolean => val.length < 5));
expectType<[string[], string[]]>(Array<string>().partition((val) => val.length < 5));
