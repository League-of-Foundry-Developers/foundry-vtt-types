import { expectTypeOf } from "vitest";

// `Object.freeze` preserves literal types so that frozen constant tables keep their exact values.
expectTypeOf(Object.freeze({ a: 1, b: "x" })).toEqualTypeOf<Readonly<{ a: 1; b: "x" }>>();
expectTypeOf(Object.freeze(["a", "b"])).toEqualTypeOf<readonly ["a", "b"]>();
