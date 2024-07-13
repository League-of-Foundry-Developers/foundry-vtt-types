import { expectTypeOf } from "vitest";

const m = new IterableWeakSet<{ x: number }>();

expectTypeOf(m.add({ x: 1 })).toEqualTypeOf<IterableWeakSet<{ x: number }>>();

expectTypeOf(m.values()).toEqualTypeOf<Generator<{ x: number }, void, never>>();

expectTypeOf(m.clear()).toBeVoid();
