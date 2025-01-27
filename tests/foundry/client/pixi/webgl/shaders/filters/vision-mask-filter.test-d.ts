import { expectTypeOf } from "vitest";

let myVMF;

expectTypeOf(VisionMaskFilter.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myVMF = VisionMaskFilter.create())).toEqualTypeOf<VisionMaskFilter>();

expectTypeOf(myVMF.enabled).toEqualTypeOf<boolean>();
