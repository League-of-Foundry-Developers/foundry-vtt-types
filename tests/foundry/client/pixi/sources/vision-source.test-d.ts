import { expectTypeOf } from "vitest";

const myVision = new VisionSource();

const myShader = AdaptiveLightingShader.create();

expectTypeOf(myVision._updateVisionModeUniforms(myShader, [["myUniform", 3]])).toEqualTypeOf<void>();
