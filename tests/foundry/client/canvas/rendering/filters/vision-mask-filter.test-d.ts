import { expectTypeOf } from "vitest";

import VisionMaskFilter = foundry.canvas.rendering.filters.VisionMaskFilter;

const myVMF = VisionMaskFilter.create();
expectTypeOf(myVMF).toEqualTypeOf<VisionMaskFilter>();

expectTypeOf(VisionMaskFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myVMF.enabled).toEqualTypeOf<boolean>();
