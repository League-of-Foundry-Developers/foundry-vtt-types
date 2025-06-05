import { expectTypeOf } from "vitest";
import { VisionMaskFilter } from "#client/canvas/rendering/filters/_module.mjs";

const myVMF = VisionMaskFilter.create();
expectTypeOf(myVMF).toEqualTypeOf<VisionMaskFilter>();

expectTypeOf(VisionMaskFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myVMF.enabled).toEqualTypeOf<boolean>();
