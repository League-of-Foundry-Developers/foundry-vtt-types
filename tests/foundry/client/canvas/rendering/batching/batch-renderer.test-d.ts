import { expectTypeOf, test } from "vitest";

import BatchRenderer = foundry.canvas.rendering.batching.BatchRenderer;
import BatchShaderGenerator = foundry.canvas.rendering.batching.BatchShaderGenerator;

declare const someRenderer: PIXI.Renderer;

test("foundry/client/canvas/rendering/batching/batch-renderer", () => {
  expectTypeOf(BatchRenderer.shaderGeneratorClass).toEqualTypeOf<typeof BatchShaderGenerator>();
  expectTypeOf(BatchRenderer.hasPlugin("bob")).toEqualTypeOf<boolean>;
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
});
