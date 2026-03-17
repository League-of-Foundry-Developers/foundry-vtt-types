import { expectTypeOf } from "vitest";

import VoidFilter = foundry.canvas.rendering.filters.VoidFilter;

const myVoidFilter = VoidFilter.create();
expectTypeOf(myVoidFilter).toEqualTypeOf<VoidFilter>();

expectTypeOf(VoidFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myVoidFilter.padding).toEqualTypeOf<number>();
