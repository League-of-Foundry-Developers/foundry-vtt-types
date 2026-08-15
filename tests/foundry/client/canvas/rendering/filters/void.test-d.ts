import { expectTypeOf } from "vitest";

import VoidFilter = foundry.canvas.rendering.filters.VoidFilter;

const myVoidFilter = VoidFilter.create();
expectTypeOf(myVoidFilter).toEqualTypeOf<VoidFilter>();

expectTypeOf(myVoidFilter.padding).toEqualTypeOf<number>();
