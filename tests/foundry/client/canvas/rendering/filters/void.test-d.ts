import { expectTypeOf } from "vitest";
import { VoidFilter } from "#client/canvas/rendering/filters/_module.mjs";

const myVoidFilter = VoidFilter.create();
expectTypeOf(myVoidFilter).toEqualTypeOf<VoidFilter>();

expectTypeOf(VoidFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myVoidFilter.padding).toEqualTypeOf<number>();
