import { expectTypeOf, test } from "vitest";

import BatchShaderGenerator = foundry.canvas.rendering.batching.BatchShaderGenerator;

test("foundry/client/canvas/rendering/batching/batch-shader-generator", () => {
  const myBSG = new BatchShaderGenerator("some glsl", "some other glsl", {
    foo: true,
    bar: 5,
    baz: [1, 2, 2],
  });

  expectTypeOf(myBSG.generateShader(4)).toEqualTypeOf<PIXI.Shader>();
});
