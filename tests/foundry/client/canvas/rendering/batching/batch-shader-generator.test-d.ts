import { expectTypeOf } from "vitest";

const myBSG = new BatchShaderGenerator("some glsl", "some other glsl", {
  foo: true,
  bar: 5,
  baz: [1, 2, 2],
});

expectTypeOf(myBSG.generateShader(4)).toEqualTypeOf<PIXI.Shader>();
