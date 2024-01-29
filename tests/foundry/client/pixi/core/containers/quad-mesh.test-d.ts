import { expectTypeOf } from "vitest";

const myBaseSamplerShaderQuadMesh = new QuadMesh(BaseSamplerShader);

expectTypeOf(myBaseSamplerShaderQuadMesh.scale.x).toEqualTypeOf<number>();
