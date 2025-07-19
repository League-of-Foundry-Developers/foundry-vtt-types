import { expect, expectTypeOf } from "vitest";
import BitMask = foundry.utils.BitMask;

new BitMask();
const states = { foo: true, bar: false } as const;
const b = new BitMask(states);

// test assignability to number
const n: number = b;

expect(n).toBe(1);

expectTypeOf(b.states).toEqualTypeOf<
  Readonly<{
    foo: "foo";
    bar: "bar";
  }>
>();
expectTypeOf(b.isEmpty).toEqualTypeOf<boolean>();

// @ts-expect-error only valid states should work
expectTypeOf(b.hasState("a")).toEqualTypeOf<boolean>();
expectTypeOf(b.hasState("foo")).toEqualTypeOf<boolean>();

// @ts-expect-error only valid states should work
expectTypeOf(b.addState("a")).toEqualTypeOf<void>();
expectTypeOf(b.addState("foo")).toEqualTypeOf<void>();

// @ts-expect-error only valid states should work
expectTypeOf(b.removeState("a")).toEqualTypeOf<void>();
expectTypeOf(b.removeState("bar")).toEqualTypeOf<void>();

// @ts-expect-error only valid states should work
expectTypeOf(b.toggleState("a", true)).toEqualTypeOf<void>();
expectTypeOf(b.toggleState("bar")).toEqualTypeOf<number>();
expectTypeOf(b.toggleState("foo", true)).toEqualTypeOf<void>();

expectTypeOf(b.clear()).toEqualTypeOf<void>();
expectTypeOf(b.valueOf()).toEqualTypeOf<number>();
expectTypeOf(b.toString()).toEqualTypeOf<string>();

const b2 = new BitMask({ a: true });
expectTypeOf(b.isCompatible(b2)).toEqualTypeOf<boolean>();

expectTypeOf(b.toJSON()).toEqualTypeOf<string>();

expectTypeOf(BitMask.fromJSON('{"a": true}')).toEqualTypeOf<BitMask.Any>();
expectTypeOf(b.toObject()).toEqualTypeOf<typeof b>();
expectTypeOf(b.clone()).toEqualTypeOf<typeof b>();

expectTypeOf(BitMask.generateShaderBitMaskConstants(["a"])).toEqualTypeOf<string>();
