import { expectTypeOf } from "vitest";

const myBatchRenderer = new BatchRenderer(new PIXI.Renderer());

expectTypeOf(myBatchRenderer.uniforms).toEqualTypeOf<AbstractBaseShader.Uniforms | undefined>();
expectTypeOf(myBatchRenderer.reservedTextureUnits).toEqualTypeOf<BatchRenderer.ReservedTextureUnits>();
expectTypeOf(
  myBatchRenderer.setShaderGenerator({
    vertex: "path/to/vertex",
    fragment: "path/to/fragment",
    uniforms: (maxTex: number) => ({ maxTex }),
  }),
).toEqualTypeOf<void>();

expectTypeOf(BatchRenderer.hasPlugin("foo")).toEqualTypeOf<boolean>();
