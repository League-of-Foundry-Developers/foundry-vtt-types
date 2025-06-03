import { expectTypeOf } from "vitest";

const { BatchRenderer, BatchShaderGenerator: _BatchShaderGenerator } = foundry.canvas.rendering.batching;

expectTypeOf(BatchRenderer.shaderGeneratorClass).toEqualTypeOf<typeof _BatchShaderGenerator>();
expectTypeOf(BatchRenderer.hasPlugin("bob")).toEqualTypeOf<boolean>;

declare const someRenderer: PIXI.Renderer;
const myBR = new BatchRenderer(someRenderer);

expectTypeOf(myBR.reservedTextureUnits).toEqualTypeOf<BatchRenderer.ReservedTextureUnits>();
expectTypeOf(myBR.start()).toEqualTypeOf<void>();
expectTypeOf(
  myBR.setShaderGenerator({
    vertex: "path/to/vertex",
    fragment: "path/to/fragment",
    uniforms: (maxTex: number) => ({ maxTex }),
  }),
).toEqualTypeOf<void>();
