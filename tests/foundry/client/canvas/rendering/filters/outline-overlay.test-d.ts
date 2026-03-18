import { expectTypeOf } from "vitest";

import OutlineOverlayFilter = foundry.canvas.rendering.filters.OutlineOverlayFilter;

expectTypeOf(OutlineOverlayFilter.vertexShader).toEqualTypeOf<string>();
expectTypeOf(OutlineOverlayFilter.createFragmentShader()).toEqualTypeOf<string>();

let myOOF;
expectTypeOf((myOOF = OutlineOverlayFilter.create())).toEqualTypeOf<OutlineOverlayFilter>();
expectTypeOf(myOOF.thickness).toEqualTypeOf<number>();
