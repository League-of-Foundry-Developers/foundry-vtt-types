import { expectTypeOf } from "vitest";

let myVoidFilter;

expectTypeOf(VoidFilter.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myVoidFilter = VoidFilter.create())).toEqualTypeOf<VoidFilter>();

expectTypeOf(myVoidFilter.padding).toEqualTypeOf<number>();
