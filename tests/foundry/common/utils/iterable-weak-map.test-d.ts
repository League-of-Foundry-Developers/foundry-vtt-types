import { expectTypeOf } from "vitest";

const m = new foundry.utils.IterableWeakMap<{ x: number }, { y: string }>();

expectTypeOf(m.delete({ x: 1 })).toEqualTypeOf<boolean>();
expectTypeOf(m.get({ x: 1 })).toEqualTypeOf<{ y: string } | undefined>();

expectTypeOf(m.set({ x: 1 }, { y: "2" })).toEqualTypeOf<IterableWeakMap<{ x: number }, { y: string }>>();

expectTypeOf(m.entries()).toEqualTypeOf<Generator<[{ x: number }, { y: string }], void, never>>();
expectTypeOf(m.keys()).toEqualTypeOf<Generator<{ x: number }, void, never>>();
expectTypeOf(m.values()).toEqualTypeOf<Generator<{ y: string }, void, never>>();

// Make sure void method exists by checking return type
expectTypeOf(m.clear()).toEqualTypeOf<void>();
