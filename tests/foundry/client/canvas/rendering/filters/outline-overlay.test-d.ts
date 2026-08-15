import { expectTypeOf } from "vitest";

import OutlineOverlayFilter = foundry.canvas.rendering.filters.OutlineOverlayFilter;

let myOOF;
expectTypeOf((myOOF = OutlineOverlayFilter.create())).toEqualTypeOf<OutlineOverlayFilter>();
expectTypeOf(myOOF.thickness).toEqualTypeOf<number>();
