import { expectTypeOf } from "vitest";

const m = new foundry.utils.IterableWeakSet<{ x: number }>();

expectTypeOf(m.add({ x: 1 })).toEqualTypeOf<IterableWeakSet<{ x: number }>>();
expectTypeOf(m.delete({ x: 1 })).toEqualTypeOf<boolean>();
expectTypeOf(m.has({ x: 1 })).toEqualTypeOf<boolean>();

expectTypeOf(m.values()).toEqualTypeOf<Generator<{ x: number }, void, never>>();

expectTypeOf(m.clear()).toBeVoid();
