import { expectTypeOf } from "vitest";

const b = new foundry.utils.BitMask();

expectTypeOf(b.states).toEqualTypeOf<Readonly<Record<string, string>>>();
expectTypeOf(b.isEmpty).toEqualTypeOf<boolean>();
expectTypeOf(b.hasState("a")).toEqualTypeOf<boolean>();
expectTypeOf(b.addState("a")).toEqualTypeOf<void>();
expectTypeOf(b.removeState("a")).toEqualTypeOf<void>();

expectTypeOf(b.toggleState("a", true)).toEqualTypeOf<void>();
expectTypeOf(b.toggleState("a")).toEqualTypeOf<number>();

expectTypeOf(b.clear()).toEqualTypeOf<void>();
expectTypeOf(b.valueOf()).toEqualTypeOf<number>();
expectTypeOf(b.toString()).toEqualTypeOf<string>();

const b2 = new foundry.utils.BitMask({ a: true });
expectTypeOf(b.isCompatible(b2)).toEqualTypeOf<boolean>();

expectTypeOf(b.toJSON()).toEqualTypeOf<string>();

expectTypeOf(foundry.utils.BitMask.fromJSON("{a: true}")).toEqualTypeOf<foundry.utils.BitMask>();
expectTypeOf(b.toObject()).toEqualTypeOf<Record<string, boolean>>();
expectTypeOf(b.clone()).toEqualTypeOf<foundry.utils.BitMask>();

expectTypeOf(foundry.utils.BitMask.generateShaderBitMaskConstants(["a"])).toEqualTypeOf<string>();
