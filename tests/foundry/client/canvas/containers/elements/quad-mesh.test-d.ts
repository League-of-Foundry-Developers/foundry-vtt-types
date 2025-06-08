import { expectTypeOf } from "vitest";
import { QuadMesh } from "#client/canvas/containers/_module.mjs";

const myBaseSamplerShaderQuadMesh = new QuadMesh(BaseSamplerShader);

expectTypeOf(myBaseSamplerShaderQuadMesh.scale.x).toEqualTypeOf<number>();
expectTypeOf(myBaseSamplerShaderQuadMesh.shader).toEqualTypeOf<AbstractBaseShader>();
expectTypeOf(myBaseSamplerShaderQuadMesh.containsPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
