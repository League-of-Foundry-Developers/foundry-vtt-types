import { expectTypeOf } from "vitest";

const m = new IterableWeakMap<{ x: number }, { y: string }>();

expectTypeOf(m.get({ x: 1 })).toEqualTypeOf<{ y: string } | undefined>();

expectTypeOf(m.set({ x: 1 }, { y: "2" })).toEqualTypeOf<IterableWeakMap<{ x: number }, { y: string }>>();

expectTypeOf(m.entries()).toEqualTypeOf<Generator<[{ x: number }, { y: string }], void, any>>();
expectTypeOf(m.keys()).toEqualTypeOf<Generator<{ x: number }, void, any>>();
expectTypeOf(m.values()).toEqualTypeOf<Generator<{ y: string }, void, any>>();
